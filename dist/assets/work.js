(() => {
'use strict';
const works=window.WORKS;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=(key,values)=>esc(Copy(key,values));
const url=work=>'#/work/'+encodeURIComponent(work.slug);
const number=index=>String(index+1).padStart(2,'0');
let observer=null,revealObserver=null;
const wave='<svg viewBox="0 0 120 32" fill="none" aria-hidden="true"><path d="M2 16h12l6-11 9 22 10-25 10 28 8-20 8 13 7-7h46" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pipeline='<svg viewBox="0 0 160 90" fill="none" aria-hidden="true"><path d="M12 18h45a12 12 0 0 1 12 12v30a12 12 0 0 0 12 12h67M12 72h25a12 12 0 0 0 12-12V30a12 12 0 0 1 12-12h87" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="18" r="5" fill="currentColor"/><circle cx="148" cy="72" r="5" fill="currentColor"/><circle cx="12" cy="72" r="5" stroke="currentColor" stroke-width="2"/><circle cx="148" cy="18" r="5" stroke="currentColor" stroke-width="2"/></svg>';

function artwork(work){
  if(work.caseStudy&&window.CaseStudy)return window.CaseStudy.preview(work);
  if(work.cover)return `<figure class="work-visual work-cover"><img src="${esc(work.cover)}" alt="${esc(work.coverAlt)}" loading="lazy" decoding="async">${work.coverCaption?`<figcaption>${esc(work.coverCaption)}</figcaption>`:''}</figure>`;
  const v=work.visual,nodes=v.nodes||[];
  let graphic='';
  if(v.type==='music')graphic=`<div class="work-record"><div class="work-record-label">${wave}<span>${esc(v.title)}</span></div><i></i></div><div class="work-music-title">${esc(v.title)}</div><div class="work-music-wave">${Array.from({length:31},(_,i)=>`<i style="--bar:${12+((i*13+i*i*7)%29)}px"></i>`).join('')}</div>`;
  else if(v.type==='conversation')graphic=`<div class="work-chat-orbit orbit-one"></div><div class="work-chat-orbit orbit-two"></div><div class="work-chat-bubble chat-left"><span>${esc(nodes[0])}</span><i></i><i></i></div><div class="work-chat-connection"><span></span><span></span><span></span><small>${esc(nodes[1])}</small></div><div class="work-chat-bubble chat-right"><span>${esc(nodes[2])}</span><i></i><i></i></div><div class="work-chat-title">${esc(v.title)}</div>`;
  else if(v.type==='reading')graphic=`<div class="work-reading-sheet"><div class="work-reading-masthead"><span class="reading-symbol">◌</span><span>${esc(v.title)}</span><small>${esc(v.subtitle)}</small></div><div class="work-reading-columns">${[0,1].map(column=>`<div>${[0,1].map(row=>`<div class="work-reading-card reading-${column}-${row}"><div class="reading-picture"><span></span></div><i></i><i></i><i></i><small></small></div>`).join('')}</div>`).join('')}</div></div>`;
  else if(v.type==='agent')graphic=`<div class="work-agent-mark">${pipeline}<span>${esc(v.title)}<small>${esc(v.subtitle)}</small></span></div><div class="work-agent-pipeline">${nodes.map((node,i)=>`<div><span class="work-agent-step">${number(i)}</span><span>${esc(node)}</span><i aria-hidden="true"></i></div>`).join('')}</div><div class="work-agent-trace" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>`;
  else graphic=`<div class="work-generic-mark">${pipeline}<span>${esc(v.title||work.title)}</span></div>`;
  const caption=v.caption||Copy('work.genericCaption');
  return `<figure class="work-visual work-visual-${esc(v.type)}" aria-label="${t('work.visualLabel',{title:work.title,caption})}"><div class="work-art" aria-hidden="true"><div class="work-art-label"><span>${esc(v.label)}</span><span class="work-art-corner">↗</span></div>${graphic}<div class="work-art-bottom">${v.type==='music'?`<span>${esc(v.subtitle)}</span><span>${nodes.map(esc).join(' / ')}</span>`:`<span>${esc(v.footer)}</span>`}</div></div><figcaption><span class="visual-caption-dot"></span>${esc(caption)}</figcaption></figure>`;
}
function homePreview(){
  if(!works.length)return '';
  return `<section class="home-work" aria-labelledby="home-work-title"><div class="section-heading"><h2 id="home-work-title">~/${t('nav.work')} <span class="muted">${t('work.homeTitle')}</span></h2><a href="#/work">${t('work.homeView')}</a></div><div class="home-work-list">${works.map((w,i)=>`<a href="${url(w)}"><span class="home-work-number">${number(i)}</span><span>${esc(w.title)}<small>${esc(w.company)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
}
function overview(){
  const p=PAGES.work,hero=PAGES.home;
  return `<div class="work-page"><header class="portfolio-hero" aria-labelledby="portfolio-title"><div class="hero-grid"><div class="hero-copy"><div class="work-eyebrow">${esc(hero.heroOverline)}</div><div class="hero-identity"><h1 id="portfolio-title"><span class="hero-hello">${esc(hero.greeting)}</span><span class="hero-name">${esc(hero.heroName)}</span></h1></div><p class="hero-specialty">${esc(hero.heroSpecialty).replace(/\n/g,'<br>')}</p><div class="hero-description">${hero.body}</div><div class="hero-standard"><span>${esc(hero.heroStandardLabel)}</span><p>${esc(hero.heroStandard)}</p></div></div><div class="hero-visual" role="img" aria-label="${t('home.artLabel')}"><div class="source-field"><pre id="ascii-art" class="ascii-art" aria-hidden="true"></pre><canvas class="source-interaction" aria-hidden="true"></canvas></div><span class="hero-art-hint">${t('home.artHint')}</span><span class="hero-figure-label">${t('home.artCaption')}</span></div></div><div class="hero-bottom"><span>${esc(hero.heroRole)}</span><button type="button" class="scroll-to-work" id="view-work">${esc(hero.scrollLabel)} <span aria-hidden="true">↓</span></button><span>${t('work.count',{count:String(works.length).padStart(2,'0')})}</span></div></header><section class="selected-work" id="selected-work" aria-labelledby="selected-work-title"><div class="work-section-heading"><div><span class="work-eyebrow">${esc(p.eyebrow)}</span><h2 id="selected-work-title" tabindex="-1">${esc(p.title)}</h2></div><p>${esc(p.lead)}</p></div>${works.length?`<nav class="work-index" aria-label="${t('work.indexLabel')}">${works.map((w,i)=>`<button type="button" data-work-jump="${esc(w.slug)}"><span>${number(i)}</span>${esc(w.title)}</button>`).join('')}</nav><div class="work-collection">${works.map((w,i)=>`<article class="work-entry" id="work-${esc(w.slug)}"><a class="work-card" href="${url(w)}" aria-label="${t('work.sectionLabel',{number:number(i),title:w.title})}"><div class="work-card-copy"><div class="work-card-meta"><span>${number(i)} <span class="work-meta-slash">/</span> ${esc(w.category)}</span><span>${esc(w.period)}</span></div><div class="work-card-company">${esc(w.company)}</div><h2 tabindex="-1">${esc(w.title)}<span class="work-card-arrow" aria-hidden="true">↗</span></h2><p class="work-card-headline">${esc(w.headline)}</p><p class="work-card-summary">${esc(w.summary)}</p>${I18N.language==='en'&&w.contentLanguage==='zh'?`<p class="content-language-note">${t('work.originalNotice')}</p>`:''}${w.focus.length?`<ul class="work-focus">${w.focus.map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:''}<div class="work-card-bottom"><span>${esc(w.role)}</span><span class="work-read">${t('work.read')} <span aria-hidden="true">↗</span></span></div></div>${artwork(w)}</a></article>`).join('')}</div>`:`<p class="empty-state">${t('work.empty')}</p>`}</section><footer class="work-closing"><span class="work-closing-mark" aria-hidden="true">✳</span><div><h2>${esc(p.closingTitle)}</h2><p>${esc(p.closingText)}</p></div><a href="#/about">${t('work.about')}</a></footer></div>`;
}
function detail(slug){
  const w=works.find(w=>w.slug===slug);if(!w)return null;
  const index=works.indexOf(w),next=works[(index+1)%works.length];
  if(w.caseStudy&&window.CaseStudy)return window.CaseStudy.page(w,{index,next});
  return `<article class="work-page work-detail"><div class="path">~ / <span>${t('nav.work')} ${esc(w.slug)}</span></div><a class="back-link" href="#/work">${t('work.back')}</a><header class="work-case-head"><div class="work-eyebrow"><span>${number(index)} <span class="work-meta-slash">/</span> ${esc(w.category)}</span><span>${esc(w.company)}</span></div><h1>${esc(w.title)}</h1><p class="work-case-headline">${esc(w.headline)}</p><p class="work-case-summary">${esc(w.summary)}</p><dl class="work-case-meta">${[['role',w.role],['period',w.period]].filter(([,value])=>value).map(([key,value])=>`<div><dt>${t('work.'+key)}</dt><dd>${esc(value)}</dd></div>`).join('')}${w.tags.length?`<div><dt>${t('work.stack')}</dt><dd>${w.tags.map(esc).join(' / ')}</dd></div>`:''}</dl></header>${artwork(w)}${w.highlights.length?`<dl class="work-results">${w.highlights.map(h=>`<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join('')}</dl>`:''}${I18N.language==='en'&&w.contentLanguage==='zh'?`<p class="content-language-note">${t('work.originalNotice')}</p>`:''}<div class="work-case-reading"><div class="prose article-prose work-case-body" lang="${w.contentLanguage==='zh'?'zh-CN':document.documentElement.lang}">${w.body}</div>${w.toc.length?`<nav class="work-case-toc" aria-label="${t('work.contents')}"><span>${t('work.contents')}</span>${w.toc.map(item=>`<button type="button" data-work-section="${item.id}">${esc(item.title)}</button>`).join('')}</nav>`:''}</div><nav class="work-case-footer" aria-label="${t('work.indexLabel')}"><a href="#/work">${t('work.back')}</a>${works.length>1?`<a href="${url(next)}" aria-label="${t('work.nextLabel',{title:next.title})}"><span>${t('work.next')}</span><strong>${esc(next.title)} <span aria-hidden="true">↗</span></strong></a>`:''}</nav></article>`;
}
function mount(){
  window.CaseStudy?.mount();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced&&typeof IntersectionObserver!=='undefined'){
    revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}});
    },{rootMargin:'0px 0px -6% 0px',threshold:.12});
    document.querySelectorAll('.work-entry').forEach(entry=>{
      entry.classList.add('will-reveal');revealObserver.observe(entry);
      entry.addEventListener('focusin',()=>entry.classList.add('is-visible'));
    });
  }
  document.querySelector('#view-work')?.addEventListener('click',()=>{
    document.querySelector('#selected-work')?.scrollIntoView({block:'start',behavior:reduced?'instant':'smooth'});
    document.querySelector('#selected-work-title')?.focus({preventScroll:true});
  });
  const buttons=[...document.querySelectorAll('[data-work-jump]')];
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const entry=document.getElementById('work-'+button.dataset.workJump);
    entry?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    entry?.querySelector('h2')?.focus({preventScroll:true});
  }));
  if(buttons.length){
    observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!visible)return;
      buttons.forEach(button=>{if('work-'+button.dataset.workJump===visible.target.id)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current')});
    },{rootMargin:'-90px 0px -35% 0px',threshold:[0,.25,.6]});
    document.querySelectorAll('.work-entry').forEach(entry=>observer.observe(entry));
  }
  document.querySelectorAll('[data-work-section]').forEach(button=>button.addEventListener('click',()=>{
    const heading=document.getElementById(button.dataset.workSection);
    heading?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});heading?.focus({preventScroll:true});
  }));
}
function unmount(){window.CaseStudy?.unmount();observer?.disconnect();observer=null;revealObserver?.disconnect();revealObserver=null}
window.Work={page:slug=>slug?detail(slug):overview(),homePreview,mount,unmount};
})();
