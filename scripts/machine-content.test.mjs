import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,cp,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {loadContent,root} from './build-content.mjs';
import {escapeHtml,plainText} from './markdown.mjs';
import {buildMachineContent,injectMachineContent,htmlToMarkdown,readerPath,staleMachineFiles} from './machine-content.mjs';

const key=url=>decodeURIComponent(url.slice(1));
const get=(result,language,kind,slug='',extension='html')=>result.outputs.get(key(readerPath(language,kind,slug,extension)));
const includesCopy=(html,value)=>assert.ok(html.includes(escapeHtml(value)),value);

test('all published pages, articles and works have standalone bilingual HTML and Markdown',async()=>{
  const content=await loadContent(),result=buildMachineContent(content),index=result.index;
  assert.equal(index.documents.length,2*(5+content.posts.length+content.works.length));
  assert.equal(index.counts.posts,15);assert.equal(index.counts.works,4);assert.equal(index.counts.travel,59);
  assert.equal(index.counts.fullyTranslatedEnglishPosts,7);
  assert.equal(new Set(index.documents.map(doc=>doc.html)).size,index.documents.length);
  for(const doc of index.documents){
    const html=result.outputs.get(key(doc.html)),markdown=result.outputs.get(key(doc.markdown));
    assert.ok(html&&markdown,doc.html);includesCopy(html,doc.title);
    assert.ok(markdown.startsWith('# '+doc.title+'\n'),doc.markdown);
    assert.match(html,/<main><article>/);assert.doesNotMatch(html,/<(?:script|button|details)\b/);
    assert.ok(html.includes(`href="${doc.markdown}"`));
    assert.ok(html.includes(`href="${doc.interactive.replace(/&/g,'&amp;')}"`));
    assert.doesNotMatch(html,/machine-content:|\u0001SAVED\d+\u0002/);
  }
  for(const language of ['zh','en']){
    const data=language==='zh'?content:content.english;
    for(const post of data.posts){
      const html=get(result,language,'post',post.slug),doc=index.documents.find(doc=>doc.language===language&&doc.kind==='post'&&doc.slug===post.slug);
      assert.ok(plainText(html).includes(plainText(post.body)),post.slug+': complete source body');
      assert.equal(doc.sourceLanguage,post.contentLanguage||language);
      if(doc.sourceLanguage!==language){includesCopy(html,data.ui.article.originalNotice);assert.match(html,/<div lang="zh-CN">/)}
    }
  }
});

test('all architecture nodes, results, media captions and demo branches are expanded without interaction',async()=>{
  const content=await loadContent(),result=buildMachineContent(content);
  for(const language of ['zh','en']){
    const data=language==='zh'?content:content.english;
    for(const work of data.works){
      const html=get(result,language,'project',work.slug),markdown=get(result,language,'project',work.slug,'md');
      assert.ok(plainText(html).includes(plainText(work.body)),work.slug+': project notes');
      const copy=work.caseStudy?.copy[language];if(!copy)continue;
      for(const value of [copy.intro,copy.outcomeNote,copy.mediaNote])includesCopy(html,value);
      for(const scene of copy.scenes)for(const value of Object.values(scene))includesCopy(html,value);
      for(const item of copy.decisions)for(const value of Object.values(item))includesCopy(html,value);
      for(const node of copy.architecture?.layers.flatMap(layer=>layer.nodes)||[]){
        includesCopy(html,node.title);includesCopy(html,node.detail);assert.ok(markdown.includes(node.detail));
      }
      if(copy.architecture)includesCopy(html,copy.architecture.note);
      if(copy.results){
        for(const field of ['lead','note','indexNote','rawNote'])includesCopy(html,copy.results[field]);
        for(const metric of copy.results.metrics){
          includesCopy(html,metric.title);includesCopy(html,metric.description);
          assert.ok(html.includes(String(metric.before)));assert.ok(html.includes(String(metric.after)));
        }
      }
      if(copy.evidence){
        const evidence=copy.evidence;
        for(const value of [evidence.title,evidence.lead,evidence.note,evidence.run.date])includesCopy(html,value);
        for(const outcome of evidence.run.outcomes){includesCopy(html,outcome.description);assert.ok(markdown.includes(outcome.description));}
      }
      if(copy.lab.verdicts)for(const value of [...copy.lab.verdicts,...copy.lab.completions]){includesCopy(html,value);assert.ok(markdown.includes(value));}
      includesCopy(html,copy.lab.footnote);
      for(const mode of copy.lab.modes)includesCopy(html,mode);
      for(const stage of copy.lab.stages)for(const value of Object.values(stage))includesCopy(html,value);
      for(const card of [...(copy.lab.cards||[]),...(copy.lab.replacement?[copy.lab.replacement]:[])]){includesCopy(html,card.title);includesCopy(html,card.category)}
      for(const media of work.caseStudy.media)assert.ok(html.includes(media.src));
    }
  }
});

