import test from 'node:test';
import assert from 'node:assert/strict';
import {cp,mkdtemp,writeFile,readFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadContent,root,parseDocument} from './build-content.mjs';

async function fixture(t){
  const path=await mkdtemp(join(tmpdir(),'plus86-content-'));
  await cp(join(root,'content'),path,{recursive:true});
  t.after(()=>rm(path,{recursive:true,force:true}));
  return path;
}

test('new nested Markdown files, removal and drafts need no manifest changes',async t=>{
  const path=await fixture(t),before=await loadContent(path);
  await mkdir(join(path,'posts/new-folder'));
  const file=join(path,'posts/new-folder/我的记录.md');
  await writeFile(file,'# 我的记录\n\n一个独特的检索词：银河散步。\n\n## 起点\n\n| 地点 | 心情 |\n| --- | --- |\n| 海边 | 轻松 |\n');
  const added=await loadContent(path),post=added.posts.find(p=>p.slug==='我的记录');
  assert.equal(added.posts.length,before.posts.length+1);
  assert.equal(post.title,'我的记录');assert.equal(post.tag,'notes');
  assert.match(post.searchText,/银河散步/);assert.match(post.body,/<table>/);assert.equal(post.toc.length,1);
  await writeFile(file,'---\ntitle: 草稿\ndraft: true\n---\n\n尚未发表。');
  assert.equal((await loadContent(path)).posts.length,before.posts.length);
  await rm(file);
  assert.equal((await loadContent(path)).posts.length,before.posts.length);
});

test('local links and media work for Chinese filenames and nested articles',async t=>{
  const path=await fixture(t);
  await mkdir(join(path,'posts/nested'));
  await writeFile(join(path,'posts/另一篇.md'),'# 另一篇\n\n另一篇正文。');
  await writeFile(join(path,'media/湖边.jpg'),'image fixture');
  await writeFile(join(path,'posts/nested/links.md'),'---\ntitle: 链接测试\ndate: 2026-10-19\n---\n\n[另一篇](../另一篇.md)\n\n![湖边](../../media/湖边.jpg)\n\n[未知笔记](https://app.notion.com/p/00000000000000000000000000000000)');
  const post=(await loadContent(path)).posts.find(p=>p.slug==='links');
  assert.match(post.body,/href="#\/blog\/%E5%8F%A6%E4%B8%80%E7%AF%87"/);
  assert.match(post.body,/src="\/assets\/content\/%E6%B9%96%E8%BE%B9.jpg"/);
  assert.match(post.body,/href="https:\/\/app.notion.com\/p\/00000000000000000000000000000000"/);
});

test('site identity, UI copy and page prose are loaded only from content',async t=>{
  const path=await fixture(t);
  const site=JSON.parse(await readFile(join(path,'site.json'),'utf8'));
  site.name='新的昵称';await writeFile(join(path,'site.json'),JSON.stringify(site));
  const ui=JSON.parse(await readFile(join(path,'interface.json'),'utf8'));
  ui.blog.empty='自己填写的空状态';await writeFile(join(path,'interface.json'),JSON.stringify(ui));
  await writeFile(join(path,'pages/now.md'),'---\ntitle: 自己的近况\nlead: 最近在学习\n---\n\n## 新计划\n\n自己写的新段落。');
  const result=await loadContent(path);
  assert.equal(result.site.name,'新的昵称');assert.equal(result.ui.blog.empty,'自己填写的空状态');
  assert.equal(result.pages.home.greeting,'我是 新的昵称。');assert.equal(result.pages.about.title,'你好，我是 新的昵称');
  assert.match(result.pages.now.body,/自己写的新段落/);
  assert.ok(result.travel.entries.every(e=>e.credit==='新的昵称 的相册'));
});

