import http from 'node:http';
import {readFile, stat, realpath} from 'node:fs/promises';
import {join, resolve, relative, extname, sep} from 'node:path';
import {build, root, walk} from './build-content.mjs';

const portIndex=process.argv.indexOf('--port');
const requestedPort=portIndex===-1?4173:Number(process.argv[portIndex+1]);
if(!Number.isInteger(requestedPort)||requestedPort<1||requestedPort>65535)throw new Error('--port 需要 1–65535 的端口号');
let previous=await fingerprint(),busy=false;
await build({integrity:false});
const clients=new Set(),directory=await realpath(join(root,'dist'));
const reloadScript=`<script>(()=>{const events=new EventSource('/__content_events');events.addEventListener('change',()=>location.reload());events.addEventListener('build-error',event=>console.warn(event.data));})();</script>`;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.json':'application/json; charset=utf-8','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4'};
const server=http.createServer(async(request,response)=>{
  try{
    const url=new URL(request.url,'http://localhost');
    if(url.pathname==='/__content_events'){
      response.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store','Connection':'keep-alive'});
      response.write('event: ready\ndata: connected\n\n');clients.add(response);
      request.on('close',()=>clients.delete(response));return;
    }
    if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return}
    const path=resolve(directory,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    const actual=await realpath(path);
    if(!actual.startsWith(directory+sep)){response.writeHead(403);response.end();return}
    let bytes=await readFile(actual);
    if(extname(actual)==='.html')bytes=Buffer.from(bytes.toString().replace('</body>',reloadScript+'</body>'));
    response.writeHead(200,{'Content-Type':mime[extname(actual)]||'application/octet-stream','Cache-Control':'no-store'});
    response.end(request.method==='HEAD'?undefined:bytes);
  }catch(error){response.writeHead(error.code==='ENOENT'?404:400);response.end('Not found')}
});
let port=requestedPort;
while(true){
  try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{server.removeListener('error',reject);resolve()})});break}
  catch(error){if(error.code!=='EADDRINUSE'||port>=requestedPort+10)throw error;port++}
}
console.log(`\n本地预览：http://127.0.0.1:${port}/\n只需编辑 content/，保存、新增或删除文件后网页会自动刷新。\n按 Ctrl+C 停止。\n`);

async function fingerprint(){
  const generated=new Set(['content.js','en-content.js','posts.js','investment-posts.js','travel-data.js','daisy.svg','siyuan-logo.svg']);
  const files=[...await walk(join(root,'content')),...await walk(join(root,'src')),...(await walk(join(root,'dist/assets'))).filter(path=>!path.includes(sep+'content'+sep)&&!generated.has(path.split(sep).at(-1)))];
  const parts=[];
  for(const path of files){try{const s=await stat(path);parts.push(`${relative(root,path)}:${s.mtimeMs}:${s.size}`)}catch(error){if(error.code!=='ENOENT')throw error}}
  return parts.join('\n');
}
const broadcast=(event,value)=>{for(const client of clients)client.write(`event: ${event}\ndata: ${JSON.stringify(value)}\n\n`)};
const watcher=setInterval(async()=>{
  if(busy)return;busy=true;
  try{
    const next=await fingerprint();
    if(next!==previous){
      previous=next;
      try{const result=await build({integrity:false});console.log(`已更新：${result.works.length} 个作品 / ${result.posts.length} 篇文章 / ${result.travel.entries.length} 条旅行记录`);broadcast('change','updated')}
      catch(error){console.error(`内容未更新，保留上次成功的版本：\n${error.message}`);broadcast('build-error',error.message)}
    }
  }catch(error){console.error(error.message)}finally{busy=false}
},600);
const heartbeat=setInterval(()=>{for(const client of clients)client.write(': heartbeat\n\n')},20000);
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{
  clearInterval(watcher);clearInterval(heartbeat);for(const client of clients)client.end();server.close(()=>process.exit(0));server.closeAllConnections();
});
