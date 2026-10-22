import {escapeHtml as esc} from './markdown.mjs';

const LANGUAGES=['zh','en'];
const names={
  zh:{reader:'文字版',interactive:'交互版',markdown:'Markdown 全文',contents:'内容目录',language:'语言',original:'正文语言',metadata:'基本信息',media:'录屏与截图',description:'画面说明',scenarios:'场景',normal:'默认场景',comparison:'对比场景',state:'状态与输出',cards:'示意卡片',replacement:'替换后的示意卡片',places:'地点',photos:'照片与旅行记录',source:'来源',scope:'说明',emptyVideo:'以下是已有场景说明，不是逐帧视频转写。视频中的其他细节仍需观看原片。'},
  en:{reader:'Text edition',interactive:'Interactive edition',markdown:'Full Markdown',contents:'Content index',language:'Language',original:'Body language',metadata:'Metadata',media:'Recordings and screenshots',description:'Image description',scenarios:'Scenarios',normal:'Default scenario',comparison:'Comparison scenario',state:'States and outputs',cards:'Illustrative cards',replacement:'Illustrative replacement',places:'Places',photos:'Photographs and travel notes',source:'Source',scope:'Notes',emptyVideo:'These are the existing scene descriptions, not frame-by-frame video transcripts. Other visual details still require viewing the original media.'}
};
const p=text=>text?`<p>${esc(text)}</p>`:'';
const heading=(level,text)=>`<h${level}>${esc(String(text).replace(/\s*\n\s*/g,' '))}</h${level}>`;
const list=items=>items?.length?`<ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>`:'';
const fields=items=>`<dl>${items.filter(([,value])=>value!==undefined&&value!=='').map(([label,value])=>`<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join('')}</dl>`;
const mediaUrl=path=>path.startsWith('/assets/')?path:'/assets/travel/'+path;
const scriptSafe=value=>JSON.stringify(value,null,2).replace(/</g,'\\u003c');

export function readerPath(language,kind,slug='',extension='html'){
  if(!LANGUAGES.includes(language)||!['home','about','blog','work','travel','post','project'].includes(kind)||!['html','md'].includes(extension))throw new Error('Invalid reader route');
  if(['post','project'].includes(kind)&&(!slug||/[\s/#?%\\]/.test(slug)||['.','..'].includes(slug)))throw new Error('Invalid reader slug');
  const suffix=kind==='home'?'index':kind==='post'?'blog/'+encodeURIComponent(slug):kind==='project'?'work/'+encodeURIComponent(slug):kind;
  return `/read/${language}/${suffix}.${extension}`;
}
const outputKey=url=>decodeURIComponent(url.slice(1));

function interactivePath(language,kind,slug){
  const route=kind==='home'?'':kind==='post'?'blog/'+encodeURIComponent(slug):kind==='project'?'work/'+encodeURIComponent(slug):kind;
  return `/?lang=${language}#/${route}`;
}
function readerLinks(html,language){
  return html.replace(/href="#\/([^"<>]*)"/g,(attribute,route)=>{
    const [section,slug]=route.split('/');
    const kind=!section?'home':section==='blog'&&slug?'post':section==='work'&&slug?'project':section;
    if(!['home','about','blog','work','travel','post','project'].includes(kind))return attribute;
    try{return `href="${esc(readerPath(language,kind,decodeURIComponent(slug||'')))}"`}catch{return attribute}
  });
}
const link=(url,title)=>`<a href="${esc(url)}">${esc(title)}</a>`;

