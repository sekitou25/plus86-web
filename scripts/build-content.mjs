import {readFile, writeFile, readdir, stat, mkdir, rename, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname, join, relative, resolve, extname, basename, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderMarkdown, escapeHtml} from './markdown.mjs';
import {loadEnglish} from './localize-content.mjs';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = data => createHash('sha256').update(data).digest('hex');
export const interpolate = (value, variables) => String(value).replace(/\{([\w]+)\}/g, (match,key) => Object.hasOwn(variables,key) ? variables[key] : match);

// A deliberately small front matter format: one key per line, text or inline JSON values.
// Plain Markdown files also work; no manifest or hand-written import list is needed.
export function parseDocument(source, filename = '') {
  let body = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n'), meta = {};
  if (body.startsWith('---\n')) {
    const end = body.indexOf('\n---\n', 4);
    if (end === -1) throw new Error(`${filename}: 文件头缺少结束的 ---`);
    for (const line of body.slice(4,end).split('\n')) {
      if (!line.trim() || line.trimStart().startsWith('#')) continue;
      const match = /^([a-zA-Z][\w-]*):\s*(.*?)\s*$/.exec(line);
      if (!match || Object.hasOwn(meta,match[1])) throw new Error(`${filename}: 无效或重复的文件头字段：${line}`);
      let value = match[2];
      if (/^(?:["\[{]|true$|false$|null$|-?\d+(?:\.\d+)?$)/.test(value)) {
        try { value = JSON.parse(value); } catch { throw new Error(`${filename}: ${match[1]} 的引号或 JSON 格式有误`); }
      } else if (value.startsWith("'")) {
        if (!value.endsWith("'")) throw new Error(`${filename}: ${match[1]} 缺少结束引号`);
        value = value.slice(1,-1).replace(/''/g,"'");
      }
      meta[match[1]] = value;
    }
    body = body.slice(end+5).trimStart();
  }
  const heading = /^#\s+(.+?)\s*#*\s*$/m.exec(body);
  if (!meta.title && heading) { meta.title = heading[1]; body = body.replace(heading[0], '').trimStart(); }
  return {meta,body};
}

export async function walk(directory) {
  const files = [];
  for (const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    const path = join(directory,entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}
async function jsonFile(path) {
  try { return JSON.parse(await readFile(path,'utf8')); }
  catch(error) { throw new Error(`${relative(root,path)}: ${error.message}`); }
}
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
function requireText(value, label) { if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} 需要填写文字`); }
function checkUrl(value, label) { if (value && !/^https?:\/\/[^\s]+$/i.test(value)) throw new Error(`${label} 需要填写 http(s) 链接`); }

export async function loadContent(directory = join(root,'content')) {
  const site = await jsonFile(join(directory,'site.json'));
  const ui = await jsonFile(join(directory,'interface.json'));
  const travel = await jsonFile(join(directory,'travel.json'));
  const schema = await jsonFile(join(root,'src/copy-schema.json'));
  for(const [path,type] of Object.entries(schema)){
    const value=path.split('.').reduce((v,key)=>v?.[key],ui);
    if(type==='array'?!Array.isArray(value):typeof value!==type)throw new Error(`interface.json: ${path} 需要保留为 ${type==='string'?'文字':'数组'}`);
  }
  for (const key of ['name','handle','tagline','metaDescription']) requireText(site[key],'site.json '+key);
  for (const [key,profile] of Object.entries(site.socials||{})) checkUrl(profile.url,'site.json socials.'+key+'.url');
  if(!Array.isArray(site.profile?.focus)||!Array.isArray(site.profile?.offscreen))throw new Error('site.json: profile.focus 和 profile.offscreen 使用数组');
  // The content tree is the sole authority; new and removed Markdown files update every index.
  const documents = [];
  for (const path of await walk(join(directory,'posts'))) {
    if (extname(path).toLowerCase() !== '.md' || basename(path).toLowerCase()==='readme.md') continue;
    const {meta,body} = parseDocument(await readFile(path,'utf8'),relative(directory,path));
    if (meta.draft !== undefined && typeof meta.draft !== 'boolean') throw new Error(`${relative(directory,path)}: draft 使用 true 或 false`);
    if (meta.draft) continue;
    const slug = meta.slug || basename(path,'.md');
    if (typeof slug!=='string' || !slug.trim() || /[\s/#?%\\]/.test(slug) || ['.','..'].includes(slug)) throw new Error(`${relative(directory,path)}: slug 不能含空格或路径符号`);
    const date = meta.date || basename(path).match(/^\d{4}-\d{2}-\d{2}/)?.[0] || (await stat(path)).mtime.toISOString().slice(0,10);
    if (!validDate(date)) throw new Error(`${relative(directory,path)}: date 应为有效的 YYYY-MM-DD 日期`);
    const title = meta.title || basename(path,'.md');
    requireText(title,relative(directory,path)+' title');
    checkUrl(meta.sourceUrl,relative(directory,path)+' sourceUrl');
    for(const key of ['tag','excerpt','kind'])if(meta[key]!==undefined&&typeof meta[key]!=='string')throw new Error(`${relative(directory,path)}: ${key} 需要填写文字`);
    if (meta.format && !['notion','markdown'].includes(meta.format)) throw new Error(`${relative(directory,path)}: format 使用 markdown 或 notion`);
    if (meta.series && (typeof meta.series.id!=='string' || typeof meta.series.name!=='string' || !Number.isFinite(meta.series.order))) throw new Error(`${relative(directory,path)}: series 需要 id、name 和数字 order`);
    documents.push({...meta,slug,title,date,path,markdown:body});
  }
  const slugs = new Set(), ids = new Set();
  for (const doc of documents) {
    if(slugs.has(doc.slug) || (doc.id && ids.has(doc.id))) throw new Error(`${relative(directory,doc.path)}: 重复的文章 slug 或 Notion id`);
    slugs.add(doc.slug); if(doc.id)ids.add(doc.id);
  }
  const paths = new Map(documents.map(doc=>[doc.path,doc]));
  const resolveLink = path => href => {
    if (/^(?:[a-z][\w+.-]*:|\/|#)/i.test(href)) return href;
    let decoded;
    try { decoded = decodeURIComponent(href); } catch { return href; }
    const destination = resolve(dirname(path),decoded);
    const post = paths.get(destination);
    if(post) return '#/blog/'+encodeURIComponent(post.slug);
    const media = relative(join(directory,'media'),destination);
    if (media && !media.startsWith('..'+sep) && media!=='..' && !media.startsWith(sep)) return '/assets/content/'+media.split(sep).map(encodeURIComponent).join('/');
    return href;
  };
  const posts = documents.map(doc=>{
    const {html,toc,searchText} = renderMarkdown(doc.markdown,documents,{notion:doc.format==='notion',labels:ui.article,resolveLink:resolveLink(doc.path)});
    const han=searchText.match(/\p{Script=Han}/gu)?.length||0, words=searchText.match(/[a-zA-Z][a-zA-Z0-9_]*/g)?.length||0;
    return {slug:doc.slug,title:doc.title,date:doc.date,dateSource:doc.dateSource,tag:doc.tag||'notes',kind:doc.kind||'article',minutes:Math.max(1,Math.ceil(han/450+words/220)),excerpt:doc.excerpt||searchText.slice(0,120),sourceUrl:doc.sourceUrl,sourceUpdatedAt:doc.updatedAt,...(doc.series?{series:doc.series}:{}),toc,searchText,body:html};
  }).sort((a,b)=>b.date.localeCompare(a.date)||(a.series?.order??Number.MAX_SAFE_INTEGER)-(b.series?.order??Number.MAX_SAFE_INTEGER)||a.slug.localeCompare(b.slug));
  const pages = {};
  for (const path of await walk(join(directory,'pages'))) {
    if (extname(path).toLowerCase()!=='.md') continue;
    const key=basename(path,'.md');
    if(pages[key])throw new Error(`${relative(directory,path)}: 重复的页面名称`);
    const {meta,body}=parseDocument(await readFile(path,'utf8'),relative(directory,path));
    requireText(meta.title,relative(directory,path)+' title');
    const fields=Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,typeof v==='string'?interpolate(v,site):v]));
    const rendered=renderMarkdown(interpolate(body,site),documents,{labels:ui.article,resolveLink:resolveLink(path)});
    pages[key]={...fields,body:rendered.html,text:rendered.searchText};
  }
  for(const name of ['home','about','now','blog','travel','work'])if(!pages[name])throw new Error(`缺少 content/pages/${name}.md`);
  const works=[],workSlugs=new Set();
  for(const path of await walk(join(directory,'works'))){
    if(extname(path).toLowerCase()!=='.md'||basename(path).toLowerCase()==='readme.md')continue;
    const name=relative(directory,path),{meta,body}=parseDocument(await readFile(path,'utf8'),name);
    if(meta.draft!==undefined&&typeof meta.draft!=='boolean')throw new Error(`${name}: draft 使用 true 或 false`);
    if(meta.draft)continue;
    const slug=meta.slug||basename(path,'.md');
    if(typeof slug!=='string'||!slug.trim()||/[\s/#?%\\]/.test(slug)||['.','..'].includes(slug))throw new Error(`${name}: slug 不能含空格或路径符号`);
    if(workSlugs.has(slug))throw new Error(`${name}: 重复的作品 slug`);
    const title=meta.title||basename(path,'.md');requireText(title,name+' title');
    for(const key of ['company','period','role','category','headline','summary','cover','coverAlt','coverCaption'])if(meta[key]!==undefined&&typeof meta[key]!=='string')throw new Error(`${name}: ${key} 需要填写文字`);
    for(const key of ['tags','focus'])if(meta[key]!==undefined&&(!Array.isArray(meta[key])||!meta[key].every(v=>typeof v==='string')))throw new Error(`${name}: ${key} 需要填写文字数组`);
    if(meta.order!==undefined&&!Number.isFinite(meta.order))throw new Error(`${name}: order 需要填写数字`);
    const visual=meta.visual||{type:'generic',title,nodes:[]};
    if(!['music','conversation','reading','agent','generic'].includes(visual.type))throw new Error(`${name}: 未知的 visual.type`);
    if(visual.nodes!==undefined&&(!Array.isArray(visual.nodes)||!visual.nodes.every(v=>typeof v==='string')))throw new Error(`${name}: visual.nodes 需要填写文字数组`);
    const highlights=meta.highlights||[];
    if(!Array.isArray(highlights)||highlights.some(v=>typeof v.value!=='string'||typeof v.label!=='string'))throw new Error(`${name}: highlights 需要 value 和 label 文字`);
    let cover='';
    if(meta.cover){
      const file=meta.cover.startsWith('media/')?resolve(directory,meta.cover):resolve(dirname(path),meta.cover);
      if(!file.startsWith(join(directory,'media')+sep))throw new Error(`${name}: cover 图片请放在 content/media/`);
      await stat(file);
      cover='/assets/content/'+relative(join(directory,'media'),file).split(sep).map(encodeURIComponent).join('/');
      requireText(meta.coverAlt,name+' coverAlt');
    }
    const rendered=renderMarkdown(body,documents,{labels:ui.article,resolveLink:resolveLink(path)});
    works.push({slug,title,order:meta.order??1000,company:meta.company||'',period:meta.period||'',role:meta.role||'',category:meta.category||'',headline:meta.headline||'',summary:meta.summary||'',tags:meta.tags||[],focus:meta.focus||[],highlights,visual,cover,coverAlt:meta.coverAlt||'',coverCaption:meta.coverCaption||'',body:rendered.html,text:rendered.searchText,toc:rendered.toc});
    workSlugs.add(slug);
  }
  works.sort((a,b)=>a.order-b.order||a.slug.localeCompare(b.slug));
  const placeIds=new Set(travel.places.map(p=>p.id)),entryIds=new Set();
  for(const e of travel.entries){
    if(!placeIds.has(e.place)||entryIds.has(e.id))throw new Error(`travel.json: ${e.id} 的地点不存在或记录 id 重复`);
    if(e.date&&!validDate(e.date))throw new Error(`travel.json: ${e.id} 的日期无效`);
    if(!Array.isArray(e.body)||!e.body.every(p=>typeof p==='string'))throw new Error(`travel.json: ${e.id} 的 body 使用段落字符串数组`);
    const ratio=String(e.ratio).split('/').map(Number);
    if(ratio.length>2||ratio.some(n=>!Number.isFinite(n)||n<=0))throw new Error(`travel.json: ${e.id} 的 ratio 需要是正数或宽/高`);
    for(const field of ['photo','thumb'])if(e[field]){
      const value=e[field];
      if(value.startsWith('media/')){
        const path=resolve(directory,value);
        if(!path.startsWith(join(directory,'media')+sep)||/["'<>\u0000-\u001f]/.test(value))throw new Error(`travel.json: ${e.id} 的 ${field} 路径无效`);
        await stat(path);
        e[field]='/assets/content/'+relative(join(directory,'media'),path).split(sep).map(encodeURIComponent).join('/');
      }else{
        if(!/^(?:[\w-]+\/)*[\w.-]+$/.test(value))throw new Error(`travel.json: ${e.id} 的 ${field} 仅填写照片文件名或 media/ 路径`);
        await stat(join(root,'dist/assets/travel',value));
      }
    }
    checkUrl(e.source,`travel.json: ${e.id} 的 source`);
    if(e.credit)e.credit=interpolate(e.credit,site);
    entryIds.add(e.id);
  }
  const content={site,ui,pages,posts,travel,works};
  return {...content,english:await loadEnglish(content,directory,{parseDocument,walk,interpolate})};
}

async function atomicWrite(path, data) {
  await mkdir(dirname(path),{recursive:true});
  const temporary=path+'.tmp';
  await writeFile(temporary,data); await rename(temporary,path);
}
const scriptData = value => JSON.stringify(value,null,2).replace(/</g,'\\u003c');
export async function build({integrity=true}={}) {
  const {site,ui,pages,posts,travel,works,english}=await loadContent();
  const generated='// Generated from content/. Edit that directory, then run the preview or build command.\n';
  const outputs=new Map([
    ['assets/content.js',generated+'window.SITE = '+scriptData(site)+';\nwindow.PAGES = '+scriptData(pages)+';\nwindow.COPY = '+scriptData(ui)+';\nwindow.Copy = (path, values = {}) => { const value = path.split(".").reduce((v,k)=>v?.[k],window.COPY); if(typeof value !== "string") throw new Error("Missing copy: "+path); const variables={...window.SITE,...values}; return value.replace(/\\{(\\w+)\\}/g,(match,key)=>Object.hasOwn(variables,key)?variables[key]:match); };\n'],
    ['assets/posts.js',generated+'window.POSTS = '+scriptData(posts)+';\n'],
    ['assets/travel-data.js',generated+'window.TRAVEL_DATA = '+scriptData(travel)+';\n']
  ]);
  outputs.set('assets/content.js',outputs.get('assets/content.js')+'window.WORKS = '+scriptData(works)+';\n');
  outputs.set('assets/en-content.js',generated+'window.ENGLISH_CONTENT = '+scriptData(english)+';\n');
  const variables={site,ui,postCount:String(posts.length).padStart(2,'0'),workCount:String(works.length).padStart(2,'0')};
  const fillTemplate=template=>template.replace(/\{\{([\w.]+)\}\}/g,(_,key)=>{
    const value=key.split('.').reduce((v,k)=>v?.[k],variables);
    if(typeof value!=='string')throw new Error(`模板中未找到文案 ${key}`);
    return escapeHtml(interpolate(value,site));
  });
  for(const name of ['daisy','siyuan-logo'])outputs.set('assets/'+name+'.svg',fillTemplate(await readFile(join(root,'src/assets/'+name+'.template.svg'),'utf8')));
  // Validate and prepare all data before replacing the last working website.
  let index=fillTemplate(await readFile(join(root,'src/index.template.html'),'utf8'));
  for(const match of [...index.matchAll(/(?:src|href)="(\/assets\/[^"?]+)(?:\?v=[^"]*)?"/g)]){
    const path=match[1].slice(1),data=outputs.get(path)??await readFile(join(root,'dist',path));
    index=index.replace(match[0],match[0].replace(/(\/assets\/[^"?]+)(?:\?v=[^"]*)?/,'$1?v='+hash(data).slice(0,12)));
  }
  const mediaDirectory=join(root,'content/media');
  const mediaFiles=await walk(mediaDirectory);
  for(const path of mediaFiles) outputs.set('assets/content/'+relative(mediaDirectory,path),await readFile(path));
  // Remove stale generated media so deleted content is absent from the next deployment.
  const outputMedia=join(root,'dist/assets/content');
  await mkdir(outputMedia,{recursive:true});
  for(const path of await walk(outputMedia))if(!outputs.has(relative(join(root,'dist'),path)))await rm(path);
  for(const [path,data] of outputs)await atomicWrite(join(root,'dist',path),data);
  await atomicWrite(join(root,'dist/index.html'),index);
  if(integrity)await refreshChecksums();
  return {posts,pages,travel,works};
}
export async function refreshChecksums(){
  const names=new Set((await readFile(join(root,'SHA256SUMS.txt'),'utf8')).trim().split('\n').map(line=>line.slice(66)));
  for(const directory of ['content','dist','scripts','sources','src'])for(const path of await walk(join(root,directory)))names.add(relative(root,path));
  names.add('README.md'); names.add('BUNDLE-README.txt'); names.add('preview.command');
  const checksums=[];
  for(const name of [...names].sort()){
    try{checksums.push(hash(await readFile(join(root,name)))+'  '+name)}catch(error){if(error.code!=='ENOENT')throw error}
  }
  await atomicWrite(join(root,'SHA256SUMS.txt'),checksums.join('\n')+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const result=await build();
  console.log(`已生成 ${result.works.length} 个作品、${result.posts.length} 篇文章、${Object.keys(result.pages).length} 个页面和 ${result.travel.entries.length} 条旅行记录。`);
}
