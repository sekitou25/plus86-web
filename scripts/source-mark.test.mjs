import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../dist/assets/source-mark.js',import.meta.url),'utf8');
class Events{
  listeners=new Map();
  addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,new Set());this.listeners.get(name).add(fn)}
  removeEventListener(name,fn){this.listeners.get(name)?.delete(fn)}
  emit(name,event={}){for(const fn of this.listeners.get(name)||[])fn(event)}
  get listenerCount(){return [...this.listeners.values()].reduce((count,list)=>count+list.size,0)}
}
function fixture({reduced=false,fine=true}={}){
  const root=new Events(),window=new Events(),document=new Events(),motion=new Events(),pointer=new Events();
  const timers=new Map(),frames=new Map(),observers=[],arcs=[];
  let id=0,time=0;
  document.hidden=false;motion.matches=reduced;pointer.matches=fine;window.devicePixelRatio=2;
  const context={setTransform(){},clearRect(){},beginPath(){},arc(...args){arcs.push(args)},fill(){}};
  const pre={textContent:''},canvas={getContext:()=>context},field={clientWidth:440,clientHeight:290,style:{},getBoundingClientRect:()=>({left:100,top:100})};
  root.dataset={};root.querySelector=selector=>({'#ascii-art':pre,canvas,'.source-field':field}[selector]);
  class Observer{constructor(callback){this.callback=callback;observers.push(this)}observe(){}disconnect(){this.disconnected=true}}
  vm.runInNewContext(source,{window,document,matchMedia:query=>query.includes('reduced')?motion:pointer,
    ResizeObserver:Observer,IntersectionObserver:Observer,
    setInterval:fn=>{timers.set(++id,fn);return id},clearInterval:key=>timers.delete(key),
    requestAnimationFrame:fn=>{frames.set(++id,fn);return id},cancelAnimationFrame:key=>frames.delete(key)});
  const destroy=window.SourceMark.mount(root);
  const step=()=>{time+=16;const pending=[...frames];frames.clear();for(const [,fn] of pending)fn(time)};
  return {root,window,document,motion,pointer,pre,canvas,field,timers,frames,observers,arcs,context,destroy,step};
}

test('the source glyph stays visible with an aligned high-DPI dot layer and no idle work',()=>{
  const f=fixture();
  const lines=f.pre.textContent.split('\n');
  assert.equal(lines.length,38);assert.ok(lines.every(line=>line.length===76));
  assert.match(f.pre.textContent,/[{}#]/);
  assert.equal(f.canvas.width,880);assert.equal(f.canvas.height,580);
  assert.equal(f.timers.size,0);assert.equal(f.frames.size,0);
  f.destroy();
});

test('mouse movement lights red points and the trail comes to rest after leaving',()=>{
  const f=fixture();
  f.root.emit('pointermove',{pointerType:'mouse',clientX:320,clientY:230,timeStamp:1000});
  f.step();
  assert.ok(f.arcs.length>1,'nearby characters and the pointer receive dots');
  assert.equal(f.context.fillStyle,'#df573f');
  assert.ok(f.arcs.some(([x,y,r])=>x===220&&y===130&&r===2));
  f.root.emit('pointerleave');
  for(let i=0;i<220&&f.frames.size;i++)f.step();
  assert.equal(f.frames.size,0,'idle trails do not retain an animation loop');
  assert.equal(f.field.style.transform,'');
  f.destroy();
});

test('reduced motion stays static and touch input never starts a mouse effect',()=>{
  for(const options of [{reduced:true},{fine:false}]){
    const f=fixture(options);
    f.root.emit('pointermove',{pointerType:'mouse',clientX:320,clientY:230,timeStamp:1000});
    assert.equal(f.frames.size,0);assert.equal(f.root.dataset.interactive,'false');
    assert.ok(f.pre.textContent.length>1000);
    if(options.reduced)assert.equal(f.timers.size,0);
    f.destroy();
  }
  const f=fixture();f.root.emit('pointermove',{pointerType:'touch',clientX:320,clientY:230,timeStamp:1000});
  assert.equal(f.frames.size,0);f.destroy();
});

test('visibility, changing motion preferences and route cleanup stop background work',()=>{
  const f=fixture();
  const activate=()=>{
    f.root.emit('pointermove',{pointerType:'mouse',clientX:320,clientY:230,timeStamp:1000});
    assert.equal(f.frames.size,1);assert.equal(f.root.dataset.interactive,'true');
  };
  activate();f.motion.matches=true;f.motion.emit('change');
  assert.equal(f.frames.size,0);assert.equal(f.root.dataset.interactive,'false');
  f.motion.matches=false;f.motion.emit('change');activate();
  f.observers[1].callback([{isIntersecting:false}]);
  assert.equal(f.frames.size,0);assert.equal(f.root.dataset.interactive,'false');
  f.observers[1].callback([{isIntersecting:true}]);activate();
  f.document.hidden=true;f.document.emit('visibilitychange');
  assert.equal(f.frames.size,0);assert.equal(f.root.dataset.interactive,'false');
  f.document.hidden=false;f.document.emit('visibilitychange');activate();
  f.destroy();
  assert.equal(f.timers.size,0);assert.equal(f.frames.size,0);
  assert.equal(f.root.listenerCount+f.window.listenerCount+f.document.listenerCount+f.motion.listenerCount+f.pointer.listenerCount,0);
  assert.ok(f.observers.every(observer=>observer.disconnected));
});