function projectBody(work,data,language){
  const n=names[language],ui=data.ui,copy=work.caseStudy?.copy[language];
  let html=p(work.headline)+p(work.summary)+heading(2,n.metadata)+fields([
    ['Company',work.company],[ui.work.role,work.role],[ui.work.period,work.period],
    [ui.work.stack,work.tags.join(' / ')],['Category',work.category]
  ])+list(work.focus);
  if(work.cover)html+=`<figure><img src="${esc(work.cover)}" alt="${esc(work.coverAlt)}" loading="lazy"><figcaption>${esc(work.coverCaption)}</figcaption></figure>`;
  if(work.visual?.title)html+=p(work.visual.title)+list(work.visual.nodes);
  if(work.highlights.length)html+=heading(2,ui.caseStudy.results)+fields(work.highlights.map(item=>[item.label,item.value]));
  if(!copy)return html+work.body;
  html+=heading(2,copy.title)+p(copy.intro)+p(copy.outcomeNote);
  html+=heading(2,n.media)+p(copy.preview)+p(copy.previewDetail)+p(copy.mediaNote)+p(n.emptyVideo);
  html+=copy.scenes.map((scene,index)=>{
    const media=work.caseStudy.media[index];
    return heading(3,scene.title)+p(scene.caption)+p(scene.alt)+heading(4,scene.lens)+p(scene.insight)
      +`<p>${link(media.src,media.type==='video'?ui.caseStudy.recording:ui.caseStudy.screenshot)}</p>`
      +(media.poster?`<p>${link(media.poster,n.description)}</p>`:'');
  }).join('');
  if(copy.architecture){
    const a=copy.architecture;
    html+=heading(2,a.title)+p(a.lead)+p(a.diagramLabel)+p(a.note);
    html+=a.layers.map(layer=>heading(3,layer.title)+layer.nodes.map(node=>heading(4,node.title)+p(node.detail)).join('')).join('');
  }
  if(copy.results){
    const r=copy.results;
    html+=heading(2,r.title)+p(r.lead)+p(r.note)+p(r.indexNote)+p(r.rawNote);
    html+=r.metrics.map(metric=>{
      const unit=r[metric.unit==='fps'?'fpsLabel':metric.unit==='percent'?'percentLabel':'indexLabel'];
      return heading(3,metric.title)+fields([[r.beforeLabel,metric.before+' '+unit],[r.afterLabel,metric.after+' '+unit]])+p(metric.description);
    }).join('');
  }
  html+=heading(2,copy.storyTitle)+p(copy.storyLead)+copy.decisions.map(decision=>heading(3,decision.title)+fields([
    [ui.caseStudy.experience,decision.experience],[ui.caseStudy.engineering,decision.engineering],[ui.caseStudy.tradeoff,decision.tradeoff]
  ])).join('');
  const lab=copy.lab;
  html+=heading(2,lab.title)+p(ui.caseStudy.simulation)+p(lab.lead)+p(lab.footnote)+heading(3,n.scenarios)+list(lab.modes);
  html+=lab.stages.map((stage,index)=>heading(3,`${index+1}. ${stage.title}`)+fields([[n.normal,stage.detail],[n.comparison,stage.prepared]])).join('');
  // Include every textual state, not just the state mounted by the interactive UI.
  html+=heading(3,n.state)+fields(Object.entries(lab).filter(([key,value])=>typeof value==='string'&&!['title','lead','footnote'].includes(key)));
  if(lab.cards)html+=heading(3,n.cards)+list(lab.cards.map(card=>card.title+' / '+card.category));
  if(lab.replacement)html+=heading(3,n.replacement)+p(lab.replacement.title+' / '+lab.replacement.category);
  return html+heading(2,ui.caseStudy.notes)+work.body;
}

function travelBody(data,language){
  const n=names[language],travel=data.travel,places=new Map(travel.places.map(place=>[place.id,place]));
  let html=heading(2,n.places)+travel.places.map(place=>heading(3,place.name)+p(place.en)+p(place.note)).join('');
  html+=heading(2,n.photos)+travel.entries.map(entry=>heading(3,entry.title)+fields([
    [n.places,places.get(entry.place)?.name],['Date',entry.date],['Time',entry.time],['Credit',entry.credit]
  ])+p(entry.excerpt)+p(entry.alt)+entry.body.map(p).join('')+`<p>${link(mediaUrl(entry.photo),entry.alt||entry.title)}</p>`+(entry.source?`<p>${link(entry.source,n.source)}</p>`:'')).join('');
  html+=p(travel.period)+p(data.ui.travel.mapSource)+`<p>${link(data.ui.travel.mapSourceUrl,data.ui.travel.mapSourceName)}</p>`;
  return html;
}