test('the text travel edition includes every photo, caption, place and journal paragraph',async()=>{
  const content=await loadContent(),result=buildMachineContent(content);
  for(const language of ['zh','en']){
    const data=language==='zh'?content:content.english,html=get(result,language,'travel');
    for(const place of data.travel.places){includesCopy(html,place.name);includesCopy(html,place.note)}
    for(const entry of data.travel.entries){
      for(const text of [entry.title,entry.alt,entry.excerpt,...entry.body])includesCopy(html,text);
      assert.ok(html.includes(entry.photo));
    }
  }
});

test('Markdown exports preserve quotations, nested lists, literal code and all Notion tables',async()=>{
  const literal='const sample = "<strategy> & `tick`";\n';
  const markdown=htmlToMarkdown('<blockquote><p>first</p><p><strong>second</strong></p></blockquote><ol><li>parent<ul><li>child</li></ul></li></ol><pre><code class="language-js">'+escapeHtml(literal)+'</code></pre><p><code>a`b</code></p>');
  assert.match(markdown,/> first\n> \n> \*\*second\*\*/);
  assert.match(markdown,/1\. parent\n+ {4}- child/);
  assert.ok(markdown.includes('```js\n'+literal+'```'));assert.ok(markdown.includes('``a`b``'));
  const content=await loadContent(),result=buildMachineContent(content);
  for(const language of ['zh','en']){
    const posts=(language==='zh'?content:content.english).posts;
    for(const post of posts){
      const output=get(result,language,'post',post.slug,'md');
      assert.equal((output.match(/<table\b/g)||[]).length,(post.body.match(/<table\b/g)||[]).length,post.slug+': tables');
      for(const [,code] of post.body.matchAll(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g)){
        const literal=code.replace(/&(amp|lt|gt|quot|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[name]));
        assert.ok(output.includes(literal),post.slug+': literal code and whitespace');
      }
    }
  }
});

