(() => {
'use strict';
const $ = s => document.querySelector(s);
const main = $('#main');
$('.skip-link').addEventListener('click',e=>{e.preventDefault();main.focus();main.scrollIntoView({block:'start'})});
const posts = [...window.POSTS]
  .sort((a,b) => b.date.localeCompare(a.date));
const tagNames = COPY.tags;
const tagName = tag => tagNames[tag] || tag;
const postCount = document.querySelector('.nav-count');
if(postCount)postCount.textContent=String(posts.length).padStart(2,'0');
let asciiFrame = 0, asciiTimer = 0, currentRoute = '', filter = 'all', search = '', cliHistory = [], historyIndex = 0, cwd = '~';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t = (key,values) => esc(Copy(key,values));
const postUrl = p => '#/blog/'+encodeURIComponent(p.slug);
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('visible');setTimeout(()=>t.classList.remove('visible'),2200)}
function setTheme(mode){const value=mode==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):mode;document.documentElement.dataset.theme=value;try{localStorage.setItem('siyuan-theme',value)}catch(e){}updateTheme()}
function updateTheme(){const light=document.documentElement.dataset.theme==='light';$('#theme-icon').textContent=light?'☾':'☼';$('#theme-toggle').setAttribute('aria-label',Copy(light?'theme.dark':'theme.light'));document.querySelector('meta[name="theme-color"]').content=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()}
$('#theme-toggle').addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));updateTheme();
function clock(){const now=new Date();$('#local-time').textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZoneName:'short'}).format(now);$('#year').textContent=now.getFullYear()};clock();setInterval(clock,60000);
function path(text){return `<div class="path">~ / <span>${text}</span></div>`}
function row(p){return `<a class="post-row" href="${postUrl(p)}"><time class="post-date" datetime="${p.date}" title="${p.date}">${p.date.slice(5).replace('-','.')}</time><span class="post-title">${esc(p.title)}</span><span class="post-tag">${esc(COPY.shortTags[p.tag]||tagName(p.tag))}</span></a>`}
function home(){return Work.page()}
function drawAscii(){const pre=$('#ascii-art');if(!pre)return;const w=88,h=29,cx=43,cy=13.2,chars=' .·:;+=*#%@',t=asciiFrame*.018;let out='';for(let y=0;y<h;y++){for(let x=0;x<w;x++){const X=(x-cx)/1.85,Y=y-cy;const u=X*.94+Y*.34,v=-X*.34+Y*.94;const ringD=Math.sqrt((u/22)**2+(v/4.6)**2);const sphereD=(X/10)**2+(Y/10)**2;const ring=ringD>.75&&ringD<1.14;let char=' ';if(sphereD<=1){const z=Math.sqrt(1-sphereD),shade=Math.max(0,(X/10)*-.45+(Y/10)*-.55+z*.77);const bands=.09*Math.sin(Y*1.8+t)+.04*Math.sin(Y*4.7+t*1.2);char=chars[Math.max(1,Math.min(9,Math.floor((shade+bands)*8.5)))];if(ring&&v>0){const n=Math.sin(ringD*170);char=n>.4?'=':n>-.4?'·':':';}}else if(ring){const texture=Math.sin(ringD*170+t)*.5+.5;char=texture>.75?'=':texture>.4?':':'·';if((x+y)%5===0)char=' ';}else{const seed=((x*137+y*71+19)%547);if(seed===1||seed===93)char='·';if(seed===217&&x>14&&x<80)char='+';}out+=char;}out+='\n';}pre.textContent=out;asciiFrame++}
function startAscii(){drawAscii();if(!matchMedia('(prefers-reduced-motion: reduce)').matches)asciiTimer=setInterval(()=>{if(!document.hidden)drawAscii()},160)}
function blog(){
  const tags=['all',...new Set(posts.map(p=>p.tag))];
  const years=[...new Set(posts.map(p=>p.date.slice(0,4)))],p=PAGES.blog;
  return `${path(t('nav.blog'))}<div class="page-head"><h1>${esc(p.title)}<span class="accent">_</span></h1><p>${esc(p.lead)}</p></div><div class="blog-controls"><div class="filters" role="group" aria-label="${t('blog.categories')}">${tags.map(tag=>`<button data-filter="${esc(tag)}" aria-pressed="${filter===tag}">${tag==='all'?t('blog.all'):esc(tagName(tag))}</button>`).join('')}</div><label class="search-wrap"><span aria-hidden="true">⌕</span><input type="search" id="search" placeholder="${t('blog.searchPlaceholder')}" aria-label="${t('blog.searchLabel')}" value="${esc(search)}"><span class="search-key" aria-hidden="true">/</span></label></div><button class="year-toggle" id="year-toggle" aria-expanded="true"><span>▾</span> ${years.length===1?years[0]+'/':t('blog.allYears')}</button><div id="blog-list" class="blog-list"></div><div class="list-summary"><span id="result-count"></span><span>${t('blog.shortcuts')}</span></div>`;
}
function renderList(){
  const list=$('#blog-list');if(!list)return;
  const query=search.trim().toLowerCase();
  const found=posts.filter(p=>(filter==='all'||p.tag===filter)&&(`${p.title} ${p.excerpt} ${tagName(p.tag)} ${p.searchText||''}`.toLowerCase().includes(query)));
  list.innerHTML=found.length?found.map(row).join(''):`<p class="empty-state">${t('blog.empty')}</p>`;
  $('#result-count').textContent=Copy('blog.count',{count:String(found.length).padStart(2,'0'),tag:tagName(filter)});
}
function article(slug){
  const p=posts.find(p=>p.slug===slug);if(!p)return notFound();
  const series=p.series?posts.filter(q=>q.series?.id===p.series.id).sort((a,b)=>a.series.order-b.series.order):[];
  const related=series.length?series:posts,index=related.indexOf(p),next=related[index+1];
  const seriesNavigation=series.length?`<nav class="article-series" aria-label="${t('article.seriesLabel',{series:p.series.name})}"><span>${esc(p.series.name)}</span>${series.map(q=>`<a href="${postUrl(q)}" ${q.slug===p.slug?'aria-current="page"':''} title="${esc(q.title)}">${q.series.order?String(q.series.order).padStart(2,'0'):t('article.index')}</a>`).join('')}</nav>`:'';
  const toc=p.toc?.length?`<details class="article-toc"><summary>${t('article.toc')} <span>${t('article.sections',{count:p.toc.length})}</span></summary><ol>${p.toc.map(item=>`<li><button type="button" data-article-section="${item.id}">${esc(item.title)}</button></li>`).join('')}</ol></details>`:'';
  const source=p.sourceUrl?`<div class="article-source"><a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">${t('article.source')}</a><span>${t(p.dateSource==='created'?'article.createdDate':'article.recordedDate')}</span></div>`:'';
  const nextLink=next?`<a href="${postUrl(next)}"><span>${t(series.length?'article.nextChapter':'article.nextPost')}</span>${esc(next.title)} →</a>`:series.length?`<a href="${postUrl(series[0])}"><span>${t('article.seriesIndex')}</span>${t('article.backToIndex')}</a>`:`<a href="#/">${t('article.backHome')}</a>`;
  return `${path(`${t('nav.blog')} ${esc(p.slug)}.md`)}<a class="back-link" href="#/blog">${t('article.back')}</a><article><div class="page-head article-head"><h1>${esc(p.title)}</h1></div><div class="article-meta"><time datetime="${p.date}">${p.date}</time><span>${esc(tagName(p.tag))}</span><span>${t('article.minutes',{minutes:p.minutes})}</span><span>${t(p.kind==='note'?'article.note':p.sourceUrl?'article.notion':'article.post')}</span></div>${seriesNavigation}${toc}${I18N.language==='en'&&p.contentLanguage==='zh'?`<p class="content-language-note">${t('article.originalNotice')}</p>`:''}<div class="prose article-prose" lang="${p.contentLanguage==='zh'?'zh-CN':document.documentElement.lang}">${p.body}</div>${source}<div class="article-bottom"><a href="#/blog"><span>${t('article.parent')}</span>${t('article.all')}</a>${nextLink}</div></article>`;
}
function socialContacts(){
  const profiles=SITE.socials||{},platforms=COPY.social.platforms;
  return `<section class="social-section" aria-labelledby="social-title"><div class="social-heading"><h2 id="social-title">${t('social.title')}</h2><span>${t('social.path')}</span></div><div class="social-list">${platforms.map(p=>{
    const profile=profiles[p.id]||{},name=profile.username||'';
    const configured=p.id==='wechat'?Boolean(name):Boolean(profile.url);
    const caption=name?(p.id==='wechat'?name:'@'+name.replace(/^@/,'')):(profile.url?Copy('social.visit'):Copy('social.pending'));
    const contents=`<span class="social-mark" aria-hidden="true">${esc(p.mark)}</span><span class="social-name">${esc(p.name)}<span>${esc(p.description)}</span></span><span class="social-account">${esc(caption)}</span><span class="social-action" aria-hidden="true">${configured?(p.id==='wechat'?'⧉':'↗'):'—'}</span>`;
    if(!configured)return `<div class="social-row social-pending" aria-label="${t('social.pendingLabel',{platform:p.name})}">${contents}</div>`;
    if(p.id==='wechat')return `<button class="social-row" id="copy-wechat" aria-label="${t('social.copy',{account:name})}">${contents}</button>`;
    return `<a class="social-row" href="${esc(profile.url)}" target="_blank" rel="noopener noreferrer" aria-label="${t('social.open',{platform:p.name})}">${contents}</a>`;
  }).join('')}</div></section>`;
}
function bindSocialContacts(){
  $('#copy-wechat')?.addEventListener('click',async()=>{
    const id=SITE.socials.wechat.username;
    try{await navigator.clipboard.writeText(id);toast(Copy('social.copied'))}
    catch{toast(Copy('social.manual',{account:id}))}
  });
}
function aboutPlainText(){return `${PAGES.about.title} · ${PAGES.about.lead}

${PAGES.about.text}`}
function about(){
  const p=PAGES.about,a=SITE.profile;
  const values=items=>items.map(v=>`<span class="value">${esc(JSON.stringify(v))}</span>`).join(', ');
  return `${path(t('nav.about'))}<div class="page-head"><h1>${esc(p.title)}<span class="accent">.</span></h1><p>${esc(p.lead)}</p></div><div class="about-terminal"><div><span class="muted">$</span> ${t('about.command')}</div><div>{</div><div>&nbsp; <span class="key">"${t('about.nameKey')}"</span>: <span class="value">${esc(JSON.stringify(SITE.name))}</span>,</div><div>&nbsp; <span class="key">"${t('about.focusKey')}"</span>: [${values(a.focus)}],</div><div>&nbsp; <span class="key">"${t('about.offscreenKey')}"</span>: [${values(a.offscreen)}]</div><div>}</div></div><div class="prose about-prose">${p.body}</div>${socialContacts()}<p class="small-note">${esc(p.note||'')}</p>`;
}
function notFound(){return `${path('404')}<div class="page-head"><h1>${t('notFound.title')}</h1><p>${t('notFound.lead')}</p></div><a href="#/" class="accent">${t('notFound.back')}</a>`}
function cli(){cwd='~';return `<a class="cli-exit" href="#/">${t('cli.exit')}</a><div class="cli-screen"><div class="cli-logo cli-brand" aria-label="${t('cli.label')}">${document.querySelector('.brand-mark').outerHTML}<span>${esc(SITE.name)}<small>${t('cli.subtitle')}</small></span></div><div class="cli-welcome">${t('cli.welcome')}<br>${t('cli.instructions')}<br><span class="muted">${t('cli.notice')}</span></div><div class="cli-output" id="cli-output" role="log" aria-live="polite" aria-label="${t('cli.output')}"></div><form id="cli-form" class="cli-form" autocomplete="off"><label for="cli-input"><span class="prompt-user">${t('cli.guest')}</span>@<span class="prompt-host">${esc(SITE.handle)}</span> <span class="prompt-path" id="cli-cwd">~</span></label><div class="cli-input-group"><span aria-hidden="true">❯</span><input class="cli-input" id="cli-input" aria-label="${t('cli.input')}" spellcheck="false" autocapitalize="off" autocomplete="off"></div></form><div class="cli-hint">${t('cli.hint')}</div></div>`}
function cliReply(command,body){const out=$('#cli-output');const entry=document.createElement('div');entry.className='cli-entry';entry.innerHTML=`<div class="cli-command"><span class="prompt-user">${t('cli.guest')}</span>@<span class="prompt-host">${esc(SITE.handle)}</span> <span class="prompt-path">${esc(cwd)}</span> ❯ ${esc(command)}</div><div>${body}</div>`;out.append(entry);$('#cli-cwd').textContent=cwd;$('#cli-input').scrollIntoView({block:'nearest'})}
function runCommand(raw){const command=raw.trim();if(!command)return;cliHistory.push(command);historyIndex=cliHistory.length;const [cmd,...args]=command.split(/\s+/),arg=args.join(' ').replace(/^~\/?/,'').replace(/^\//,'');let response='';switch(cmd.toLowerCase()){
case 'help':response=t('cli.help');break;
case 'ls':response=cwd==='~/blog'?posts.map(p=>`<a href="${postUrl(p)}">${p.date}  ${esc(p.slug)}.md</a>`).join('\n'):t('cli.rootListing');break;
case 'pwd':response=esc('/home/'+SITE.handle+(cwd==='~'?'':cwd.slice(1)));break;
case 'cd':if(!arg||arg==='..'||arg==='/'){cwd='~';response='~'}else if(arg==='blog'||arg==='blog/'){cwd='~/blog';response=t('cli.enteredBlog')}else if(arg==='travel'||arg==='travel/'||arg==='work'||arg==='work/'){location.hash='/'+arg.replace(/\/$/,'');return}else response=t('cli.directoryMissing',{path:arg});break;
case 'cat':if(arg==='about.md'){response=esc(aboutPlainText())}else if(arg.startsWith('work/')){const w=WORKS.find(w=>w.slug===arg.slice(5).replace(/\.md$/,''));response=w?`<strong>${esc(w.title)}</strong><div class="prose">${w.body}</div>`:t('cli.fileMissing')}else{const name=arg.replace(/^blog\//,'').replace(/\.md$/,'');const p=posts.find(p=>p.slug===name);response=p?`<strong>${esc(p.title)}</strong>\n<span class="muted">${p.date} · ${esc(tagName(p.tag))} · ${t(p.sourceUrl?'article.notion':'cli.localPost')}</span><div class="prose">${p.body}</div>`:t('cli.fileMissing')}break;
case 'open':{const dest=arg.replace(/\/$/,'').replace(/\.md$/,'');if(['','home','about','work','blog','travel','cli'].includes(dest)){location.hash='/'+(dest==='home'?'':dest);return}const work=WORKS.find(w=>dest==='work/'+w.slug);if(work){location.hash='/work/'+encodeURIComponent(work.slug);return}const p=posts.find(p=>p.slug===dest.replace(/^blog\//,''));if(p){location.hash='/blog/'+encodeURIComponent(p.slug);return}response=t('cli.pageMissing',{path:arg});break}
case 'theme':if(['dark','light','auto'].includes(arg)){setTheme(arg);response=t('cli.themeChanged',{mode:arg})}else response=t('cli.themeUsage');break;
case 'clear':$('#cli-output').innerHTML='';return;
case 'history':response=cliHistory.map((c,i)=>`${String(i+1).padStart(2,' ')}  ${esc(c)}`).join('\n');break;
case 'exit':location.hash='/';return;
default:response=t('cli.unknown',{command:cmd})
}cliReply(command,response)}
function setupCli(){const input=$('#cli-input');$('#cli-form').addEventListener('submit',e=>{e.preventDefault();const raw=input.value;input.value='';runCommand(raw)});input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();historyIndex=Math.max(0,historyIndex-1);input.value=cliHistory[historyIndex]||''}else if(e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.min(cliHistory.length,historyIndex+1);input.value=cliHistory[historyIndex]||''}else if(e.key==='Tab'){e.preventDefault();const val=input.value,commands=['help','ls','cd','cat','open','pwd','clear','history','theme','exit'];let options;if(!val.includes(' ')){options=commands.filter(c=>c.startsWith(val))}else{const prefix=val.slice(val.lastIndexOf(' ')+1),head=val.slice(0,val.lastIndexOf(' ')+1);options=['work/','blog/','travel/','about.md',...WORKS.map(w=>'work/'+w.slug+'.md'),...posts.map(p=>p.slug+'.md'),'dark','light'].filter(c=>c.startsWith(prefix)).map(c=>head+c)}if(options.length===1)input.value=options[0];else if(options.length>1)toast(options.slice(0,5).join(' · '))}else if(e.ctrlKey&&e.key==='l'){e.preventDefault();$('#cli-output').innerHTML=''}});input.focus({preventScroll:true})}
function render(){Travel.unmount();Work.unmount();clearInterval(asciiTimer);const route=decodeURIComponent(location.hash.slice(1)||'/');currentRoute=route;const parts=route.split('/').filter(Boolean),section=parts[0]||'home';document.querySelectorAll('.primary-nav a').forEach(a=>{const active=a.dataset.route===(section==='home'?'work':section);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});main.innerHTML=section==='home'?home():section==='blog'?(parts[1]?article(parts[1]):blog()):section==='travel'?Travel.page():section==='work'?(Work.page(parts[1])||notFound()):section==='about'?about():section==='cli'?cli():notFound();const title=section==='blog'&&parts[1]?posts.find(p=>p.slug===parts[1])?.title:section==='work'&&parts[1]?WORKS.find(w=>w.slug===parts[1])?.title:(COPY.titles[section]||COPY.titles.notFound);document.title=`${title||COPY.titles.notFound} · ${SITE.name}`;window.scrollTo({top:0,left:0,behavior:'instant'});if((section==='home'||section==='work')&&!parts[1])startAscii();if(section==='blog'&&!parts[1]){renderList();$('#search').addEventListener('input',e=>{search=e.target.value;renderList()});document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',x===b));renderList()}));$('#year-toggle').addEventListener('click',()=>{const b=$('#year-toggle'),open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));b.querySelector('span').textContent=open?'▸':'▾';$('#blog-list').hidden=open})}if(section==='blog'&&parts[1])document.querySelectorAll('[data-article-section]').forEach(button=>button.addEventListener('click',()=>{const heading=document.getElementById(button.dataset.articleSection);heading?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});heading?.focus({preventScroll:true})}));if(section==='about')bindSocialContacts();if(section==='cli')setupCli();if(section==='travel')Travel.mount();if(section==='home'||section==='work')Work.mount();document.body.dataset.page=section;document.body.dataset.layout=((section==='home'||section==='work')&&!parts[1])?'portfolio':'reading';progress()}
function progress(){const el=$('#reading-progress');if(currentRoute.startsWith('/blog/')||currentRoute.startsWith('/work/')){const length=document.documentElement.scrollHeight-innerHeight;el.style.width=length>0?`${Math.min(100,scrollY/length*100)}%`:'0'}else el.style.width='0'}
window.addEventListener('scroll',progress,{passive:true});window.addEventListener('hashchange',()=>{render();if(!currentRoute.startsWith('/cli'))main.focus({preventScroll:true})});document.addEventListener('keydown',e=>{if(currentRoute!=='/blog')return;if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();$('#search').focus()}if(['ArrowDown','ArrowUp'].includes(e.key)&&document.activeElement.tagName!=='INPUT'){const rows=[...document.querySelectorAll('#blog-list .post-row')];if(!rows.length||$('#blog-list').hidden)return;e.preventDefault();const current=rows.indexOf(document.activeElement);const idx=e.key==='ArrowDown'?Math.min(rows.length-1,current+1):Math.max(0,current<0?rows.length-1:current-1);rows[idx].focus()}});render();I18N.restoreScroll();
document.querySelector('[data-route="work"]').addEventListener('click',event=>{if((currentRoute==='/'||currentRoute==='/work'||currentRoute==='/home')&&document.querySelector('#selected-work')){event.preventDefault();document.querySelector('#selected-work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});document.querySelector('#selected-work h2')?.focus({preventScroll:true})}});
document.querySelector('.wordmark').addEventListener('click',()=>{if(!location.hash||location.hash==='#/')window.scrollTo({top:0,behavior:'instant'})});
})();