function pageBody(kind,data,language){
  const page=data.pages[kind],n=names[language];
  let html=p(page.lead)+p(page.greeting)+page.body;
  const works=()=>data.works.map(work=>`<li>${link(readerPath(language,'project',work.slug),work.title)}${p(work.headline)+p(work.summary)}</li>`).join('');
  const posts=()=>data.posts.map(post=>`<li>${link(readerPath(language,'post',post.slug),post.title)} — ${esc(post.date)}${p(post.excerpt)}</li>`).join('');
  if(kind==='home')html+=heading(2,data.ui.nav.about)+p(data.pages.about.lead)+`<p>${link(readerPath(language,'about'),data.ui.nav.about)}</p>`;
  if(['home','work'].includes(kind))html+=heading(2,data.ui.nav.work)+`<ul>${works()}</ul>`+p(data.pages.work.closingText);
  if(['home','blog'].includes(kind))html+=heading(2,data.ui.nav.blog)+`<ul>${posts()}</ul>`;
  if(kind==='home')html+=heading(2,data.ui.nav.travel)+p(data.pages.travel.lead)+`<p>${link(readerPath(language,'travel'),data.ui.nav.travel)}</p>`;
  if(kind==='about'){
    html+=fields([['Name',data.site.name],['Focus',data.site.profile.focus.join(' / ')],['Offscreen',data.site.profile.offscreen.join(' / ')]]);
    html+=fields(Object.entries(data.site.socials||{}).flatMap(([platform,profile])=>profile.url||profile.username?[[platform,profile.url||profile.username]]:[]));
  }
  if(kind==='travel')html+=travelBody(data,language);
  return html+(page.closingTitle?heading(2,page.closingTitle):'')+p(page.note);
}

const entities={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",'#39':"'",nbsp:' '};
const decode=text=>text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,(match,key)=>{
  if(Object.hasOwn(entities,key))return entities[key];
  if(!key.startsWith('#'))return match;
  const code=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1));
  return code>0&&code<=0x10ffff?String.fromCodePoint(code):match;
});

