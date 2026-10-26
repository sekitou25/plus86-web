(() => {
'use strict';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const t=(key,values)=>esc(Copy('caseStudy.'+key,values));
const wt=key=>esc(Copy('work.'+key));
const copy=work=>work.caseStudy.copy[I18N.language==='en'?'en':'zh'];
const n=index=>String(index+1).padStart(2,'0');
const poster=media=>media.poster||media.src;
let controller=null,mediaController=null,mediaObserver=null,timer=0,activeWork=null,sceneIndex=0,dialogOpener=null;

function preview(work){
  const data=work.caseStudy,c=copy(work),images=data.media.slice(0,2);
  if(data.kind==='qa')return `<figure class="work-visual case-preview case-qa"><div class="case-preview-label"><span>${esc(c.eyebrow)}</span><span>↗</span></div><div class="case-preview-phones"><div class="qa-preview-flow">${c.previewNodes.map((label,i)=>`<div><span>${n(i)}</span><p>${esc(label)}</p></div>`).join('')}</div><div class="case-mini-phone qa-preview-phone"><img src="${esc(poster(images[0]))}" alt="" loading="lazy" decoding="async" width="1206" height="2622"></div></div><figcaption><span>${esc(c.preview)}</span><small>${esc(c.previewDetail)}</small></figcaption></figure>`;
  return `<figure class="work-visual case-preview case-${data.kind}"><div class="case-preview-label"><span>${esc(c.eyebrow)}</span><span>↗</span></div><div class="case-preview-phones" aria-hidden="true">${images.map((media,i)=>`<div class="case-mini-phone phone-${i}"><img src="${esc(poster(media))}" alt="" loading="lazy" decoding="async" width="720" height="1560"></div>`).join('')}</div><figcaption><span>${esc(c.preview)}</span><small>${esc(c.previewDetail)}</small></figcaption></figure>`;
}

function sceneMarkup(work,index){
  const data=work.caseStudy,media=data.media[index],scene=copy(work).scenes[index];
  const screen=media.type==='video'
    ? `<video id="case-recording" controls playsinline muted preload="none" poster="${esc(media.poster)}" aria-label="${esc(scene.alt)}"><source src="${esc(media.src)}" type="video/mp4"></video><button type="button" class="case-video-play" data-play-recording aria-label="${t('play')}"><span aria-hidden="true">▶</span></button><div class="case-video-error" hidden><p>${t('error')}</p><a href="${esc(media.src)}" target="_blank" rel="noopener noreferrer">${t('openVideo')}</a></div>`
    : `<button type="button" class="case-image-open" data-expand-image aria-label="${t('expand')}"><img src="${esc(media.src)}" alt="${esc(scene.alt)}" width="720" height="1560"><span class="case-expand" aria-hidden="true">↗</span></button>`;
  return `<div class="case-device"><div class="case-device-screen">${screen}</div></div><div class="case-scene-meta"><span>${t(media.type==='video'?'recording':'screenshot')}</span><span>${n(index)} / ${String(data.media.length).padStart(2,'0')}</span></div>`;
}

function page(work,{index,next}){
  const data=work.caseStudy,c=copy(work),lab=c.lab;
  return `<article class="case-study case-${data.kind}" data-case-study="${esc(work.slug)}">
    <div class="case-topline"><a class="back-link" href="#/work">${wt('back')}</a><span>${esc(work.company)} <i>/</i> ${esc(work.period)}</span></div>
    <section class="case-hero" aria-labelledby="case-title">
      <div class="case-intro"><span class="case-kicker">${esc(c.eyebrow)}</span><p class="case-project-name">${esc(work.title)}</p><h1 id="case-title">${esc(c.title).replace(/\n/g,'<br>')}</h1><p class="case-intro-text">${esc(c.intro)}</p><dl class="case-ownership"><div><dt>${wt('role')}</dt><dd>${esc(work.role)}</dd></div><div><dt>${wt('stack')}</dt><dd>${work.tags.map(esc).join(' · ')}</dd></div></dl><div class="case-hero-actions">${c.architecture?`<button type="button" data-case-jump="case-architecture">${c.architectureAction?esc(c.architectureAction):t('architecture')}</button>`:''}<button type="button" data-case-jump="case-lab">${t('try')}</button><button type="button" data-case-jump="case-decisions">${t('read')}</button></div><div class="case-lens"><span id="case-lens-label">${esc(c.scenes[0].lens)}</span><p id="case-insight">${esc(c.scenes[0].insight)}</p></div></div>
      <div class="case-showcase"><div class="case-showcase-top"><span>${c.mediaTitle?esc(c.mediaTitle):t('watch')}</span><span aria-hidden="true">↙</span></div><div class="case-device-stage" id="case-device-stage">${sceneMarkup(work,0)}</div><div class="case-scene-controls"><button type="button" class="case-scene-arrow" data-scene-direction="-1" aria-label="${t('previous')}">←</button><div class="case-scene-picker" role="group" aria-label="${t('scenes')}">${c.scenes.map((scene,i)=>`<button type="button" data-case-scene="${i}" aria-pressed="${i===0}"><span>${n(i)}</span>${esc(scene.title)}</button>`).join('')}</div><button type="button" class="case-scene-arrow" data-scene-direction="1" aria-label="${t('next')}">→</button></div><p class="case-scene-caption" id="case-scene-caption">${esc(c.scenes[0].caption)}</p><span class="sr-only" id="case-scene-status" role="status"></span></div>
    </section>
    <section class="case-outcomes" aria-label="${t('results')}"><dl>${work.highlights.map(h=>`<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join('')}</dl><p>${esc(c.outcomeNote)}</p></section>
    ${window.CaseEngineering?.architecture(work)||''}
    ${window.CaseEngineering?.results(work)||''}
    ${window.CaseEngineering?.evidence(work)||''}
    <section class="case-decisions" id="case-decisions" aria-labelledby="case-decisions-title"><header class="case-section-heading"><span class="case-kicker">${t('productEngineering')}</span><h2 id="case-decisions-title" tabindex="-1">${esc(c.storyTitle)}</h2><p>${esc(c.storyLead)}</p></header><div class="case-decision-list">${c.decisions.map((decision,i)=>`<section class="case-decision"><div class="case-decision-title"><span>${n(i)}</span><h3>${esc(decision.title)}</h3></div><div class="case-decision-body"><div><h4>${t('experience')}</h4><p>${esc(decision.experience)}</p></div><div><h4>${t('engineering')}</h4><p>${esc(decision.engineering)}</p></div><div class="case-tradeoff"><h4>${t('tradeoff')}</h4><p>${esc(decision.tradeoff)}</p></div></div></section>`).join('')}</div></section>
    <section class="case-lab" id="case-lab" aria-labelledby="case-lab-title"><header class="case-section-heading"><span class="case-kicker">${t('lab')} <span class="case-simulation-label">${t('simulation')}</span></span><h2 id="case-lab-title" tabindex="-1">${esc(lab.title)}</h2><p>${esc(lab.lead)}</p></header><div class="case-lab-board"><div class="case-lab-toolbar"><div class="case-lab-modes" role="group" aria-label="${t('scenario')}">${lab.modes.map((mode,i)=>`<button type="button" data-lab-mode="${i}" aria-pressed="${i===0}">${esc(mode)}</button>`).join('')}</div><button type="button" class="case-lab-run" data-lab-run>${esc(lab.start)} <span aria-hidden="true">↗</span></button></div><div class="case-lab-path" role="group" aria-label="${t('lab')}">${lab.stages.map((stage,i)=>`<button type="button" data-lab-stage="${i}" data-state="idle" aria-pressed="${i===0}"><span class="case-node">${n(i)}</span><span>${esc(stage.title)}</span></button>`).join('')}</div><div class="case-lab-detail"><div><span class="case-kicker" data-lab-detail-label>${t('step')} 01</span><p data-lab-detail>${esc(lab.stages[0].detail)}</p></div><div class="case-lab-sample"><span>${esc(lab.sample)}</span><div class="case-signal-art" aria-hidden="true">${data.kind==='qa'?'<span class="qa-heart before"><svg viewBox="0 0 64 64"><path d="M32 54C-8 30 8 1 32 20C56 1 72 30 32 54Z"/></svg></span><span class="qa-heart-arrow">→</span><span class="qa-heart after"><svg viewBox="0 0 64 64"><path d="M32 54C-8 30 8 1 32 20C56 1 72 30 32 54Z"/></svg></span>':data.kind==='music'?Array.from({length:24},(_,i)=>`<i style="--signal-height:${18+(i*7)%30}px;--signal-delay:${i*35}ms"></i>`).join(''):'<i class="signal-message"></i><i class="signal-reply"></i><i class="signal-dot"></i>'}</div><p data-lab-output>${esc(lab.output)}</p></div></div><p class="case-lab-status" data-lab-status role="status">${esc(lab.idle)}</p></div><p class="case-lab-footnote">${esc(lab.footnote)}</p></section>
    <details class="case-engineering-notes" id="case-notes"><summary><span>${t('notes')}<small>${t('notesHint')}</small></span><span class="case-notes-icon" aria-hidden="true">+</span></summary><div class="prose article-prose">${work.body}</div></details>
    <aside class="case-source-note"><span>${t('source')}</span><p>${esc(c.mediaNote)}</p></aside>
    <nav class="work-case-footer" aria-label="${wt('indexLabel')}"><a href="#/work">${wt('back')}</a>${next&&next!==work?`<a href="#/work/${encodeURIComponent(next.slug)}"><span>${wt('next')}</span><strong>${esc(next.title)} ↗</strong></a>`:''}</nav>
    <dialog class="case-image-dialog" aria-labelledby="case-image-caption"><button type="button" data-close-case-image aria-label="${t('close')}">×</button><figure><img alt=""><figcaption id="case-image-caption"></figcaption></figure></dialog>
  </article>`;
}

function on(element,event,handler){element?.addEventListener(event,handler,{signal:controller.signal});}
function bindMedia(){
  const root=document.querySelector('.case-study'),video=root?.querySelector('video');
  const play=root?.querySelector('[data-play-recording]');
  mediaController?.abort();mediaController=new AbortController();
  const listen=(element,event,handler)=>element?.addEventListener(event,handler,{signal:mediaController.signal});
  mediaObserver?.disconnect();mediaObserver=null;
  if(video){
    const errorBox=video.parentElement.querySelector('.case-video-error');
    listen(play,'click',()=>{video.play().catch(error=>{if(error.name==='AbortError'||!video.isConnected)return;errorBox.hidden=false;play.hidden=true;});});
    listen(video,'play',()=>{play.hidden=true;errorBox.hidden=true;});
    listen(video,'ended',()=>{play.hidden=false;});
    listen(video,'error',()=>{errorBox.hidden=false;play.hidden=true;});
    // Loading waits for user intent. Playback pauses once the device leaves view.
    if(typeof IntersectionObserver!=='undefined'){
      mediaObserver=new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause();},{threshold:0});
      mediaObserver.observe(video);
    }
  }
  listen(root?.querySelector('[data-expand-image]'),'click',event=>{
    const media=activeWork.caseStudy.media[sceneIndex],scene=copy(activeWork).scenes[sceneIndex],dialog=root.querySelector('dialog');
    dialogOpener=event.currentTarget;
    dialog.querySelector('img').src=media.src;dialog.querySelector('img').alt=scene.alt;
    dialog.querySelector('figcaption').textContent=scene.caption;dialog.showModal();
  });
}

function selectScene(index){
  const data=activeWork.caseStudy,c=copy(activeWork);
  sceneIndex=(index+data.media.length)%data.media.length;
  const stage=document.getElementById('case-device-stage');
  stage.querySelector('video')?.pause();stage.innerHTML=sceneMarkup(activeWork,sceneIndex);
  document.querySelectorAll('[data-case-scene]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.caseScene)===sceneIndex)));
  document.getElementById('case-lens-label').textContent=c.scenes[sceneIndex].lens;
  document.getElementById('case-insight').textContent=c.scenes[sceneIndex].insight;
  document.getElementById('case-scene-caption').textContent=c.scenes[sceneIndex].caption;
  document.getElementById('case-scene-status').textContent=Copy('caseStudy.mediaStatus',{title:c.scenes[sceneIndex].title});
  bindMedia();
}

function mountLab(work){
  const root=document.querySelector('.case-lab'),lab=copy(work).lab;
  const run=root.querySelector('[data-lab-run]'),board=root.querySelector('.case-lab-board');
  const stages=[...root.querySelectorAll('[data-lab-stage]')],modes=[...root.querySelectorAll('[data-lab-mode]')];
  let mode=0,active=-1,paused=false,running=false;
  const reading=work.caseStudy.kind==='reading';
  let selectedCard=1,readingCards=[];
  if(reading){
    const feed=root.querySelector('.case-signal-art');
    feed.classList.add('case-reading-feed');feed.removeAttribute('aria-hidden');
    feed.setAttribute('role','group');feed.setAttribute('aria-label',lab.feedLabel);
    feed.innerHTML=lab.cards.map((card,i)=>`<button type="button" data-reading-card="${i}" aria-pressed="${i===selectedCard}"><span class="case-reading-card-art" aria-hidden="true"><span>${n(i)}</span></span><span class="case-reading-card-title">${esc(card.title)}</span><span class="case-reading-card-label">${esc(card.category)}</span></button>`).join('');
    readingCards=[...feed.querySelectorAll('[data-reading-card]')];
  }
  const updateReading=complete=>{
    readingCards.forEach((button,i)=>{
      const selected=i===selectedCard,updated=selected&&complete&&mode===1;
      const card=updated?lab.replacement:lab.cards[i];
      button.disabled=running;button.setAttribute('aria-pressed',String(selected));
      button.dataset.updated=String(updated);
      button.querySelector('.case-reading-card-title').textContent=card.title;
      button.querySelector('.case-reading-card-label').textContent=selected?(complete?(updated?lab.updatedLabel:lab.retainedLabel):lab.selectedLabel):card.category;
    });
  };
  const detail=index=>{
    stages.forEach((stage,i)=>stage.setAttribute('aria-pressed',String(i===index)));
    root.querySelector('[data-lab-detail-label]').textContent=Copy('caseStudy.step')+' '+n(index);
    root.querySelector('[data-lab-detail]').textContent=lab.stages[index][mode===1?'prepared':'detail'];
  };
  const status=text=>{root.querySelector('[data-lab-status]').textContent=text;};
  const reset=()=>{
    clearTimeout(timer);timer=0;active=-1;paused=false;running=false;
    board.dataset.running='false';board.dataset.complete='false';board.setAttribute('aria-busy','false');
    stages.forEach(stage=>{stage.dataset.state='idle';});run.disabled=false;run.textContent=lab.start;
    root.querySelector('[data-lab-output]').textContent=lab.output;status(lab.idle);detail(0);
    updateReading(false);
  };
  const advance=index=>{
    active=index;detail(index);
    stages.forEach((stage,i)=>{stage.dataset.state=i<index?'done':i===index?'active':'idle';});
    root.querySelector('[data-lab-output]').textContent=lab.outputRunning;
    updateReading(false);
    if(work.caseStudy.kind==='conversation'&&mode===1&&index===1){
      paused=true;running=false;board.dataset.running='false';board.setAttribute('aria-busy','false');
      stages[index].dataset.state='waiting';status(lab.stalled);run.disabled=false;run.textContent=lab.resume;return;
    }
    status(lab.stages[index][mode===1?'prepared':'detail']);
    timer=setTimeout(()=>{
      if(index<stages.length-1)advance(index+1);
      else{
        stages.forEach(stage=>{stage.dataset.state='done';});running=false;
        board.dataset.running='false';board.dataset.complete='true';board.setAttribute('aria-busy','false');
        run.disabled=false;run.textContent=lab.start;status(work.caseStudy.kind==='qa'?lab.completions[mode]:lab.complete);
        root.querySelector('[data-lab-output]').textContent=work.caseStudy.kind==='qa'?lab.verdicts[mode]:lab.outputComplete;
        updateReading(true);
      }
    },matchMedia('(prefers-reduced-motion: reduce)').matches?160:(work.caseStudy.kind==='music'&&index===1?(mode===1?240:1200):650));
  };
  modes.forEach((button,i)=>on(button,'click',()=>{mode=i;reset();modes.forEach((b,j)=>b.setAttribute('aria-pressed',String(j===mode)));}));
  stages.forEach((button,i)=>on(button,'click',()=>detail(i)));
  readingCards.forEach((button,i)=>on(button,'click',()=>{selectedCard=i;reset();}));
  updateReading(false);
  on(run,'click',()=>{
    if(running)return;
    const continuation=paused;
    if(!continuation)reset();
    paused=false;running=true;run.disabled=true;run.textContent=lab.running;board.dataset.running='true';board.setAttribute('aria-busy','true');
    advance(continuation?active+1:0);
  });
}

function mount(){
  const root=document.querySelector('[data-case-study]');if(!root)return;
  controller=new AbortController();activeWork=window.WORKS.find(work=>work.slug===root.dataset.caseStudy);sceneIndex=0;
  root.querySelectorAll('[data-case-jump]').forEach(button=>on(button,'click',()=>{
    const section=document.getElementById(button.dataset.caseJump);
    section.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    section.querySelector('h2')?.focus({preventScroll:true});
  }));
  root.querySelectorAll('[data-case-scene]').forEach(button=>{
    on(button,'click',()=>selectScene(Number(button.dataset.caseScene)));
    on(button,'keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const length=activeWork.caseStudy.media.length;
      selectScene(event.key==='Home'?0:event.key==='End'?length-1:sceneIndex+(event.key==='ArrowRight'?1:-1));
      root.querySelector(`[data-case-scene="${sceneIndex}"]`).focus();
    });
  });
  root.querySelectorAll('[data-scene-direction]').forEach(button=>on(button,'click',()=>selectScene(sceneIndex+Number(button.dataset.sceneDirection))));
  const dialog=root.querySelector('dialog');
  on(root.querySelector('[data-close-case-image]'),'click',()=>dialog.close());
  on(dialog,'click',event=>{if(event.target===dialog)dialog.close();});
  on(dialog,'close',()=>dialogOpener?.focus({preventScroll:true}));
  on(document,'visibilitychange',()=>{if(document.hidden)root.querySelector('video')?.pause();});
  bindMedia();mountLab(activeWork);window.CaseEngineering?.mount(activeWork,root,on);
}
function unmount(){
  clearTimeout(timer);timer=0;controller?.abort();controller=null;mediaController?.abort();mediaController=null;mediaObserver?.disconnect();mediaObserver=null;
  document.querySelector('.case-study video')?.pause();
  document.querySelector('.case-image-dialog[open]')?.close();activeWork=null;dialogOpener=null;
}
window.CaseStudy={preview,page,mount,unmount};
})();
