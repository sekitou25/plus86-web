import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile,cp,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import vm from 'node:vm';
import {loadContent,root,parseDocument,interpolate} from './build-content.mjs';

async function fixture(t){const path=await mkdtemp(join(tmpdir(),'plus86-i18n-'));await cp(join(root,'content'),path,{recursive:true});t.after(()=>rm(path,{recursive:true,force:true}));return path}

test('English translates pages and all four cases while preserving routes and shared assets',async()=>{
  const base=await loadContent(),en=base.english;
  assert.equal(en.ui.nav.work,'Work');
  assert.equal(en.pages.home.title,interpolate(parseDocument(await readFile(join(root,'content/en/pages/home.md'),'utf8')).meta.title,en.site));
  assert.deepEqual(en.works.map(w=>w.slug),base.works.map(w=>w.slug));
  assert.ok(en.works.every(w=>w.contentLanguage==='en'&&w.body));
  assert.doesNotMatch(en.works.map(w=>w.title+w.body+JSON.stringify(w.visual)).join(''),/\p{Script=Han}/u);
  assert.deepEqual(en.travel.entries.map(e=>[e.id,e.photo,e.place]),base.travel.entries.map(e=>[e.id,e.photo,e.place]));
  assert.doesNotMatch(en.travel.entries.map(e=>e.title+e.alt+e.excerpt).join(''),/\p{Script=Han}/u);
  assert.equal(en.travel.entries.length,59);
  assert.equal(en.posts.length,base.posts.length);
  for(const post of base.posts.filter(p=>p.sourceUrl?.startsWith('https://app.notion.com/'))){
    const original=en.posts.find(p=>p.slug===post.slug);
    assert.equal(original.contentLanguage,'zh');assert.equal(original.body,post.body);
  }
});

test('all seven recent posts have complete bilingual editions with stable routes and dates',async()=>{
  const base=await loadContent();
  const pairs=[
    ['how-to-be-successful-sam-altman','读 Sam Altman《如何成功》',"Reading Sam Altman's How to Be Successful",'2026-10-20'],
    ['services-the-new-software','服务：新的软件','Services: The New Software','2026-10-20'],
    ['2666','2666','2666','2026-02-23'],
    ['紧张和兴奋','紧张和兴奋','Nervousness and Excitement','2026-05-25'],
    ['反脆弱：从不确定性中获益','反脆弱：从不确定性中获益','Antifragile: Things That Gain from Disorder','2026-02-27'],
    ['魔术师','魔术师','The Magician','2026-02-27'],
    ['有限与无限的游戏：一个哲学家眼中的竞技世界','有限与无限的游戏：一个哲学家眼中的竞技世界','Finite and Infinite Games','2026-02-26']
  ];
  for(const [slug,chineseTitle,englishTitle,date] of pairs){
    const zh=base.posts.find(p=>p.slug===slug),en=base.english.posts.find(p=>p.slug===slug);
    assert.ok(zh&&en,slug);assert.equal(zh.title,chineseTitle);assert.equal(en.title,englishTitle);
    assert.equal(zh.date,date);assert.equal(en.date,zh.date);assert.equal(en.tag,zh.tag);
    assert.equal(en.contentLanguage,'en');assert.notEqual(en.body,zh.body);
    assert.ok(en.body.length>500,slug+': full body, not just a translated heading');
    assert.doesNotMatch(en.title+en.excerpt+en.body,/\p{Script=Han}/u);
    assert.match(zh.excerpt+zh.body,/\p{Script=Han}/u);
    assert.equal(en.toc.length,zh.toc.length,slug+': all source sections are present');
    assert.equal((en.body.match(/◆/g)||[]).length,(zh.body.match(/◆/g)||[]).length,slug+': all saved excerpts are present');
    assert.doesNotMatch(zh.body+en.body,/==|NOTIONTABLEPLACEHOLDER/);
  }
  for(const [slug,url] of [['how-to-be-successful-sam-altman','https://blog.samaltman.com/how-to-be-successful'],['services-the-new-software','https://sequoiacap.com/article/services-the-new-software/']]){
    for(const language of [base,base.english])assert.ok(language.posts.find(p=>p.slug===slug).body.includes(`href="${url}"`));
  }
});