test('the initial home response has real content and discovery links without adding navigation items',async()=>{
  const content=await loadContent(),result=buildMachineContent(content),template=await readFile(join(root,'src/index.template.html'),'utf8');
  const html=injectMachineContent(template,result),main=/<main[^>]*>([\s\S]*?)<\/main>/.exec(html)[1];
  assert.match(main,/<h1>/);assert.doesNotMatch(main,/<noscript|\bhidden\b|display\s*:\s*none/);
  for(const work of content.works)assert.ok(main.includes(readerPath('zh','project',work.slug)));
  for(const post of content.posts)assert.ok(main.includes(readerPath('zh','post',post.slug)));
  assert.match(html,/<link[^>]*href="\/llms.txt"/);assert.match(html,/<link[^>]*href="\/read\/index.json"/);
  const originalNav=/<nav class="primary-nav"[^>]*>[\s\S]*?<\/nav>/.exec(template)[0];
  assert.ok(html.includes(originalNav));assert.doesNotMatch(originalNav,/llms|\/read\//);
  assert.throws(()=>injectMachineContent('<html></html>',result),/Missing template marker/);
});

test('the reader directory and rewritten article links point to generated files, including Chinese routes',async()=>{
  const content=await loadContent(),result=buildMachineContent(content);
  for(const doc of result.index.documents){
    assert.ok(doc.html.startsWith('/read/'+doc.language+'/'));assert.doesNotMatch(doc.html,/#/);
    for(const [,url] of result.outputs.get(key(doc.html)).matchAll(/href="(\/read\/[^"#]+)"/g))assert.ok(result.outputs.has(key(url)),url);
  }
  assert.match(get(result,'zh','post','statarb-learning-guide'),/href="\/read\/zh\/blog\/statarb-01-how-it-makes-money.html"/);
  const chinese=readerPath('en','post','魔术师');
  assert.match(chinese,/%E9/);assert.ok(result.outputs.has(key(chinese)));
  assert.doesNotMatch(result.outputs.get('llms.txt'),/original-posts|archived-pages|now\.md|#\/now/);
});

test('LLM reading guides focus on professional identity, ordered projects and current contact details',async()=>{
  const content=await loadContent();
  for(const data of [content,content.english]){
    data.pages.about.body+='<p>UNRELATED_ABOUT_BODY</p>';
    data.posts[0].body+='<p>UNRELATED_ARTICLE_BODY</p>';
    data.travel.entries[0].body.push('UNRELATED_TRAVEL_BODY');
    data.site.email='updated-contact@example.com';
    data.site.socials.wechat.username='UpdatedWechat';
  }
  const result=buildMachineContent(content),llms=result.outputs.get('llms.txt'),full=result.outputs.get('llms-full.txt');
  const allowed=new Set();
  for(const language of ['zh','en']){
    const data=language==='zh'?content:content.english;
    for(const output of [llms,full]){
      for(const value of [data.pages.about.lead,data.pages.home.heroStandard,data.pages.work.llmsGuide])assert.ok(output.includes(value),value);
      assert.match(output,/mailto:updated-contact@example.com/);assert.match(output,/UpdatedWechat/);
      for(const profile of Object.values(data.site.socials)){
        if(profile.username)assert.ok(output.includes(profile.username));
        if(profile.url)assert.ok(output.includes(profile.url));
      }
    }
    const positions=data.works.map(work=>{
      const path=readerPath(language,'project',work.slug,'md');allowed.add(path);
      assert.ok(full.includes(get(result,language,'project',work.slug,'md')),work.slug+': complete case study');
      return llms.indexOf(path);
    });
    assert.ok(positions.every((position,index)=>position>=0&&(!index||position>positions[index-1])));
  }
  for(const output of [llms,full])assert.doesNotMatch(output,/UNRELATED_|\/read\/index\.json|\/read\/(?:zh|en)\/(?:index|about|blog|travel)[./]|statistical arbitrage|统计套利|plumber/);
  for(const [,url] of llms.matchAll(/\]\((\/read\/[^)]+)\)/g))assert.ok(allowed.has(url),url);
  assert.match(get(result,'zh','about'),/UNRELATED_ABOUT_BODY/);
  assert.match(get(result,'zh','post',content.posts[0].slug),/UNRELATED_ARTICLE_BODY/);
  assert.match(get(result,'zh','travel'),/UNRELATED_TRAVEL_BODY/);
});

test('new posts update every reading edition while drafts and removals disappear',async t=>{
  const directory=await mkdtemp(join(tmpdir(),'plus86-reader-'));t.after(()=>rm(directory,{recursive:true,force:true}));
  await cp(join(root,'content'),directory,{recursive:true});
  const file=join(directory,'posts/新文章.md');
  await writeFile(file,'# 一篇新文章\n\n独特的正文标记：日落海岸。');
  let result=buildMachineContent(await loadContent(directory));
  for(const language of ['zh','en'])assert.ok(get(result,language,'post','新文章').includes('日落海岸'));
  const previous=result.index;
  await writeFile(file,'---\ntitle: 私人草稿\ndraft: true\n---\n\n不能出现在发布目录的标记。');
  result=buildMachineContent(await loadContent(directory));
  for(const value of result.outputs.values())assert.doesNotMatch(value,/私人草稿|不能出现在发布目录的标记/);
  const stale=staleMachineFiles(previous,result.outputs);
  for(const language of ['zh','en'])for(const extension of ['html','md'])assert.ok(stale.includes(key(readerPath(language,'post','新文章',extension))));
  await rm(file);
  assert.equal(buildMachineContent(await loadContent(directory)).index.counts.posts,15);
});

test('cleanup only targets previous generated documents and never follows escaped paths',()=>{
  const previous={documents:[
    {html:'/read/zh/blog/deleted.html',markdown:'/read/zh/blog/deleted.md'},
    {html:'/read/zh/blog/keep.html'},
    {html:'/read/zh/blog/%2e%2e%2fprivate.html'},
    {html:'/read/zh/blog/%2fprivate.html'},
    {html:'/read/zh/blog/%5cprivate.html'},
    {html:'/read/zh/blog/%00private.html'},
    {html:'/read/zh/blog/%E9%AD%94%E6%9C%AF%E5%B8%88.html'},
    {html:'../../content/site.json'},{html:'/README.md'},{html:null}
  ]};
  assert.deepEqual(staleMachineFiles(previous,new Map([['read/zh/blog/keep.html','retained']])),['read/zh/blog/deleted.html','read/zh/blog/deleted.md','read/zh/blog/魔术师.html']);
  assert.throws(()=>readerPath('zh','post','../bad'),/Invalid reader slug/);
});

test('articles and works named index never overwrite their collection pages',async()=>{
  const content=await loadContent();
  const post={...content.posts[0],slug:'index',title:'Index article',body:'<p>A complete article.</p>'};
  const work={...content.works.at(-1),slug:'index',title:'Index project',body:'<p>A complete project.</p>'};
  const changed={...content,posts:[...content.posts,post],works:[...content.works,work],english:{...content.english,posts:[...content.english.posts,post],works:[...content.english.works,work]}};
  const result=buildMachineContent(changed);
  assert.notEqual(readerPath('zh','blog'),readerPath('zh','post','index'));
  assert.notEqual(readerPath('zh','work'),readerPath('zh','project','index'));
  assert.ok(get(result,'zh','blog').includes('Index article'));
  assert.ok(get(result,'zh','post','index').includes('A complete article.'));
  assert.ok(get(result,'zh','work').includes('Index project'));
  assert.ok(get(result,'zh','project','index').includes('A complete project.'));
});

test('sitemaps use a configured origin only, never an invented production address',async()=>{
  const content=await loadContent(),without=buildMachineContent(content);
  assert.equal(without.outputs.has('sitemap.xml'),false);assert.doesNotMatch(without.outputs.get('robots.txt'),/Sitemap:/);
  const withOrigin=buildMachineContent({...content,site:{...content.site,url:'https://portfolio.example/'}});
  const xml=withOrigin.outputs.get('sitemap.xml');
  assert.match(xml,/<loc>https:\/\/portfolio.example\/read\/zh\/blog\/statarb-learning-guide.html<\/loc>/);
  assert.match(withOrigin.outputs.get('robots.txt'),/Sitemap: https:\/\/portfolio.example\/sitemap.xml/);
  for(const doc of withOrigin.index.documents)assert.ok(withOrigin.outputs.get(key(doc.html)).includes('rel="canonical"'));
  for(const url of ['javascript:alert(1)','https://user:password@example.com/','https://example.com/path','https://example.com/?secret=1']){
    assert.throws(()=>buildMachineContent({...content,site:{...content.site,url}}),/site.json: url/);
  }
});
