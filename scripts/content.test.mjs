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
  site.name='新的昵称';site.displayName='新名字';await writeFile(join(path,'site.json'),JSON.stringify(site));
  const ui=JSON.parse(await readFile(join(path,'interface.json'),'utf8'));
  ui.blog.empty='自己填写的空状态';await writeFile(join(path,'interface.json'),JSON.stringify(ui));
  await writeFile(join(path,'pages/blog.md'),'---\ntitle: 自己的页面\nlead: 最近在学习\n---\n\n## 新计划\n\n自己写的新段落。');
  const result=await loadContent(path);
  assert.equal(result.site.name,'新的昵称');assert.equal(result.ui.blog.empty,'自己填写的空状态');
  assert.equal(result.pages.home.heroName,'新名字。');assert.equal(result.pages.home.title,'Hi，我是新名字。');assert.equal(result.pages.about.title,'你好，我是 新的昵称');
  assert.match(result.pages.blog.body,/自己写的新段落/);
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
  const imported=posts.filter(p=>p.sourceUrl?.startsWith('https://app.notion.com/'));
  assert.equal(imported.length,8);assert.equal(travel.entries.length,59);
  assert.equal(imported.reduce((n,p)=>n+(p.body.match(/<table>/g)||[]).length,0),29);
  assert.equal(imported.reduce((n,p)=>n+(p.body.match(/<pre><code/g)||[]).length,0),36);
  assert.ok(imported.every(p=>p.sourceUrl));
});

