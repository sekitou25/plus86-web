(() => {
'use strict';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const copy=work=>work.caseStudy.copy[I18N.language==='en'?'en':'zh'];
const number=index=>String(index+1).padStart(2,'0');
const format=value=>new Intl.NumberFormat(I18N.language==='en'?'en-US':'zh-CN',{maximumFractionDigits:1}).format(value);

function architecture(work){
  const data=copy(work).architecture;if(!data)return '';
  const initial=data.layers.flatMap(layer=>layer.nodes.map(node=>({...node,layer:layer.title}))).find(node=>node.id===data.defaultNode);
  return `<section class="case-architecture" id="case-architecture" aria-labelledby="case-architecture-title"><header class="case-section-heading"><span class="case-kicker">${esc(data.kicker)}</span><h2 id="case-architecture-title" tabindex="-1">${esc(data.title)}</h2><p>${esc(data.lead)}</p></header><div class="case-architecture-layout"><div class="case-architecture-map" role="group" aria-label="${esc(data.diagramLabel)}">${data.layers.map((layer,index)=>`<div class="case-architecture-layer"><div class="case-layer-label"><span>${number(index)}</span>${esc(layer.title)}</div><div class="case-layer-nodes">${layer.nodes.map(node=>`<button type="button" data-architecture-node="${esc(node.id)}" aria-pressed="${node.id===data.defaultNode}"><span class="case-architecture-node-dot" aria-hidden="true"></span><span>${esc(node.title)}</span><span class="case-node-arrow" aria-hidden="true">↗</span></button>`).join('')}</div></div>${index<data.layers.length-1?'<div class="case-architecture-bridge" aria-hidden="true"><svg viewBox="0 0 900 32" preserveAspectRatio="none"><path d="M450 0V29M445 24L450 30L455 24"/></svg></div>':''}`).join('')}</div><aside class="case-architecture-inspect" aria-label="${esc(data.selectionLabel)}"><span class="case-kicker">${esc(data.selectionLabel)}</span><div class="case-architecture-selection" role="status"><span data-architecture-layer>${esc(initial.layer)}</span><h3 data-architecture-title>${esc(initial.title)}</h3><p data-architecture-detail>${esc(initial.detail)}</p></div></aside></div><p class="case-diagram-note">${esc(data.note)}</p></section>`;
}

function chartDetail(data,index){
  const metric=data.metrics[index];
  const unit=data[metric.unit==='fps'?'fpsLabel':metric.unit==='percent'?'percentLabel':'indexLabel'];
  const value=number=>format(number)+(metric.unit==='percent'?'%':' '+unit);
  const delta=(metric.after/metric.before-1)*100;
  const comparison=metric.unit==='index'?`${delta<0?'−':'+'}${format(Math.abs(delta))}%`:`${value(metric.before)} → ${value(metric.after)}`;
  return `<figure class="case-metric-figure"><figcaption><div><span class="case-kicker">${esc(metric.title)}</span><h3>${esc(comparison)}</h3></div><span class="case-chart-unit">${esc(unit)}</span></figcaption><div class="case-chart-plot"><div class="case-chart-ticks" aria-hidden="true"><span>0</span><span>${format(metric.axisMax/2)}</span><span>${format(metric.axisMax)}</span></div>${[['before',data.beforeLabel],['after',data.afterLabel]].map(([key,label])=>`<div class="case-chart-row"><span class="case-chart-row-label">${esc(label)}</span><div class="case-chart-track" role="meter" aria-label="${esc(metric.title+' · '+label)}" aria-valuemin="0" aria-valuemax="${metric.axisMax}" aria-valuenow="${metric[key]}" aria-valuetext="${esc(value(metric[key]))}"><div class="case-chart-bar ${key}" style="--bar-width:${metric[key]/metric.axisMax*100}%"></div></div><span class="case-chart-row-value">${esc(value(metric[key]))}</span></div>`).join('')}</div><p class="case-chart-basis">${esc(metric.unit==='index'?data.indexNote:data.rawNote)}</p><p class="case-chart-description" role="status">${esc(metric.description)}</p></figure>`;
}

function results(work){
  const data=copy(work).results;if(!data)return '';
  return `<section class="case-measured-results" id="case-measured-results" aria-labelledby="case-results-title"><header class="case-section-heading"><span class="case-kicker">${esc(data.kicker)}</span><h2 id="case-results-title" tabindex="-1">${esc(data.title)}</h2><p>${esc(data.lead)}</p></header><div class="case-metric-switch" role="group" aria-label="${esc(data.title)}">${data.metrics.map((metric,index)=>`<button type="button" data-case-metric="${index}" aria-pressed="${index===0}"><span>${number(index)}</span>${esc(metric.title)}</button>`).join('')}</div><div class="case-metric-detail">${chartDetail(data,0)}</div><p class="case-diagram-note">${esc(data.note)}</p></section>`;
}

function evidence(work){
  const data=copy(work).evidence;if(!data)return '';
  const run=data.run,first=run.outcomes[0];
  const duration=Math.floor(run.durationSeconds/60)+':'+String(run.durationSeconds%60).padStart(2,'0');
  const facts=[[data.executedLabel,run.executed],[data.recordingsLabel,run.recordings],[data.durationLabel,duration],[data.infraLabel,run.infrastructureErrors],[data.modelLabel,run.modelCalls]];
  return `<section class="qa-evidence" id="case-evidence" aria-labelledby="qa-evidence-title"><header class="case-section-heading"><span class="case-kicker">${esc(data.kicker)}</span><h2 id="qa-evidence-title" tabindex="-1">${esc(data.title)}</h2><p>${esc(data.lead)}</p></header><div class="qa-run-environment"><span>${esc(data.environmentLabel)}</span><p><time datetime="${esc(run.date)}">${esc(run.date)}</time> · ${esc(run.device)} · ${esc(run.os)} · ${esc(run.appName)} ${esc(run.appVersion)}</p></div><div class="qa-verdict-bar" role="group" aria-label="${esc(data.title)}">${run.outcomes.map((item,i)=>`<button type="button" class="qa-verdict-${esc(item.id)}" data-verdict="${esc(item.id)}" aria-pressed="${i===0}" style="--verdict-share:${item.count/run.executed*100}%" aria-label="${esc(item.title)} ${item.count}"></button>`).join('')}</div><div class="qa-verdict-legend">${run.outcomes.map((item,i)=>`<button type="button" data-verdict="${esc(item.id)}" class="qa-verdict-${esc(item.id)}" aria-pressed="${i===0}"><i aria-hidden="true"></i><span>${esc(item.title)}</span><strong>${item.count}</strong></button>`).join('')}</div><div class="qa-verdict-explanation" role="status"><h3 data-verdict-title>${esc(first.title)}</h3><p data-verdict-description>${esc(first.description)}</p></div><dl class="qa-run-facts">${facts.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p class="case-diagram-note">${esc(data.note)}</p></section>`;
}

function mount(work,root,on){
  const data=copy(work),nodes=data.architecture?.layers.flatMap(layer=>layer.nodes.map(node=>({...node,layer:layer.title})))||[];
  root.querySelectorAll('[data-architecture-node]').forEach(button=>on(button,'click',()=>{
    const node=nodes.find(node=>node.id===button.dataset.architectureNode);
    root.querySelectorAll('[data-architecture-node]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    root.querySelector('[data-architecture-title]').textContent=node.title;
    root.querySelector('[data-architecture-detail]').textContent=node.detail;
    root.querySelector('[data-architecture-layer]').textContent=node.layer;
  }));
  root.querySelectorAll('[data-verdict]').forEach(button=>on(button,'click',()=>{
    const item=data.evidence.run.outcomes.find(item=>item.id===button.dataset.verdict);
    root.querySelectorAll('[data-verdict]').forEach(node=>node.setAttribute('aria-pressed',String(node.dataset.verdict===item.id)));
    root.querySelector('[data-verdict-title]').textContent=item.title;
    root.querySelector('[data-verdict-description]').textContent=item.description;
  }));
  root.querySelectorAll('[data-case-metric]').forEach(button=>on(button,'click',()=>{
    root.querySelectorAll('[data-case-metric]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    root.querySelector('.case-metric-detail').innerHTML=chartDetail(data.results,Number(button.dataset.caseMetric));
  }));
}
window.CaseEngineering={architecture,results,evidence,mount};
})();
