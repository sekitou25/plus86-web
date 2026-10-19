(() => {
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=(key,values)=>esc(Copy(key,values));
const project=p=>[(p.lon+180)*2.5,(85-p.lat)*2.4];
const located=p=>p&&Number.isFinite(p.lat)&&Number.isFinite(p.lon);
const duration=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?0:720;

function markup(data){
  return `<section class="travel-atlas" aria-label="${t('atlas.label')}">
    <div class="atlas-topline"><span><span class="status-dot"></span> ${t('atlas.title')}</span><span>${t('atlas.count',{countries:String(data.mapPlaces.length).padStart(2,'0'),photos:String(data.entries.length).padStart(2,'0')})}</span></div>
    <div class="atlas-navigation"><nav id="atlas-breadcrumb" aria-label="${t('atlas.navigation')}"></nav><div class="atlas-controls" role="group" aria-label="${t('atlas.zoom')}"><button type="button" id="atlas-zoom-out" aria-label="${t('atlas.zoomOut')}">−</button><button type="button" id="atlas-zoom-in" aria-label="${t('atlas.zoomIn')}">+</button></div></div>
    <svg class="travel-map atlas-interactive" id="travel-atlas-map" role="group" aria-label="${t('atlas.map')}"></svg>
    <div class="atlas-country-list" role="group" aria-label="${t('atlas.country')}">${data.mapPlaces.map(p=>`<button type="button" data-atlas-country="${p.id}" aria-pressed="false">${esc(p.name)} <span>${data.entries.filter(e=>data.places.find(d=>d.id===e.place)?.country===p.id).length}</span><span aria-hidden="true">↗</span></button>`).join('')}<span class="atlas-map-hint">${t('atlas.hint')}</span></div>
    <div class="atlas-bottomline"><span id="map-caption" role="status">${t('travel.worldCaption')}</span><button type="button" id="map-reset">${t('atlas.reset')}</button></div>
  </section>`;
}

function create(data,onSelect){
  const svg=d3.select('#travel-atlas-map'),element=svg.node();
  const geometry=window.TRAVEL_ATLAS_DATA;
  const places=new Map([...data.mapPlaces,...data.places].map(p=>[p.id,p]));
  const counts=new Map([...places.keys()].map(id=>[id,data.entries.filter(e=>e.place===id||data.places.find(p=>p.id===e.place)?.country===id).length]));
  let width=0,height=0,current='all',country=null,base=1,camera=d3.zoomIdentity,frame=0,destroyed=false;
  const defs=svg.append('defs');
  const pattern=defs.append('pattern').attr('id','atlas-country-dots').attr('width',5).attr('height',5).attr('patternUnits','userSpaceOnUse');
  pattern.append('circle').attr('cx',2.5).attr('cy',2.5).attr('r',.7).attr('fill','currentColor');
  const scene=svg.append('g').attr('class','atlas-scene');
  const overview=scene.append('image').attr('href','/assets/travel/world.svg').attr('width',900).attr('height',390).attr('aria-hidden','true');
  const context=scene.append('path').attr('class','atlas-land-context').attr('d',geometry.land).attr('aria-hidden','true');
  const shapes=scene.append('g').attr('class','atlas-country-shapes');
  geometry.countries.forEach(feature=>{
    const p=places.get(feature.id);
    if(!p)return;
    const shape=shapes.append('path').attr('d',feature.path).attr('class','atlas-country').attr('data-country',p.id).attr('fill-rule','evenodd')
      .attr('role','button').attr('tabindex',0).attr('aria-label',Copy('atlas.expandCountry',{place:p.name,count:counts.get(p.id)}));
    shape.append('title').text(Copy('atlas.photoCount',{place:p.name,count:counts.get(p.id)}));
    shape.on('click',e=>{e.stopPropagation();onSelect(p.id)}).on('keydown',e=>activate(e,p.id));
  });
  const markers=svg.append('g').attr('class','atlas-markers');
  const countryLayer=markers.append('g').attr('class','atlas-country-markers');
  const destinationLayer=markers.append('g').attr('class','atlas-destination-markers');
  const nodes=new Map();
  [...data.mapPlaces,...data.places].filter(located).forEach(p=>{
    const isCountry=data.mapPlaces.some(c=>c.id===p.id);
    const marker=(isCountry?countryLayer:destinationLayer).append('g').attr('class',`atlas-marker ${isCountry?'atlas-country-marker':'atlas-place-marker'}`)
      .attr('data-atlas-place',p.id).attr('role','button').attr('tabindex',-1).attr('aria-label',Copy('atlas.marker',{action:Copy(isCountry?'atlas.expand':'atlas.view'),place:p.name,count:counts.get(p.id)}));
    marker.append('line').attr('class','atlas-label-leader');
    marker.append('circle').attr('class','atlas-pin-hit').attr('r',15);
    marker.append('circle').attr('class','atlas-pin-ring').attr('r',8);
    marker.append('circle').attr('class','atlas-pin-dot').attr('r',3);
    const label=marker.append('g').attr('class','atlas-marker-label');
    const labelWidth=p.name.length*12+43;
    label.append('rect').attr('width',labelWidth).attr('height',28).attr('rx',3);
    label.append('text').attr('x',9).attr('y',18).text(p.name);
    label.append('text').attr('class','atlas-marker-count').attr('x',labelWidth-9).attr('y',18).attr('text-anchor','end').text(String(counts.get(p.id)).padStart(2,'0'));
    marker.on('click',e=>{e.stopPropagation();onSelect(p.id)}).on('keydown',e=>activate(e,p.id));
    nodes.set(p.id,{p,isCountry,marker,label,labelWidth});
  });
  function activate(e,id){if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();onSelect(id)}}
  const zoom=d3.zoom().clickDistance(6).tapDistance(12).extent(()=>[[0,0],[width,height]])
    .filter(e=>!e.button&&(e.type!=='wheel'||e.ctrlKey||e.metaKey))
    .on('zoom.atlas',e=>{camera=e.transform;schedule()});
  svg.call(zoom).on('dblclick.zoom',null);
  const overlap=(a,b)=>a.x<b.x+b.w+6&&a.x+a.w+6>b.x&&a.y<b.y+b.h+4&&a.y+a.h+4>b.y;
  function schedule(){if(!frame)frame=requestAnimationFrame(draw)}
  function draw(){
    frame=0;if(destroyed)return;
    scene.attr('transform',camera.toString());
    const detail=Math.min(1,Math.max(0,(camera.k/base-1)/3));
    overview.attr('opacity',1-detail*.96);
    context.attr('opacity',detail*.6);
    pattern.attr('patternTransform',`scale(${1/camera.k})`);
    const visible=[...nodes.values()].filter(n=>n.isCountry?!country:n.p.country===country);
    const positions=visible.map(n=>{const [x,y]=camera.apply(project(n.p));return {...n,x,y}});
    const occupied=[];
    positions.sort((a,b)=>(a.p.id===current?-1:b.p.id===current?1:a.y-b.y)).forEach(n=>{
      const {p,x,y,labelWidth:w}=n;
      const inside=x>=-8&&x<=width+8&&y>=-8&&y<=height+8;
      n.marker.attr('display',inside?null:'none').attr('tabindex',inside?0:-1).attr('transform',`translate(${x},${y})`).attr('aria-pressed',String(p.id===current));
      if(!inside)return;
      const left=n.isCountry&&p.label==='left';
      const candidates=left?[[-w-14,-30],[-w-14,5],[14,-14]]:[[14,-14],[-w-14,-14],[14,-45],[-w-14,17],[14,18],[-w-14,-47],[14,45],[-w-14,45],[14,-76],[-w-14,-76]];
      let best=null,bestScore=Infinity;
      for(const [dx,dy] of candidates){
        const box={x:Math.max(7,Math.min(width-w-7,x+dx)),y:Math.max(7,Math.min(height-35,y+dy)),w,h:28};
        const collisions=occupied.filter(b=>overlap(box,b)).length;
        const covers=positions.filter(o=>o.p.id!==p.id&&o.x>box.x-7&&o.x<box.x+w+7&&o.y>box.y-7&&o.y<box.y+35).length;
        const score=collisions*10000+covers*1000+Math.abs(box.x-x-dx)+Math.abs(box.y-y-dy);
        if(score<bestScore){best=box;bestScore=score}if(!score)break;
      }
      occupied.push(best);
      n.label.attr('transform',`translate(${best.x-x},${best.y-y})`);
      n.marker.select('line').attr('x1',0).attr('y1',0).attr('x2',Math.max(best.x,Math.min(best.x+w,x))-x).attr('y2',Math.max(best.y,Math.min(best.y+28,y))-y);
    });
    for(const n of nodes.values())if(!visible.includes(n))n.marker.attr('display','none').attr('tabindex',-1);
  }
  function target(){
    if(current==='all'||!located(places.get(current)))return d3.zoomIdentity.translate((width-900*base)/2,(height-390*base)/2).scale(base);
    let bounds;
    const p=places.get(current);
    if(data.mapPlaces.some(c=>c.id===current))bounds=geometry.countries.find(c=>c.id===current).bounds;
    else{const [x,y]=project(p);bounds=[[x-3.5,y-2.3],[x+3.5,y+2.3]]}
    const [[x0,y0],[x1,y1]]=bounds;
    const k=Math.min(75,(width-120)/(x1-x0),(height-76)/(y1-y0));
    return d3.zoomIdentity.translate(width/2-(x0+x1)/2*k,height/2-(y0+y1)/2*k).scale(k);
  }
  function move(animate=true){
    svg.interrupt();
    if(animate&&duration())svg.transition().duration(duration()).call(zoom.transform,target());
    else svg.call(zoom.transform,target());
  }
  function setSelection(id,animate=true){
    if(id===current&&width)return;
    current=id;
    const p=places.get(id);
    country=id==='all'||!located(p)?null:p.country||p.id;
    const c=places.get(country);
    const breadcrumb=document.querySelector('#atlas-breadcrumb');
    breadcrumb.innerHTML=`${id==='all'?`<span aria-current="location">${t('atlas.world')}</span>`:`<button type="button" data-atlas-back="all">${t('atlas.world')}</button>`}${c?`<span class="atlas-crumb-slash">/</span>${id===c.id?`<span aria-current="location">${esc(c.name)}</span>`:`<button type="button" data-atlas-back="${c.id}">${esc(c.name)}</button><span class="atlas-crumb-slash">/</span><span aria-current="location">${esc(p.name)}</span>`}`:p?`<span class="atlas-crumb-slash">/</span><span aria-current="location">${esc(p.name)}</span>`:''}`;
    breadcrumb.querySelectorAll('[data-atlas-back]').forEach(b=>b.addEventListener('click',()=>onSelect(b.dataset.atlasBack)));
    document.querySelectorAll('[data-atlas-country]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.atlasCountry===country)));
    shapes.selectAll('path').classed('is-current',function(){return this.dataset.country===country}).attr('aria-pressed',function(){return String(this.dataset.country===country)});
    element.setAttribute('aria-label',Copy('atlas.currentMap',{place:p?p.name:Copy('atlas.world')}));
    if(width)move(animate);
    schedule();
  }
  document.querySelectorAll('[data-atlas-country]').forEach(b=>b.addEventListener('click',()=>onSelect(b.dataset.atlasCountry)));
  document.querySelector('#atlas-zoom-in').addEventListener('click',()=>{svg.interrupt().transition().duration(duration()/2).call(zoom.scaleBy,1.65)});
  document.querySelector('#atlas-zoom-out').addEventListener('click',()=>{svg.interrupt().transition().duration(duration()/2).call(zoom.scaleBy,1/1.65)});
  function resize(){
    if(destroyed)return;
    const rect=element.getBoundingClientRect();
    if(rect.width===width&&rect.height===height)return;
    width=rect.width;height=rect.height;base=Math.min(width/900,height/390)*.94;
    svg.attr('viewBox',`0 0 ${width} ${height}`);
    zoom.scaleExtent([base,90]).translateExtent([[-220,-120],[1120,510]]);
    move(false);
  }
  // Initialize the breadcrumb before measuring the responsive SVG.
  setSelection('all',false);resize();
  const observer=new ResizeObserver(resize);observer.observe(element);
  return {setSelection,recenter(){move()},destroy(){destroyed=true;observer.disconnect();cancelAnimationFrame(frame);svg.interrupt().on('.zoom',null);zoom.on('zoom.atlas',null)}};
}
window.TravelAtlas={markup,create};
})();
