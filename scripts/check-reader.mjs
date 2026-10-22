import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {walk} from './build-content.mjs';

// HTTP-only smoke test: no browser or JavaScript rendering is involved.
const base=process.argv[2]||'http://127.0.0.1:4173';
const response=await fetch(base+'/read/index.json');
assert.equal(response.status,200,'content index');
const index=await response.json();
const targets=index.documents.flatMap(doc=>[[doc.html,'text/html'],[doc.markdown,'text/markdown']]);
for(let offset=0;offset<targets.length;offset+=8){
  await Promise.all(targets.slice(offset,offset+8).map(async([path,type])=>{
    const response=await fetch(base+path);
    assert.equal(response.status,200,path);
    assert.ok(response.headers.get('content-type').startsWith(type),path+': content type');
    const body=await response.text();
    if(type==='text/html'){
      assert.match(body,/<main><article>/);assert.doesNotMatch(body,/<script\b/);
    }else assert.match(body,/^# /);
  }));
}
const home=await(await fetch(base+'/')).text();
assert.match(home,/<main[^>]*><article/);
assert.match(home,/href="\/llms.txt"/);
for(const path of ['/llms.txt','/llms-full.txt','/robots.txt']){
  const response=await fetch(base+path);
  assert.equal(response.status,200,path);
  assert.ok(response.headers.get('content-type').startsWith('text/plain'),path);
}
const generated=new Set(['dist/read/index.json',...index.documents.flatMap(doc=>[doc.html,doc.markdown].map(path=>'dist'+decodeURIComponent(path)))]);
const files=await walk('dist/read');
assert.deepEqual(files.filter(path=>!generated.has(path)),[],'no stale generated documents');
console.log(JSON.stringify({documents:index.documents.length,verifiedHtmlAndMarkdownEndpoints:targets.length,readFiles:files.length,counts:index.counts,fullTextBytes:(await readFile('dist/llms-full.txt')).length,staleReaderFiles:0},null,2));
