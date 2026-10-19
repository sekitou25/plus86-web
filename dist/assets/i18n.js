(() => {
'use strict';
const query=new URL(location.href).searchParams.get('lang');
let saved='';try{saved=localStorage.getItem('siyuan-language')||''}catch{}
const language=['zh','en'].includes(query)?query:(['zh','en'].includes(saved)?saved:'zh');
if(language==='en'){
  const data=window.ENGLISH_CONTENT;
  window.SITE=data.site;window.PAGES=data.pages;window.COPY=data.ui;window.WORKS=data.works;window.POSTS=data.posts;window.TRAVEL_DATA=data.travel;
}
document.documentElement.lang=language==='en'?'en':'zh-CN';
document.documentElement.dataset.language=language;
try{localStorage.setItem('siyuan-language',language)}catch{}
function applyShell(){
  document.querySelectorAll('[data-copy]').forEach(element=>{element.textContent=Copy(element.dataset.copy)});
  document.querySelectorAll('[data-copy-aria]').forEach(element=>{element.setAttribute('aria-label',Copy(element.dataset.copyAria))});
  document.querySelectorAll('[data-site-name]').forEach(element=>{element.textContent=SITE.name});
  document.querySelectorAll('[data-language]').forEach(button=>{
    const active=button.dataset.language===language;
    button.setAttribute('aria-pressed',String(active));
    button.setAttribute('aria-label',Copy('language.switchTo',{language:button.textContent}));
  });
  document.querySelector('meta[name="description"]').content=SITE.metaDescription.replace(/\{name\}/g,SITE.name);
}
function setLanguage(next){
  if(!['zh','en'].includes(next)||next===language)return;
  try{localStorage.setItem('siyuan-language',next);sessionStorage.setItem('siyuan-language-scroll',JSON.stringify({hash:location.hash,top:scrollY}))}catch{}
  const url=new URL(location.href);url.searchParams.set('lang',next);location.assign(url.href);
}
function restoreScroll(){
  try{
    const saved=JSON.parse(sessionStorage.getItem('siyuan-language-scroll')||'null');
    sessionStorage.removeItem('siyuan-language-scroll');
    if(saved?.hash===location.hash&&Number.isFinite(saved.top))requestAnimationFrame(()=>window.scrollTo({top:saved.top,behavior:'instant'}));
  }catch{}
}
applyShell();
document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
window.I18N={language,applyShell,setLanguage,restoreScroll};
})();