test('new works remain visible in both languages and receive an explicit original-language fallback',async t=>{
  const path=await fixture(t);
  await writeFile(join(path,'works/new-case.md'),'---\ntitle: 新作品\norder: 0\n---\n\n## 我的职责\n\n我的新项目。');
  let content=await loadContent(path);
  assert.equal(content.works.length,5);assert.equal(content.english.works.length,5);
  assert.equal(content.english.works[0].contentLanguage,'zh');
  await writeFile(join(path,'en/works/new-case.md'),'---\nslug: new-case\ntitle: New project\n---\n\n## My role\n\nA new project.');
  content=await loadContent(path);
  assert.equal(content.english.works[0].title,'New project');
  assert.equal(content.english.works[0].contentLanguage,'en');
  await rm(join(path,'works/new-case.md'));
  assert.equal((await loadContent(path)).english.works.length,4);
});

test('English post files replace the original body without changing stable article routes',async t=>{
  const path=await fixture(t);
  await writeFile(join(path,'en/posts/statarb-learning-guide.md'),'---\nslug: statarb-learning-guide\ntitle: A translated guide\n---\n\n## Start here\n\nEnglish body.');
  const content=await loadContent(path),en=content.english.posts.find(p=>p.slug==='statarb-learning-guide');
  assert.equal(en.contentLanguage,'en');assert.match(en.body,/English body/);
  assert.equal(en.toc[0].title,'Start here');assert.equal(en.date,content.posts.find(p=>p.slug===en.slug).date);
  const ui=JSON.parse(await readFile(join(path,'en/interface.json'),'utf8'));delete ui.work.read;
  await writeFile(join(path,'en/interface.json'),JSON.stringify(ui));
  await assert.rejects(loadContent(path),/en\/interface.json.*work.read/);
});

test('language URLs override preferences and switching preserves the current route',async()=>{
  const local=new Map([['siyuan-language','zh']]),session=new Map();let assigned='';
  const storage=map=>({getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,value),removeItem:key=>map.delete(key)});
  const context={URL,location:{href:'http://localhost:4173/?lang=en#/work/visual-agent',hash:'#/work/visual-agent',assign:url=>{assigned=url}},localStorage:storage(local),sessionStorage:storage(session),scrollY:412,document:{documentElement:{dataset:{}},querySelectorAll:()=>[],querySelector:()=>({content:''})},SITE:{name:'siyuan',metaDescription:'{name}'},PAGES:{},COPY:{},WORKS:[],POSTS:[],TRAVEL_DATA:{},ENGLISH_CONTENT:{site:{name:'siyuan',metaDescription:'Selected work by {name}'},pages:{},ui:{},works:[],posts:[],travel:{}},Copy:()=>'',requestAnimationFrame:fn=>fn(),scrollTo:()=>{}};
  context.window=context;
  vm.runInNewContext(await readFile(join(root,'dist/assets/i18n.js'),'utf8'),context);
  assert.equal(context.I18N.language,'en');assert.equal(context.document.documentElement.lang,'en');assert.equal(local.get('siyuan-language'),'en');
  context.I18N.setLanguage('zh');
  assert.equal(new URL(assigned).searchParams.get('lang'),'zh');assert.equal(new URL(assigned).hash,'#/work/visual-agent');
  assert.equal(JSON.parse(session.get('siyuan-language-scroll')).top,412);
});

test('reduced-motion mode never hides projects behind an entrance animation',async()=>{
  let hidden=0,observers=0;
  const context={window:{WORKS:[]},Copy:()=>'',matchMedia:()=>({matches:true}),document:{querySelector:()=>null,querySelectorAll:selector=>selector==='.work-entry'?[{classList:{add:()=>hidden++}}]:[]},IntersectionObserver:class{constructor(){observers++}observe(){}disconnect(){}}};
  vm.runInNewContext(await readFile(join(root,'dist/assets/work.js'),'utf8'),context);
  context.window.Work.mount();assert.equal(hidden,0);assert.equal(observers,0);context.window.Work.unmount();
});
