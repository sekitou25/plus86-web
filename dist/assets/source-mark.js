(() => {
'use strict';
const columns=76,rows=38;
// A font-independent outline of 源: water, origin, and source code.
const strokes=[
  [[12,20],[21,27]],[[8,41],[18,48]],[[10,81],[25,61]],
  [[38,16],[89,16]],[[38,16],[37,42],[34,66],[27,88]],
  [[64,27],[59,37]],
  [[47,39],[82,39],[82,64],[47,64],[47,39]],[[47,52],[82,52]],
  [[65,65],[65,87],[62,92],[57,90]],
  [[52,75],[43,86]],[[77,75],[87,86]]
];
function distanceToStroke(x,y,stroke){
  let nearest=Infinity;
  for(let i=1;i<stroke.length;i++){
    const [ax,ay]=stroke[i-1],[bx,by]=stroke[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    nearest=Math.min(nearest,Math.hypot(x-ax-t*dx,y-ay-t*dy));
  }
  return nearest;
}
function glyph(){
  const characters='.:=+*#',points=[];
  let text='';
  for(let y=0;y<rows;y++){
    for(let x=0;x<columns;x++){
      const distance=Math.min(...strokes.map(stroke=>distanceToStroke((x+.5)/columns*100,(y+.5)/rows*100,stroke)));
      const seed=x*7+y*13;
      let char=' ';
      if(distance<3.1){
        const shade=Math.min(characters.length-1,Math.floor((1-distance/3.1)*characters.length));
        char=characters[shade];
        if(distance<1.4&&seed%7===0)char='{}[]/<>='[seed%8];
        points.push({x:(x+.5)/columns,y:(y+.5)/rows,seed});
      }
      text+=char;
    }
    // Exact text rows keep the high-DPI pointer layer aligned with the glyph.
    if(y<rows-1)text+='\n';
  }
  return {text,points};
}

function mount(root){
  const pre=root?.querySelector('#ascii-art'),canvas=root?.querySelector('canvas'),field=root?.querySelector('.source-field');
  if(!pre||!canvas||!field)return ()=>{};
  const context=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let disposed=false,visible=true,animation=0,width=0,height=0,lastTime=0,lastSpawn=-Infinity;
  let hovered=false,strength=0,offsetX=0,offsetY=0;
  const pointer={x:0,y:0},particles=[],base=glyph(),points=base.points;
  const canRun=()=>!disposed&&visible&&!document.hidden&&!reduced.matches;
  const canInteract=()=>Boolean(context)&&canRun()&&fine.matches;
  function resize(){
    width=field.clientWidth;height=field.clientHeight;
    if(!context||!width||!height)return;
    const scale=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
    context.setTransform(scale,0,0,scale,0,0);
    if(canInteract()&&hovered)requestDraw();
  }
  function stopInteraction(){
    cancelAnimationFrame(animation);animation=0;lastTime=0;
    hovered=false;strength=0;particles.length=0;offsetX=0;offsetY=0;
    field.style.transform='';context?.clearRect(0,0,width,height);
  }
  function requestDraw(){if(!animation&&canInteract())animation=requestAnimationFrame(draw)}
  function draw(time){
    animation=0;
    if(!canInteract()){stopInteraction();return}
    const elapsed=lastTime?Math.min(time-lastTime,50):16;lastTime=time;
    strength+=((hovered?1:0)-strength)*.16;
    const dx=hovered?(pointer.x/width-.5)*9:0,dy=hovered?(pointer.y/height-.5)*6:0;
    offsetX+=(dx-offsetX)*.09;offsetY+=(dy-offsetY)*.09;
    field.style.transform=`translate3d(${offsetX.toFixed(2)}px,${offsetY.toFixed(2)}px,0)`;
    context.clearRect(0,0,width,height);
    context.fillStyle='#df573f';
    if(strength>.01){
      for(const point of points){
        if(point.seed%6)continue;
        const x=point.x*width,y=point.y*height,distance=Math.hypot(x-pointer.x,y-pointer.y);
        if(distance>68)continue;
        const influence=(1-distance/68)*strength;
        context.globalAlpha=influence*.9;
        context.beginPath();context.arc(x,y,.7+influence*1.2,0,Math.PI*2);context.fill();
      }
      context.globalAlpha=strength*.9;
      context.beginPath();context.arc(pointer.x,pointer.y,2,0,Math.PI*2);context.fill();
    }
    for(let i=particles.length-1;i>=0;i--){
      const dot=particles[i];dot.life-=elapsed;
      if(dot.life<=0){particles.splice(i,1);continue}
      dot.x+=dot.vx*elapsed;dot.y+=dot.vy*elapsed;
      context.globalAlpha=dot.life/dot.duration*.65;
      context.beginPath();context.arc(dot.x,dot.y,dot.radius,0,Math.PI*2);context.fill();
    }
    context.globalAlpha=1;
    if(hovered||particles.length||strength>.01||Math.abs(offsetX)+Math.abs(offsetY)>.05)requestDraw();
    else{field.style.transform='';lastTime=0}
  }
  function move(event){
    if(event.pointerType==='touch'||!canInteract()||!width||!height)return;
    const rect=field.getBoundingClientRect();
    pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;
    hovered=pointer.x>=0&&pointer.x<=width&&pointer.y>=0&&pointer.y<=height;
    if(hovered&&event.timeStamp-lastSpawn>28){
      lastSpawn=event.timeStamp;
      const nearby=points.map(point=>({...point,distance:Math.hypot(point.x*width-pointer.x,point.y*height-pointer.y)})).filter(point=>point.distance<45).sort((a,b)=>a.distance-b.distance);
      for(const point of nearby.slice(0,3)){
        const duration=480+Math.random()*420;
        particles.push({x:point.x*width,y:point.y*height,vx:(Math.random()-.5)*.055,vy:-.008-Math.random()*.026,radius:.7+Math.random()*.7,duration,life:duration});
      }
      if(particles.length>72)particles.splice(0,particles.length-72);
    }
    requestDraw();
  }
  function leave(){hovered=false;requestDraw()}
  function sync(){
    root.dataset.interactive=String(canInteract());
    if(!canInteract())stopInteraction();
  }
  pre.textContent=base.text;resize();
  const sizeObserver=typeof ResizeObserver==='undefined'?null:new ResizeObserver(resize);sizeObserver?.observe(field);
  const visibilityObserver=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()});visibilityObserver?.observe(root);
  root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',leave);
  document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);fine.addEventListener('change',sync);
  window.addEventListener('resize',resize);sync();
  return ()=>{
    disposed=true;stopInteraction();sizeObserver?.disconnect();visibilityObserver?.disconnect();
    root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);
    document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);fine.removeEventListener('change',sync);window.removeEventListener('resize',resize);
  };
}
window.SourceMark={mount};
})();