// Convert our sanitized article markup, preserving literal code and native tables.
// Tables stay valid inline HTML in Markdown, so headerless Notion tables keep their semantics.
export function htmlToMarkdown(html){
  const saved=[],hold=text=>`\u0001SAVED${saved.push(text)-1}\u0002`;
  if(/[\u0001\u0002]/.test(html))throw new Error('Reserved Markdown export marker in article');
  let source=html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g,(_,body)=>'\n\n'+hold(htmlToMarkdown(body).trim().split('\n').map(line=>'> '+line).join('\n'))+'\n\n');
  source=source.replace(/<pre><code(?: class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g,(_,language,code)=>{
    const literal=decode(code),length=Math.max(3,...[...literal.matchAll(/`+/g)].map(match=>match[0].length+1)),fence='`'.repeat(length);
    return '\n\n'+hold(fence+(language||'')+'\n'+literal.replace(/\n$/,'')+'\n'+fence)+'\n\n';
  }).replace(/<table\b[^>]*>[\s\S]*?<\/table>/g,table=>'\n\n'+hold(table)+'\n\n')
    .replace(/<code>([\s\S]*?)<\/code>/g,(_,code)=>{
      const literal=decode(code),length=Math.max(1,...[...literal.matchAll(/`+/g)].map(match=>match[0].length+1)),fence='`'.repeat(length),pad=/^[ `]|[ `]$/.test(literal)?' ':'';
      return hold(fence+pad+literal+pad+fence);
    });
  const stack=[],anchors=[];
  const attribute=(tag,key)=>decode(new RegExp('\\b'+key+'="([^"]*)"').exec(tag)?.[1]||'');
  source=source.replace(/<!--[^]*?-->|<\/?[a-z][^>]*>/gi,tag=>{
    const match=/^<(\/)?([a-z0-9]+)/i.exec(tag);if(!match)return '';
    const closing=!!match[1],name=match[2].toLowerCase();
    if(/^h[1-6]$/.test(name))return closing?'\n\n':'\n\n'+'#'.repeat(Number(name[1]))+' ';
    if(name==='br')return '  \n';
    if(name==='hr')return '\n\n---\n\n';
    if(name==='a')return closing?`](${anchors.pop()||''})`:(anchors.push(attribute(tag,'href')),'[');
    if(name==='img')return `![${attribute(tag,'alt').replace(/\]/g,'\\]')}](${attribute(tag,'src')})`;
    if(['strong','b'].includes(name))return '**';
    if(['em','i'].includes(name))return '*';
    if(name==='dt')return closing?'**: ':'\n- **';
    if(name==='dd')return closing?'\n':'';
    if(['ul','ol'].includes(name)){if(closing)stack.pop();else stack.push({ordered:name==='ol',index:Number(attribute(tag,'start'))||1});return '\n'}
    if(name==='li'){if(closing)return '\n';const current=stack.at(-1);return '\n'+'    '.repeat(Math.max(0,stack.length-1))+(current?.ordered?`${current.index++}. `:'- ')}
    if(name==='blockquote')return closing?'\n\n':'\n\n> ';
    if(['p','div','section','article','header','footer','nav','figure','figcaption','dl'].includes(name))return '\n\n';
    return '';
  });
  source=decode(source).replace(/\n[ \t]+\n/g,'\n\n').replace(/\n{3,}/g,'\n\n').trim();
  return source.replace(/\u0001SAVED(\d+)\u0002/g,(_,index)=>saved[Number(index)])+'\n';
}

function publicOrigin(site){
  if(!site.url)return '';
  let url;try{url=new URL(site.url)}catch{throw new Error('site.json: url 需要完整的 http(s) 网站根地址')}
  if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('site.json: url 需要不含路径、凭据或查询参数的网站根地址');
  return url.origin;
}

function documentHtml(doc,other,data,origin){
  const n=names[doc.language],description=doc.description||data.site.metaDescription.replace(/\{name\}/g,data.site.name);
  const absolute=path=>origin+path;
  return `<!doctype html>
<html lang="${doc.language==='zh'?'zh-CN':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(doc.title)} · ${esc(data.site.name)}</title><meta name="description" content="${esc(description)}">
${origin?`<link rel="canonical" href="${esc(absolute(doc.html))}"><link rel="alternate" hreflang="${other.language}" href="${esc(absolute(other.html))}">`:''}
<link rel="alternate" type="text/markdown" href="${esc(doc.markdown)}"><link rel="index" href="/read/index.json">
<style>body{max-width:54rem;margin:3rem auto;padding:0 1.25rem;font:17px/1.8 system-ui,sans-serif;color:#252525;background:#faf9f5}a{color:#80503c}nav{display:flex;flex-wrap:wrap;gap:1rem}h1,h2,h3,h4{line-height:1.35}h2{margin-top:2.5rem}pre{overflow:auto;padding:1rem;background:#eeece5}code{font-size:.9em}table{border-collapse:collapse;display:block;overflow:auto}th,td{border:1px solid #bbb;padding:.4rem .7rem}img{max-width:100%;height:auto}dt{font-weight:600}dd{margin:0 0 .75rem}blockquote{border-left:3px solid #bca18a;margin-left:0;padding-left:1rem}.notice{padding:1rem;background:#eeece5}</style>
</head><body><nav>${link(readerPath(doc.language,'home'),n.contents)} ${link(doc.interactive,n.interactive)} ${link(doc.markdown,n.markdown)} ${link(other.html,other.language==='zh'?'中文':'English')}</nav>
<main><article><header><h1>${esc(doc.title)}</h1>${doc.date?`<p><time datetime="${doc.date}">${doc.date}</time></p>`:''}</header>${doc.sourceLanguage!==doc.language?`<p class="notice">${esc(data.ui.article.originalNotice)}</p>`:''}<div lang="${doc.sourceLanguage==='zh'?'zh-CN':'en'}">${doc.body}</div></article></main></body></html>\n`;
}

export function buildMachineContent(content){
  const outputs=new Map(),documents=[],byKey=new Map(),origin=publicOrigin(content.site);
  for(const language of LANGUAGES){
    const data=language==='zh'?content:content.english;
    const add=(kind,slug,title,body,description='',date='',sourceLanguage=language)=>{
      const doc={id:kind+':'+slug,kind,slug,language,sourceLanguage,title,description,date,html:readerPath(language,kind,slug),markdown:readerPath(language,kind,slug,'md'),interactive:interactivePath(language,kind,slug),body:readerLinks(body,language)};
      documents.push(doc);byKey.set(language+':'+doc.id,doc);
    };
    for(const kind of ['home','about','work','blog','travel'])add(kind,'',data.pages[kind].title,pageBody(kind,data,language),data.pages[kind].lead);
    for(const post of data.posts)add('post',post.slug,post.title,post.body+(post.sourceUrl?`<p>${link(post.sourceUrl,data.ui.article.source)}</p>`:''),post.excerpt,post.date,post.contentLanguage||language);
    for(const work of data.works)add('project',work.slug,work.title,projectBody(work,data,language),work.summary,'',work.contentLanguage||language);
  }
  for(const doc of documents){
    const other=byKey.get((doc.language==='zh'?'en':'zh')+':'+doc.id),data=doc.language==='zh'?content:content.english,n=names[doc.language];
    outputs.set(outputKey(doc.html),documentHtml(doc,other,data,origin));
    outputs.set(outputKey(doc.markdown),`# ${doc.title}\n\n${n.language}: ${doc.language}\n${n.original}: ${doc.sourceLanguage}\n${doc.date?'Date: '+doc.date+'\n':''}\n[${n.interactive}](${doc.interactive}) · [HTML](${doc.html})\n\n${doc.sourceLanguage!==doc.language?data.ui.article.originalNotice+'\n\n':''}${htmlToMarkdown(doc.body)}`);
  }
  const index={version:1,site:content.site.name,siteUrl:origin||null,languages:LANGUAGES,counts:{posts:content.posts.length,works:content.works.length,travel:content.travel.entries.length,fullyTranslatedEnglishPosts:content.english.posts.filter(post=>post.contentLanguage==='en').length},documents:documents.map(({body,...doc})=>doc)};
  outputs.set('read/index.json',scriptSafe(index)+'\n');
  const introduction=`# ${content.site.name}\n\n> ${content.site.metaDescription.replace(/\{name\}/g,content.site.name)}\n\nThis is a personal portfolio, research notebook, and travel journal. The text editions below contain the same published content as the interactive website and require no JavaScript. They are public, human-readable editions, not private or extra resume material.\n\n`;
  let llms=introduction+'## Entry points\n\n- [中文内容目录](/read/zh/index.html)\n- [English content index](/read/en/index.html)\n- [Structured content index](/read/index.json)\n- [Complete text, both languages](/llms-full.txt)\n\n## Reading notes\n\n- Each HTML page links to its Markdown edition and language counterpart.\n- English pages with Chinese-only bodies are explicitly labeled; sourceLanguage in the index records this.\n- Project metrics are historical, with their original scope, units, and caveats. Architecture nodes, all metrics, demo modes, and demo stages are expanded as text.\n- Demo flows are illustrative, not production integrations. Media descriptions are not complete video transcripts.\n- Read the linked documents for content; this directory does not guarantee that every crawler will retrieve or index them.\n';
  for(const language of LANGUAGES){
    llms+=`\n## ${language==='zh'?'中文':'English'}\n\n`+documents.filter(doc=>doc.language===language).map(doc=>`- [${doc.title.replace(/\n/g,' ')}](${doc.markdown}): ${doc.kind}${doc.sourceLanguage!==language?' — body in '+doc.sourceLanguage:''}`).join('\n')+'\n';
  }
  outputs.set('llms.txt',llms);
  outputs.set('llms-full.txt',introduction+documents.map(doc=>`\n---\n\n${outputs.get(outputKey(doc.markdown))}`).join('\n'));
  outputs.set('robots.txt','User-agent: *\nAllow: /\n'+(origin?`\nSitemap: ${origin}/sitemap.xml\n`:''));
  if(origin)outputs.set('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['/',...documents.map(doc=>doc.html)].map(path=>`<url><loc>${esc(origin+path)}</loc></url>`).join('\n')+'\n</urlset>\n');
  const home=byKey.get('zh:home:');
  const homeHtml=`<article class="prose"><h1>${esc(home.title)}</h1>${home.body}<p>${link(readerPath('en','home'),'English text edition')}</p></article>`;
  const headLinks='<link rel="alternate" type="text/markdown" title="Machine-readable content directory" href="/llms.txt">\n<link rel="alternate" type="application/json" title="Content index" href="/read/index.json">\n<link rel="alternate" type="text/html" hreflang="zh-CN" href="/read/zh/index.html">\n<link rel="alternate" type="text/html" hreflang="en" href="/read/en/index.html">';
  return {outputs,index,homeHtml,headLinks};
}

export function injectMachineContent(template,machine){
  for(const [marker,value] of [['<!-- machine-content:head -->',machine.headLinks],['<!-- machine-content:home -->',machine.homeHtml]]){
    if(!template.includes(marker))throw new Error('Missing template marker: '+marker);
    template=template.replace(marker,()=>value);
  }
  return template;
}

// Only remove files declared by a previous generated index. Never sweep the read directory.
export function staleMachineFiles(previous,outputs){
  const paths=[];
  for(const doc of previous?.documents||[]){
    for(const path of [doc.html,doc.markdown]){
      if(typeof path!=='string'||!/^\/read\/(?:zh|en)\/(?:index|about|travel|blog|work|(?:blog|work)\/[^/]+)\.(?:html|md)$/.test(path))continue;
      let key;try{key=outputKey(path)}catch{continue}
      if(/[\\\u0000-\u001f]/.test(key)||key.split('/').some(part=>part==='.'||part==='..')||!/^read\/(?:zh|en)\/(?:[^/]+|(?:blog|work)\/[^/]+)\.(?:html|md)$/.test(key))continue;
      if(!outputs.has(key))paths.push(key);
    }
  }
  if(previous?.siteUrl&&!outputs.has('sitemap.xml'))paths.push('sitemap.xml');
  return [...new Set(paths)];
}
