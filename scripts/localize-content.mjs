import {readFile,stat} from 'node:fs/promises';
import {join,resolve,dirname,basename,extname,relative,sep} from 'node:path';
import {renderMarkdown} from './markdown.mjs';

const merge=(base,patch)=>{
  const result={...base};
  for(const [key,value] of Object.entries(patch||{}))result[key]=value&&typeof value==='object'&&!Array.isArray(value)?merge(base?.[key]||{},value):value;
  return result;
};
async function json(path,optional=false){try{return JSON.parse(await readFile(path,'utf8'))}catch(error){if(optional&&error.code==='ENOENT')return {};throw new Error(`${path}: ${error.message}`)}}
function validateCopy(reference,translated,path=''){
  for(const [key,value] of Object.entries(reference)){
    const field=path?path+'.'+key:key;
    if(typeof value==='string'&&typeof translated?.[key]!=='string')throw new Error(`content/en/interface.json: 缺少英文文案 ${field}`);
    if(Array.isArray(value)&&!Array.isArray(translated?.[key]))throw new Error(`content/en/interface.json: ${field} 需要数组`);
    if(value&&typeof value==='object'&&!Array.isArray(value))validateCopy(value,translated?.[key],field);
  }
}
export async function loadEnglish(base,directory,{parseDocument,walk,interpolate}){
  const english=join(directory,'en'),site=merge(base.site,await json(join(english,'site.json'))),ui=await json(join(english,'interface.json'));
  validateCopy(base.ui,ui);
  const records=async folder=>{
    const found=new Map();
    for(const path of await walk(join(english,folder))){
      if(extname(path).toLowerCase()!=='.md'||basename(path).toLowerCase()==='readme.md')continue;
      const parsed=parseDocument(await readFile(path,'utf8'),relative(directory,path));
      const key=folder==='pages'?basename(path,'.md'):parsed.meta.slug||basename(path,'.md');
      if(found.has(key))throw new Error(`${relative(directory,path)}: 重复的英文翻译 ${key}`);
      found.set(key,{...parsed,path});
    }
    return found;
  };
  const translatedPages=await records('pages'),translatedWorks=await records('works'),translatedPosts=await records('posts');
  const links=path=>href=>{
    if(/^(?:[a-z][\w+.-]*:|\/|#)/i.test(href))return href;
    let target;try{target=resolve(dirname(path),decodeURIComponent(href))}catch{return href}
    if(target.startsWith(join(directory,'media')+sep))return '/assets/content/'+relative(join(directory,'media'),target).split(sep).map(encodeURIComponent).join('/');
    const slug=basename(target,'.md');
    if(base.posts.some(p=>p.slug===slug))return '#/blog/'+encodeURIComponent(slug);
    if(base.works.some(w=>w.slug===slug))return '#/work/'+encodeURIComponent(slug);
    return href;
  };
  const render=doc=>renderMarkdown(doc.body,[],{notion:doc.meta.format==='notion',labels:ui.article,resolveLink:links(doc.path)});
  const pages={};
  for(const [key,page] of Object.entries(base.pages)){
    const translated=translatedPages.get(key);
    if(!translated){pages[key]={...page,contentLanguage:'zh'};continue}
    const fields=Object.fromEntries(Object.entries(translated.meta).map(([k,v])=>[k,typeof v==='string'?interpolate(v,site):v]));
    const rendered=render({...translated,body:interpolate(translated.body,site)});
    pages[key]={...page,...fields,body:translated.body.trim()?rendered.html:page.body,text:translated.body.trim()?rendered.searchText:page.text,contentLanguage:translated.body.trim()||!page.body?'en':'zh'};
  }
  const works=[];
  for(const work of base.works){
    const translated=translatedWorks.get(work.slug);
    if(!translated){works.push({...work,contentLanguage:'zh'});continue}
    const meta=translated.meta;
    for(const key of ['title','company','period','role','category','headline','summary','coverAlt','coverCaption'])if(meta[key]!==undefined&&typeof meta[key]!=='string')throw new Error(`${relative(directory,translated.path)}: ${key} 需要文字`);
    for(const key of ['tags','focus'])if(meta[key]!==undefined&&(!Array.isArray(meta[key])||!meta[key].every(v=>typeof v==='string')))throw new Error(`${relative(directory,translated.path)}: ${key} 需要文字数组`);
    const visual=merge(work.visual,meta.visual);
    if(!['music','conversation','reading','agent','generic'].includes(visual.type)||!Array.isArray(visual.nodes)||!visual.nodes.every(v=>typeof v==='string'))throw new Error(`${relative(directory,translated.path)}: visual 格式无效`);
    const highlights=meta.highlights||work.highlights;
    if(!Array.isArray(highlights)||highlights.some(v=>typeof v.value!=='string'||typeof v.label!=='string'))throw new Error(`${relative(directory,translated.path)}: highlights 格式无效`);
    const rendered=render(translated),translatedBody=Boolean(translated.body.trim());
    let cover=work.cover;
    if(meta.cover){
      const file=meta.cover.startsWith('media/')?resolve(directory,meta.cover):resolve(dirname(translated.path),meta.cover);
      if(!file.startsWith(join(directory,'media')+sep))throw new Error(`${relative(directory,translated.path)}: cover 图片请放在 content/media/`);
      await stat(file);cover='/assets/content/'+relative(join(directory,'media'),file).split(sep).map(encodeURIComponent).join('/');
      if(!meta.coverAlt)throw new Error(`${relative(directory,translated.path)}: 需要 coverAlt`);
    }
    works.push({...work,...Object.fromEntries(['title','company','period','role','category','headline','summary','tags','focus','coverAlt','coverCaption'].filter(key=>meta[key]!==undefined).map(key=>[key,meta[key]])),visual,highlights,cover,body:translatedBody?rendered.html:work.body,text:translatedBody?rendered.searchText:work.text,toc:translatedBody?rendered.toc:work.toc,contentLanguage:translatedBody||!work.body?'en':'zh'});
  }
  const catalog=await json(join(english,'posts/catalog.json'),true);
  const posts=base.posts.map(post=>{
    const doc=translatedPosts.get(post.slug),meta={...(catalog[post.slug]||{}),...(doc?.meta||{})};
    for(const key of ['title','excerpt','seriesName'])if(meta[key]!==undefined&&typeof meta[key]!=='string')throw new Error(`content/en/posts: ${post.slug} 的 ${key} 需要文字`);
    const rendered=doc?.body.trim()?render(doc):null;
    return {...post,...(meta.title?{title:meta.title}:{}),...(meta.excerpt?{excerpt:meta.excerpt}:{}),...(post.series?{series:{...post.series,name:meta.seriesName||post.series.name}}:{}),...(rendered?{body:rendered.html,toc:rendered.toc,searchText:rendered.searchText,minutes:Math.max(1,Math.ceil((rendered.searchText.match(/\p{Script=Han}/gu)?.length||0)/450+(rendered.searchText.match(/[a-zA-Z][a-zA-Z0-9_]*/g)?.length||0)/220))}:{}),contentLanguage:rendered?'en':'zh'};
  });
  const travelCopy=await json(join(english,'travel.json'));
  const travel={...base.travel,places:base.travel.places.map(p=>({...p,...travelCopy.places?.[p.id]})),mapPlaces:base.travel.mapPlaces.map(p=>({...p,...travelCopy.mapPlaces?.[p.id]})),entries:base.travel.entries.map(e=>{const translated=travelCopy.entries?.[e.id]||{};return {...e,...translated,credit:interpolate(translated.credit||ui.travel.defaultCredit,site)}})};
  return {site,ui,pages,works,posts,travel};
}
