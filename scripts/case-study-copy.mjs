import {readFile} from 'node:fs/promises';
import {resolve,dirname,join,relative,sep} from 'node:path';

// Case-study prose is editable Markdown; media and behavior stay in their manifest.
export async function loadCaseStudyCopy(reference,manifest,directory,mediaIds,{parseDocument}){
  if(typeof reference!=='string')throw new Error(`${relative(directory,manifest)}: copy 需要文案目录路径`);
  const folder=resolve(dirname(manifest),reference);
  const allowed=[join(directory,'case-studies'),join(directory,'en/case-studies')];
  if(!allowed.some(root=>folder.startsWith(root+sep)))throw new Error(`${relative(directory,manifest)}: 文案目录请放在 content/case-studies/ 或 content/en/case-studies/`);
  const document=async(name,optional=false)=>{
    const path=join(folder,name),label=relative(directory,path);
    let source;
    try{source=await readFile(path,'utf8');}catch(error){if(optional&&error.code==='ENOENT')return null;throw new Error(`${label}: ${error.code==='ENOENT'?'缺少文案文件':error.message}`);}
    return {...parseDocument(source,label),label};
  };
  const sections=(body,depth,label)=>{
    const pattern=new RegExp('^#{'+depth+'} +(.+?)\\s*$','gm');
    const matches=[...body.matchAll(pattern)];
    if(!matches.length||body.slice(0,matches[0].index).trim())throw new Error(`${label}: 请保留 ${'#'.repeat(depth)} 标题结构`);
    return matches.map((match,index)=>({title:match[1],body:body.slice(match.index+match[0].length,matches[index+1]?.index??body.length).trim()}));
  };
  const fields=(section,keys,label)=>{
    const children=sections(section.body,3,label);
    if(children.length!==keys.length)throw new Error(`${label}:「${section.title}」需要保留 ${keys.length} 个 ### 小标题`);
    return Object.fromEntries(keys.map((key,index)=>[key,children[index].body]));
  };
  const overview=await document('overview.md');
  const sceneDocument=await document('scenes.md'),sceneMap=new Map();
  for(const section of sections(sceneDocument.body,2,sceneDocument.label)){
    const heading=/^([a-z][a-z0-9-]*)\s*\|\s*(.+)$/.exec(section.title);
    if(!heading||!mediaIds.includes(heading[1])||sceneMap.has(heading[1]))throw new Error(`${sceneDocument.label}: 场景标题使用「## 素材id | 标题」，id 需要与素材配置一致且不重复`);
    sceneMap.set(heading[1],{title:heading[2],...fields(section,['caption','alt','lens','insight'],sceneDocument.label)});
  }
  if(sceneMap.size!==mediaIds.length)throw new Error(`${sceneDocument.label}: 场景文案与媒体数量不一致`);
  const decisionDocument=await document('decisions.md');
  const decisions=sections(decisionDocument.body,2,decisionDocument.label).map(section=>({title:section.title,...fields(section,['experience','engineering','tradeoff'],decisionDocument.label)}));
  const labDocument=await document('demo.md');
  const stages=sections(labDocument.body,2,labDocument.label).map(section=>({title:section.title,...fields(section,['detail','prepared'],labDocument.label)}));
  const labeled=(title,label)=>{
    const match=/^([a-z][a-z0-9-]*)\s*\|\s*(.+)$/.exec(title);
    if(!match)throw new Error(`${label}: 标题使用「id | 标题」`);
    return {id:match[1],title:match[2]};
  };
  const required=(meta,keys,label)=>{
    for(const key of keys)if(typeof meta[key]!=='string'||!meta[key].trim())throw new Error(`${label}: ${key} 需要文字`);
  };
  let architecture,results,evidence;
  const architectureDocument=await document('architecture.md',true);
  if(architectureDocument){
    const {meta,body,label}=architectureDocument,nodeIds=new Set(),layerIds=new Set();
    required(meta,['title','lead','kicker','note','selectionLabel','defaultNode','diagramLabel'],label);
    const layers=sections(body,2,label).map(section=>{
      const layer=labeled(section.title,label);
      if(layerIds.has(layer.id))throw new Error(`${label}: 架构分层 id 重复`);
      layerIds.add(layer.id);
      return {...layer,nodes:sections(section.body,3,label).map(child=>{
        const node=labeled(child.title,label);
        if(nodeIds.has(node.id)||!child.body.trim())throw new Error(`${label}: 架构节点 id 重复或说明为空`);
        nodeIds.add(node.id);return {...node,detail:child.body};
      })};
    });
    if(!nodeIds.has(meta.defaultNode))throw new Error(`${label}: defaultNode 需要指向已有架构节点`);
    architecture={...meta,layers};
  }
  const resultDocument=await document('results.md',true);
  if(resultDocument){
    const {meta,body,label}=resultDocument;
    required(meta,['title','lead','kicker','note','beforeLabel','afterLabel','indexNote','rawNote','fpsLabel','percentLabel','indexLabel','data'],label);
    const path=resolve(folder,meta.data);
    if(!allowed.some(root=>path.startsWith(root+sep))||!path.endsWith('.json'))throw new Error(`${label}: 图表数据需要使用 case-studies/ 中的 JSON 文件`);
    let metrics;try{metrics=JSON.parse(await readFile(path,'utf8'));}catch(error){throw new Error(`${relative(directory,path)}: ${error.message}`);}
    const text=new Map();
    for(const section of sections(body,2,label)){
      const item=labeled(section.title,label);
      if(text.has(item.id))throw new Error(`${label}: 图表文案 id 重复`);
      text.set(item.id,{...item,description:section.body});
    }
    const ids=new Set();
    if(!Array.isArray(metrics)||!metrics.length)throw new Error(`${label}: 图表数据需要非空数组`);
    for(const metric of metrics){
      if(typeof metric.id!=='string'||ids.has(metric.id)||!text.has(metric.id))throw new Error(`${label}: 图表数据 id 重复或缺少对应文案`);
      if(!['fps','percent','index'].includes(metric.unit)||!['up','down'].includes(metric.direction))throw new Error(`${label}: 图表单位或改善方向无效`);
      if(!['before','after','axisMax'].every(key=>Number.isFinite(metric[key]))||metric.before<0||metric.after<0||metric.axisMax<=0||Math.max(metric.before,metric.after)>metric.axisMax)throw new Error(`${label}: 图表数值需要在有效坐标范围内`);
      if(metric.unit==='index'&&metric.before!==100)throw new Error(`${label}: 相对指标以优化前 100 为基准`);
      if(metric.unit==='percent'&&metric.axisMax>100)throw new Error(`${label}: 百分比坐标不能超过 100`);
      if((metric.direction==='up'&&metric.after<metric.before)||(metric.direction==='down'&&metric.after>metric.before))throw new Error(`${label}: 数值变化与改善方向不一致`);
      ids.add(metric.id);
    }
    if(text.size!==metrics.length)throw new Error(`${label}: 图表文案与数据数量不一致`);
    results={...meta,metrics:metrics.map(metric=>({...metric,...text.get(metric.id)}))};
  }
  const evidenceDocument=await document('evidence.md',true);
  if(evidenceDocument){
    const {meta,body,label}=evidenceDocument;
    required(meta,['kicker','title','lead','note','environmentLabel','executedLabel','recordingsLabel','durationLabel','infraLabel','modelLabel','data'],label);
    const path=resolve(folder,meta.data);
    if(!allowed.some(root=>path.startsWith(root+sep))||!path.endsWith('.json'))throw new Error(`${label}: 运行数据需要使用 case-studies/ 中的 JSON 文件`);
    let run;try{run=JSON.parse(await readFile(path,'utf8'));}catch(error){throw new Error(`${relative(directory,path)}: ${error.message}`);}
    const validDate=typeof run.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(run.date)&&!Number.isNaN(Date.parse(run.date))&&new Date(run.date).toISOString().slice(0,10)===run.date;
    if(!validDate)throw new Error(`${label}: 运行日期无效`);
    required(run,['device','os','appName','appVersion'],label);
    const counts=['durationSeconds','executed','recordings','infrastructureErrors','modelCalls'];
    if(counts.some(key=>!Number.isSafeInteger(run[key])||run[key]<0)||run.executed===0||run.durationSeconds===0||run.recordings>run.executed||run.infrastructureErrors>run.executed)throw new Error(`${label}: 运行数值或证据数量无效`);
    const ids=['passed','failed','inconclusive'];
    if(!Array.isArray(run.outcomes)||run.outcomes.length!==ids.length||run.outcomes.some((item,index)=>item.id!==ids[index]||!Number.isSafeInteger(item.count)||item.count<0)||run.outcomes.reduce((n,item)=>n+item.count,0)!==run.executed)throw new Error(`${label}: 结论数量必须与实际执行总数一致`);
    const descriptions=sections(body,2,label).map(section=>({...labeled(section.title,label),description:section.body}));
    if(descriptions.length!==ids.length||descriptions.some((item,index)=>item.id!==ids[index]||!item.description.trim()))throw new Error(`${label}: 请保留 passed、failed、inconclusive 三类结论文案`);
    evidence={...meta,run:{...run,outcomes:run.outcomes.map((item,index)=>({...item,...descriptions[index]}))}};
  }
  return {...overview.meta,intro:overview.body.trim(),scenes:mediaIds.map(id=>sceneMap.get(id)),storyTitle:decisionDocument.meta.title,storyLead:decisionDocument.meta.lead,decisions,lab:{...labDocument.meta,stages},...(architecture?{architecture}:{}),...(results?{results}:{}),...(evidence?{evidence}:{})};
}