test('invalid content fails with file information before replacing a valid site',async t=>{
  const path=await fixture(t);
  await writeFile(join(path,'posts/bad-date.md'),'---\ntitle: 日期测试\ndate: 2026-02-30\n---\n\n正文');
  await assert.rejects(loadContent(path),/posts\/bad-date.md.*date/);
  await rm(join(path,'posts/bad-date.md'));
  await writeFile(join(path,'posts/duplicate.md'),'---\ntitle: 重复测试\nslug: statarb-learning-guide\n---\n\n正文');
  await assert.rejects(loadContent(path),/重复的文章 slug/);
  await rm(join(path,'posts/duplicate.md'));
  const ui=JSON.parse(await readFile(join(path,'interface.json'),'utf8'));delete ui.article.toc;
  await writeFile(join(path,'interface.json'),JSON.stringify(ui));
  await assert.rejects(loadContent(path),/interface.json: article.toc/);
  assert.throws(()=>parseDocument('---\ntitle: "未结束\n---\n\n正文','test.md'),/test.md.*引号/);
});

test('all original photos, tables and code remain in the central collection',async()=>{
  const {posts,travel}=await loadContent();
  assert.equal(posts.length,8);assert.equal(travel.entries.length,59);
  assert.equal(posts.reduce((n,p)=>n+(p.body.match(/<table>/g)||[]).length,0),29);
  assert.equal(posts.reduce((n,p)=>n+(p.body.match(/<pre><code/g)||[]).length,0),36);
  assert.ok(posts.every(p=>p.sourceUrl));
});

test('portfolio discovers, orders and removes new works without a manual index',async t=>{
  const path=await fixture(t),initial=await loadContent(path);
  assert.deepEqual(initial.works.map(w=>w.slug),['qishui-music','talkie-xingye','wechat-official-accounts','plumber']);
  await mkdir(join(path,'works/nested'));
  const file=join(path,'works/nested/new-work.md');
  await writeFile(file,'---\ntitle: 新作品\norder: 0\n---\n\n## 我的贡献\n\n一项新的实践。');
  const added=(await loadContent(path)).works;
  assert.equal(added.length,5);assert.equal(added[0].slug,'new-work');assert.equal(added[0].visual.type,'generic');
  assert.match(added[0].body,/一项新的实践/);assert.equal(added[0].toc[0].title,'我的贡献');
  await writeFile(file,'---\ntitle: 新作品\ndraft: true\n---\n\n草稿。');
  assert.equal((await loadContent(path)).works.length,4);
  await rm(file);assert.equal((await loadContent(path)).works.length,4);
});

test('portfolio cover files stay within content media and require descriptive alt text',async t=>{
  const path=await fixture(t),file=join(path,'works/cover-check.md');
  await writeFile(join(path,'media/cover.jpg'),'cover fixture');
  await writeFile(file,'---\ntitle: 封面测试\ncover: ../media/cover.jpg\ncoverAlt: 项目的实际界面\n---\n\n正文。');
  const work=(await loadContent(path)).works.find(w=>w.slug==='cover-check');
  assert.equal(work.cover,'/assets/content/cover.jpg');assert.equal(work.coverAlt,'项目的实际界面');
  await writeFile(file,'---\ntitle: 封面测试\ncover: ../media/cover.jpg\n---\n\n正文。');
  await assert.rejects(loadContent(path),/coverAlt/);
  await writeFile(file,'---\ntitle: 封面测试\ncover: ../../README.md\ncoverAlt: 不应发布的文件\n---\n\n正文。');
  await assert.rejects(loadContent(path),/content\/media/);
});

test('portfolio metadata rejects duplicate routes and does not embed resume contact details',async t=>{
  const path=await fixture(t),result=await loadContent(path);
  assert.doesNotMatch(JSON.stringify(result.works),/\b\d{11}\b|@gmail\.com|Mobile Documents|\.local\.toml/);
  await writeFile(join(path,'works/duplicate.md'),'---\ntitle: 重复作品\nslug: plumber\n---\n\n正文。');
  await assert.rejects(loadContent(path),/重复的作品 slug/);
});
