import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {renderNotion as renderSaved} from './markdown.mjs';
import {parseDocument} from './build-content.mjs';
const labels=JSON.parse(await readFile(new URL('../content/interface.json',import.meta.url),'utf8')).article;
const renderNotion=(markdown,pages=[])=>renderSaved(markdown,pages,{labels});

test('native Notion tables preserve inline formatting and column headings', () => {
  const {html} = renderNotion('<table header-row="true">\n<tr><td>名称</td><td>结果</td></tr>\n<tr><td>`mean_zscore`</td><td>**−3**<br>假设值</td></tr>\n</table>');
  assert.match(html, /<th scope="col">名称<\/th>/);
  assert.match(html, /<code>mean_zscore<\/code>/);
  assert.match(html, /<strong>−3<\/strong><br>假设值/);
  assert.match(html, /class="article-table"/);
});

test('page mentions become local article links without changing literal code', () => {
  const id = '3fb6dacbbc7e81cd9e28d11916c8b53f';
  const mention = `<mention-page url="https://app.notion.com/p/${id}"/>`;
  const {html} = renderNotion('上一篇：' + mention + '\n```text\n' + mention + '\n<strategy>\n```', [{id, slug:'chapter-one', title:'第一章'}]);
  assert.match(html, /href="#\/blog\/chapter-one">第一章<\/a>/);
  assert.match(html, /&lt;strategy&gt;/);
  assert.match(html, /&lt;mention-page/);
});

test('separate Notion text blocks remain paragraphs and unsafe HTML stays inert', () => {
  const {html} = renderNotion('第一段\n第二段\n<script>alert(1)</script>\n[链接](javascript:alert%281%29)');
  assert.match(html, /<p>第一段<\/p>\s*<p>第二段<\/p>/);
  assert.doesNotMatch(html, /<script|href="javascript:/);
});

test('every saved article retains all tables and fenced code blocks', async () => {
  const directory = new URL('../content/posts/', import.meta.url);
  const {readdir}=await import('node:fs/promises');
  const files=(await readdir(directory)).filter(file=>file.endsWith('.md'));
  const manifest={posts:await Promise.all(files.map(async file=>({...parseDocument(await readFile(new URL(file,directory),'utf8')).meta,file})))};
  assert.equal(manifest.posts.filter(post=>post.format==='notion').length, 8);
  for (const page of manifest.posts) {
    const {body:markdown} = parseDocument(await readFile(new URL(page.file,directory),'utf8'));
    const {html} = renderNotion(markdown, manifest.posts);
    assert.equal((html.match(/<table>/g) || []).length, (markdown.match(/<table\b/g) || []).length, page.title + ': tables');
    assert.equal((html.match(/<pre><code/g) || []).length, (markdown.match(/^```/gm) || []).length / 2, page.title + ': code');
    assert.doesNotMatch(html, /<mention-page|<empty-block|NOTIONTABLEPLACEHOLDER/);
    for (const [, code] of markdown.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)) {
      const escaped = code.replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
      assert.ok(html.includes(escaped), page.title + ': literal code');
    }
  }
});