test('removed now page is absent from both languages, navigation and terminal',async()=>{
  const content=await loadContent();
  for(const {pages,ui} of [content,content.english]){
    assert.equal(pages.now,undefined);
    assert.equal(ui.nav.now,undefined);assert.equal(ui.titles.now,undefined);
    assert.doesNotMatch(ui.cli.help+ui.cli.rootListing,/now\.md/);
    assert.doesNotMatch(pages.about.body,/#\/now/);
  }
  const template=await readFile(join(root,'src/index.template.html'),'utf8');
  assert.doesNotMatch(template,/#\/now|nav\.now/);
  const app=await readFile(join(root,'dist/assets/app.js'),'utf8');
  assert.doesNotMatch(app,/PAGES\.now|section==='now'|arg==='now\.md'|'travel','now'|'about\.md','now\.md'/);
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

test('case studies share local media in both languages and reject unsafe or incomplete media',async t=>{
  const path=await fixture(t),content=await loadContent(path);
  const music=content.works.find(w=>w.slug==='qishui-music');
  assert.equal(music.caseStudy.media.length,3);
  assert.match(music.caseStudy.media[0].src,/^\/assets\/content\/works\/qishui\/.+\.mp4$/);
  assert.deepEqual(content.english.works.find(w=>w.slug===music.slug).caseStudy.media,music.caseStudy.media);
  const file=join(path,'works/qishui/case-study.json'),original=JSON.parse(await readFile(file,'utf8'));
  const save=async mutate=>{const data=structuredClone(original);mutate(data);await writeFile(file,JSON.stringify(data));};
  await save(data=>{data.media[0].src='media/../../site.json';});
  await assert.rejects(loadContent(path),/媒体文件不能超出 content\/media/);
  await save(data=>{delete data.media[0].poster;});
  await assert.rejects(loadContent(path),/视频需要 poster/);
  await save(data=>{data.media[1].id=data.media[0].id;});
  await assert.rejects(loadContent(path),/重复或无效的媒体 id/);
  await writeFile(file,JSON.stringify(original));
  const scenes=join(path,'en/case-studies/qishui/scenes.md'),source=await readFile(scenes,'utf8');
  await writeFile(scenes,source.slice(0,source.lastIndexOf('\n## ')));
  await assert.rejects(loadContent(path),/场景文案与媒体数量不一致/);
});

test('Markdown case-study edits update only the intended language and do not publish extra works',async t=>{
  const path=await fixture(t),before=await loadContent(path);
  const overview=join(path,'case-studies/talkie/overview.md');
  const intro='这是手动修改后的介绍。\n\n保留第二段，便于继续编辑。';
  const source=await readFile(overview,'utf8'),header=source.slice(0,source.indexOf('\n---\n',4)+5);
  await writeFile(overview,header+'\n'+intro+'\n');
  const decisions=join(path,'case-studies/talkie/decisions.md'),prose=await readFile(decisions,'utf8');
  await writeFile(decisions,prose.replace('## '+before.works.find(work=>work.slug==='talkie-xingye').caseStudy.copy.zh.decisions[0].title,'## 自己填写的工程决策'));
  const sceneFile=join(path,'case-studies/talkie/scenes.md'),sceneSource=await readFile(sceneFile,'utf8');
  const sceneStart=sceneSource.indexOf('\n## '),sceneBlocks=sceneSource.slice(sceneStart).split(/(?=\n## )/).filter(Boolean);
  await writeFile(sceneFile,sceneSource.slice(0,sceneStart)+sceneBlocks.reverse().join(''));
  const after=await loadContent(path),work=after.works.find(w=>w.slug==='talkie-xingye');
  assert.equal(work.caseStudy.copy.zh.intro,intro);
  assert.equal(work.caseStudy.copy.zh.decisions[0].title,'自己填写的工程决策');
  assert.deepEqual(work.caseStudy.copy.zh.scenes,before.works.find(w=>w.slug===work.slug).caseStudy.copy.zh.scenes);
  assert.deepEqual(work.caseStudy.copy.en,before.works.find(w=>w.slug===work.slug).caseStudy.copy.en);
  assert.deepEqual(after.works.map(w=>w.slug),before.works.map(w=>w.slug));
  await writeFile(decisions,prose.replace('### 工程实现','## 工程实现'));
  await assert.rejects(loadContent(path),/case-studies\/talkie\/decisions.md.*###/);
});

test('architecture copy is editable and comparison charts share validated source data',async t=>{
  const path=await fixture(t),content=await loadContent(path);
  const talkie=content.works.find(work=>work.slug==='talkie-xingye').caseStudy.copy;
  assert.equal(talkie.zh.architecture.layers.length,3);
  assert.ok(talkie.zh.architecture.layers.flatMap(layer=>layer.nodes).some(node=>node.id===talkie.zh.architecture.defaultNode));
  const numeric=copy=>copy.results.metrics.map(({id,before,after,axisMax,unit,direction})=>({id,before,after,axisMax,unit,direction}));
  assert.deepEqual(numeric(talkie.zh),numeric(talkie.en));
  const file=join(path,'case-studies/talkie/architecture.md'),original=await readFile(file,'utf8');
  await writeFile(file,original.replace('### connection | 自建长连接','### connection | 自己修改的连接模块'));
  const changed=(await loadContent(path)).works.find(work=>work.slug==='talkie-xingye').caseStudy.copy;
  assert.equal(changed.zh.architecture.layers.flatMap(layer=>layer.nodes).find(node=>node.id==='connection').title,'自己修改的连接模块');
  assert.deepEqual(changed.en.architecture,talkie.en.architecture);
  await writeFile(file,original.replace('defaultNode: "connection"','defaultNode: "missing-node"'));
  await assert.rejects(loadContent(path),/architecture.md.*defaultNode/);
  await writeFile(file,original);
  const dataFile=join(path,'case-studies/talkie/metrics.json'),data=JSON.parse(await readFile(dataFile,'utf8'));
  await writeFile(dataFile,JSON.stringify(data.map((metric,i)=>i===0?{...metric,after:metric.axisMax+1}:metric)));
  await assert.rejects(loadContent(path),/results.md.*有效坐标范围/);
  await writeFile(dataFile,JSON.stringify(data.map(metric=>metric.unit==='index'?{...metric,before:90}:metric)));
  await assert.rejects(loadContent(path),/优化前 100/);
});

test('WeChat shares recording stills, keeps copy editable and validates the reading explainer',async t=>{
  const path=await fixture(t),content=await loadContent(path);
  const work=content.works.find(work=>work.slug==='wechat-official-accounts');
  assert.equal(content.works.length,4);assert.equal(work.caseStudy.kind,'reading');
  assert.equal(work.caseStudy.media.length,3);
  assert.match(work.caseStudy.media[0].src,/\/works\/wechat\/reading\.mp4$/);
  assert.deepEqual(content.english.works.find(item=>item.slug===work.slug).caseStudy.media,work.caseStudy.media);
  assert.equal(work.caseStudy.copy.zh.lab.cards.length,4);
  assert.equal(work.caseStudy.copy.zh.architecture.layers.length,3);
  assert.equal(work.caseStudy.copy.zh.results,undefined);
  assert.doesNotMatch(JSON.stringify(work),/reading-original|xwechat_files|wxid_/);
  const overview=join(path,'case-studies/wechat/overview.md'),source=await readFile(overview,'utf8');
  await writeFile(overview,source.replace(/^title:.*$/m,'title: "自己修改的开场"'));
  const demo=join(path,'case-studies/wechat/demo.md'),original=await readFile(demo,'utf8');
  await writeFile(demo,original.replace(work.caseStudy.copy.zh.lab.cards[0].title,'自己修改的示意卡片'));
  const updated=(await loadContent(path)).works.find(item=>item.slug===work.slug).caseStudy.copy;
  assert.match(updated.zh.title,/自己修改的开场/);
  assert.equal(updated.zh.lab.cards[0].title,'自己修改的示意卡片');
  assert.deepEqual(updated.en,work.caseStudy.copy.en);
  const cards=JSON.stringify(work.caseStudy.copy.zh.lab.cards);
  await writeFile(demo,original.replace(cards,JSON.stringify(work.caseStudy.copy.zh.lab.cards.slice(0,3))));
  await assert.rejects(loadContent(path),/阅读演示需要四张内容卡片/);
});
