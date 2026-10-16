(() => {
'use strict';
const data=window.TRAVEL_DATA;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selected='all',view='photos',year='all',search='',activeIndex=0,visible=[],opener=null;
let closing=false, modalAnimation=null, contentAnimations=[],atlas=null;
const motionDuration=ms=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:ms;
const ease='cubic-bezier(.22,.8,.25,1)';
const $=s=>document.querySelector(s);
const placeOf=e=>data.places.find(p=>p.id===e.place);
const mapPlaces=data.mapPlaces||data.places;
const selection=id=>[...mapPlaces,...data.places].find(p=>p.id===id);
const matchesSelection=(e,id)=>id==='all'||e.place===id||placeOf(e).country===id;
const years=[...new Set(data.entries.filter(e=>e.date).map(e=>e.date.slice(0,4)))].sort().reverse();
const dateLabel=date=>date?date.replaceAll('-','.'):'日期未记录';
const dateMarkup=e=>e.date?`<time datetime="${e.date}">${dateLabel(e.date)}</time>`:'<span class="undated">日期未记录</span>';
const journalDate=e=>e.date?`<time datetime="${e.date}"><span>${e.date.slice(0,4)}</span>${e.date.slice(5).replace('-','.')}</time>`:'<div class="journal-date"><span>日期</span>未记录</div>';
function page(){return `<div class="path">~ / <span>travel/</span></div><div class="travel-heading"><div class="page-head"><div class="travel-eyebrow">A FIELD JOURNAL / 在路上</div><h1>${esc(data.title||'把世界，慢慢收进记忆')}<span class="accent">.</span></h1><p>走过的地方，按下的快门，还有当时没说完的话。</p></div><span class="demo-label">${esc(data.period||'旅行记录')}</span></div>${window.TravelAtlas.markup(data)}<div class="travel-destinations" role="group" aria-label="旅行地点"><button data-destination="all" aria-pressed="true">所有地方 <span>${String(data.entries.length).padStart(2,'0')}</span></button>${data.places.map(p=>`<button data-destination="${p.id}" aria-pressed="false">${p.name} <span>${String(data.entries.filter(e=>e.place===p.id).length).padStart(2,'0')}</span></button>`).join('')}</div><section class="travel-collection" aria-label="旅行相册和日记"><div class="travel-toolbar"><div class="travel-views" role="group" aria-label="展示方式"><button data-view="photos" aria-pressed="${view==='photos'}"><span aria-hidden="true">▦</span> 照片墙</button><button data-view="journal" aria-pressed="${view==='journal'}"><span aria-hidden="true">☷</span> 日记随笔</button></div><div class="travel-tools"><label class="sr-only" for="travel-search">搜索旅行记录</label><input type="search" id="travel-search" placeholder="搜索记忆…" value="${esc(search)}"><label class="sr-only" for="travel-year">筛选年份</label><select id="travel-year"><option value="all">所有年份</option>${years.map(y=>`<option value="${y}" ${year===y?'selected':''}>${y}</option>`).join('')}${data.entries.some(e=>!e.date)?`<option value="undated" ${year==='undated'?'selected':''}>日期未记录</option>`:''}</select></div></div><div id="travel-results" aria-live="polite"></div><div class="travel-end"><span id="travel-count"></span><span>the journey is the destination<span class="accent">_</span></span></div></section><p class="travel-demo-note">${esc(data.period||'')} · ${String(data.entries.length)} 张照片 · siyuan 的旅行相册<br>地图数据：<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth ↗</a></p><dialog class="travel-dialog" id="travel-dialog" aria-labelledby="memory-title"><div class="memory-shell"><button class="memory-close" id="memory-close" aria-label="关闭旅行记录">×</button><div id="memory-content"></div><div class="memory-navigation"><button id="memory-prev" aria-label="上一条旅行记录">← 上一则</button><span id="memory-counter"></span><button id="memory-next" aria-label="下一条旅行记录">下一则 →</button></div></div></dialog>`}
function update(){
  visible=data.entries.filter(e=>matchesSelection(e,selected)
    &&(year==='all'||(year==='undated'?!e.date:e.date.startsWith(year)))
    &&`${e.title} ${e.excerpt} ${e.body.join(' ')} ${placeOf(e).name} ${placeOf(e).en}`.toLowerCase().includes(search.trim().toLowerCase()));
  visible.sort((a,b)=>((b.date||'0000-00-00')+'T'+(b.time||'00:00')).localeCompare((a.date||'0000-00-00')+'T'+(a.time||'00:00')));
  const results=$('#travel-results');
  if(!results)return;
  results.className=view==='photos'?'photo-wall':'journal-list';
  results.innerHTML=visible.length?visible.map((e,i)=>{
    const p=placeOf(e);
    return view==='photos'?`<button class="photo-memory" data-memory="${i}" aria-label="查看${p.name}的照片记录：${esc(e.title)}"><div class="photo-frame" style="aspect-ratio:${e.ratio}"><img src="/assets/travel/${e.thumb||e.photo}" alt="${esc(e.alt)}" loading="lazy" decoding="async" width="${e.width||900}" height="${e.height||1000}"><span class="photo-open" aria-hidden="true">↗</span><span class="photo-place">${p.name}</span></div><span class="photo-caption"><span>${esc(e.title)}</span>${dateMarkup(e)}</span></button>`
      :`<button class="journal-memory" data-memory="${i}" aria-label="${e.body.length?'阅读随笔':'查看图记'}：${esc(e.title)}">${journalDate(e)}<div><span class="journal-place">⌖ ${p.name} <span>/ ${p.en}</span></span><h2>${esc(e.title)}</h2><p>${esc(e.excerpt)}</p><span class="journal-read">read this moment ↗</span></div><img src="/assets/travel/${e.thumb||e.photo}" alt="" loading="lazy" decoding="async" width="160" height="160"></button>`;
  }).join(''):'<div class="travel-empty"><span>没有找到这一段记忆。</span><button id="clear-travel-filters">清除筛选，看看全部足迹 →</button></div>';
  $('#travel-count').textContent=`${String(visible.length).padStart(2,'0')} ${view==='photos'?'moments':'entries'} / ${selected==='all'?'所有地方':selection(selected).name}`;
  document.querySelectorAll('[data-memory]').forEach(b=>b.addEventListener('click',()=>openMemory(Number(b.dataset.memory),b)));
  $('#clear-travel-filters')?.addEventListener('click',reset);
  document.querySelectorAll('[data-destination]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.destination===selected)));
  atlas?.setSelection(selected);
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
  const p=selection(selected);
  $('#map-caption').textContent=p?`${p.name} · ${p.id==='unlocated'?'照片地点待补充。':p.country?'点击其他目的地切换记忆。':'点击城市或目的地，继续探索。'}`:'点击国家，展开那里的目的地。';
}
function reset(){selected='all';year='all';search='';$('#travel-search').value='';$('#travel-year').value='all';update();atlas?.recenter()}
function selectPlace(id){const unchanged=id===selected;selected=id;update();if(unchanged)atlas?.recenter()}
function clearContentMotion(){
  contentAnimations.forEach(a=>a.cancel());
  contentAnimations=[];
  $('#memory-content')?.querySelectorAll('.memory-previous').forEach(el=>el.remove());
}
function displayMemory(animate=false,direction=1){
  clearContentMotion();
  const content=$('#memory-content'), e=visible[activeIndex],p=placeOf(e);
  const duration=motionDuration(320);
  const previous=animate&&duration&&content.children.length?content.cloneNode(true):null;
  if(previous){
    previous.removeAttribute('id');
    previous.className='memory-previous';
    previous.setAttribute('aria-hidden','true');
    previous.inert=true;
    previous.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
  }
  content.innerHTML=`<div class="memory-photo" style="--memory-image:url('/assets/travel/${encodeURI(e.thumb||e.photo)}')"><img src="/assets/travel/${e.thumb||e.photo}" alt="${esc(e.alt)}">${e.source?`<a class="memory-credit" href="${e.source}" target="_blank" rel="noopener noreferrer">${esc(e.credit)} ↗</a>`:`<span class="memory-credit">${esc(e.credit||'siyuan 的相册')}</span>`}</div><article class="memory-writing"><div class="travel-eyebrow">FIELD NOTES / ${esc(p.en)}</div><h2 id="memory-title">${esc(e.title)}</h2><div class="memory-meta">${dateMarkup(e)}<span>⌖ ${p.name}</span><span>${e.body.length?'随笔':'图记'}</span></div><div class="prose">${e.body.length?e.body.map(p=>`<p>${esc(p)}</p>`).join(''):'<p class="memory-note-empty">这张照片的随笔还没有写下。</p>'}</div><div class="memory-coordinates">${esc(p.name)} · ${dateLabel(e.date)}</div></article>`;
  if(e.thumb){
    const foreground=content.querySelector('.memory-photo>img');
    const full=new Image();
    full.src='/assets/travel/'+e.photo;
    full.decode().then(()=>{if(foreground.isConnected)foreground.src=full.src}).catch(()=>{});
  }
  if(previous){
    for(const child of content.children){
      contentAnimations.push(child.animate([
        {opacity:0,transform:`translateX(${direction*14}px)`},
        {opacity:1,transform:'translateX(0)'}
      ],{duration,easing:ease}));
    }
    content.append(previous);
    const fade=previous.animate([
      {opacity:1,transform:'translateX(0)'},
      {opacity:0,transform:`translateX(${-direction*10}px)`}
    ],{duration:duration*.85,easing:ease,fill:'forwards'});
    contentAnimations.push(fade);
    fade.finished.then(()=>previous.remove()).catch(()=>{});
  }
  $('#memory-counter').textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;
  $('#memory-prev').disabled=activeIndex===0;
  $('#memory-next').disabled=activeIndex===visible.length-1;
  $('#travel-dialog').scrollTop=0;
  // Warm adjacent images so switching never waits on a new image request.
  [activeIndex-1,activeIndex+1].forEach(i=>{if(visible[i]){const image=new Image();image.src='/assets/travel/'+visible[i].photo}});
}
function openMemory(i,button){
  const d=$('#travel-dialog');
  if(d.open||closing)return;
  activeIndex=i;opener=button;displayMemory();
  const source=button.querySelector('img')?.getBoundingClientRect();
  d.showModal();document.body.classList.add('memory-open');
  d.classList.remove('is-closing');d.classList.add('is-visible');
  const bounds=d.getBoundingClientRect();
  const originX=source?Math.min(88,Math.max(12,(source.left+source.width/2-bounds.left)/bounds.width*100)):50;
  const originY=source?Math.min(88,Math.max(12,(source.top+source.height/2-bounds.top)/bounds.height*100)):50;
  d.style.transformOrigin=`${originX}% ${originY}%`;
  modalAnimation?.cancel();
  modalAnimation=d.animate([
    {opacity:0,transform:'translateY(16px) scale(.95)'},
    {opacity:1,transform:'translateY(0) scale(1)'}
  ],{duration:motionDuration(380),easing:ease});
  $('#memory-close').focus({preventScroll:true});
}
async function closeMemory(){
  const d=$('#travel-dialog');
  if(!d?.open||closing)return;
  closing=true;
  const style=getComputedStyle(d),start={opacity:style.opacity,transform:style.transform};
  modalAnimation?.cancel();
  d.classList.remove('is-visible');d.classList.add('is-closing');
  modalAnimation=d.animate([start,{opacity:0,transform:'translateY(10px) scale(.97)'}],{
    duration:motionDuration(220),easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'
  });
  await modalAnimation.finished.catch(()=>{});
  if(d.isConnected&&d.open)d.close();
  modalAnimation?.cancel();modalAnimation=null;
  d.classList.remove('is-closing');
  clearContentMotion();closing=false;
  document.body.classList.remove('memory-open');
}
function stepMemory(direction){
  if(closing)return;
  const next=activeIndex+direction;
  if(next<0||next>=visible.length)return;
  activeIndex=next;displayMemory(true,direction);
}
function keydown(e){
  if(!$('#travel-dialog')?.open||closing)return;
  if(['INPUT','SELECT'].includes(e.target.tagName))return;
  if(e.key==='ArrowLeft'){e.preventDefault();stepMemory(-1)}
  if(e.key==='ArrowRight'){e.preventDefault();stepMemory(1)}
}
function mount(){selected='all';atlas=window.TravelAtlas.create(data,selectPlace);const d=$('#travel-dialog');document.querySelectorAll('[data-destination]').forEach(b=>b.addEventListener('click',()=>selectPlace(b.dataset.destination)));$('#map-reset').addEventListener('click',reset);document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;update()}));$('#travel-year').addEventListener('change',e=>{year=e.target.value;update()});$('#travel-search').addEventListener('input',e=>{search=e.target.value;update()});$('#memory-close').addEventListener('click',closeMemory);d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeMemory()}});d.addEventListener('cancel',e=>{e.preventDefault();closeMemory()});d.addEventListener('close',()=>{d.classList.remove('is-visible','is-closing');document.body.classList.remove('memory-open');opener?.focus({preventScroll:true})});$('#memory-prev').addEventListener('click',()=>stepMemory(-1));$('#memory-next').addEventListener('click',()=>stepMemory(1));document.addEventListener('keydown',keydown);update()}
function unmount(){atlas?.destroy();atlas=null;document.removeEventListener('keydown',keydown);modalAnimation?.cancel();modalAnimation=null;clearContentMotion();closing=false;document.body.classList.remove('memory-open')}
window.Travel={page,mount,unmount};
})();
