const clamp = v => Math.max(0, Math.min(1, v));
const powerMean = (xs,p) => Math.pow(xs.reduce((a,x)=>a+Math.pow(x,p),0)/xs.length, 1/p);
const START = new Date(Date.UTC(2022,2,5)), NDAYS = 77;
const dayDate = i => new Date(START.getTime() + i*86400000);
function kinetics(i){
  const d = dayDate(i), m = d.getUTCMonth(), day = d.getUTCDate();
  if (m===2 && day<=9)  return {ev:3.9,  ct:0.185, leth:0.96, imm:1.36, near:1.86};
  if (m===2 && day<=15) return {ev:4.8,  ct:0.483, leth:12.9, imm:2.17, near:2.33};
  if (m<4 || (m===4 && day<=5)) return {ev:1.96, ct:0.100, leth:1.39, imm:1.35, near:1.39};
  return {ev:1.2, ct:0.08, leth:1.0, imm:1.0, near:1.0};
}
const REGIMES=[{from:0,to:8,viol:1.00,cons:0.50},{from:9,to:55,viol:0.67,cons:0.75},
 {from:56,to:63,viol:0.60,cons:0.25},{from:64,to:76,viol:0.70,cons:0.90}];
const regimeOf = i => REGIMES.find(r=>i>=r.from && i<=r.to);
/* ERA5 reanalysis daily mean temperature (°C) · Open-Meteo API · 47.10°N 37.55°E · 2022-03-05 to 2022-05-20 */
const T_ERA5=[2.1,0.1,-0.7,-0.4,-1.5,-3.1,-3.2,-4.0,-3.9,-1.3,1.8,-2.2,-4.6,-3.4,-1.2,0.5,3.6,4.0,2.9,2.6,3.0,5.1,4.8,2.1,6.3,8.0,8.5,10.9,11.9,10.1,6.0,5.1,7.8,9.7,10.2,10.6,12.1,14.7,9.7,4.3,8.9,10.6,9.0,10.0,13.3,13.0,10.2,8.7,9.3,10.5,13.8,14.8,17.3,17.1,15.4,15.6,14.3,13.5,11.8,11.3,12.4,13.8,12.4,11.7,12.8,15.5,12.3,12.9,15.8,16.4,15.7,16.7,16.6,16.4,13.0,11.2,15.6];
function interp(A,i,dflt){for(let k=0;k<A.length-1;k++){const[x0,y0]=A[k],[x1,y1]=A[k+1];
  if(i>=x0&&i<=x1)return y0+(y1-y0)*(i-x0)/(x1-x0);}return dflt;}
const tempOf=i=>(i>=0&&i<T_ERA5.length)?T_ERA5[i]:T_ERA5[T_ERA5.length-1];
const DMG_ANCH=[[0,0.02],[9,0.04],[21,0.14],[63,0.32],[76,0.33]];
const dmgOf=i=>interp(DMG_ANCH,i,0.90);
const siegeOf = i => i + 3;

function run(B,P_EXP){
  const out=[];
  for(let i=0;i<NDAYS;i++){
    const k=kinetics(i), r=regimeOf(i), T=tempOf(i), sg=siegeOf(i);
    const comps={ I: clamp(k.ev/B.bI), P: clamp((k.imm+0.5*k.near)/B.bP),
      R: (clamp(k.ct)+clamp(k.leth/B.bL)+clamp(r.viol)+clamp(r.cons))/4,
      C: clamp((B.bT-T)/(B.bT-B.bTf)), D: clamp(sg/B.bD), H: clamp(dmgOf(i)) };
    out.push({i,comps,sev:powerMean(Object.values(comps),P_EXP)});
  }
  return out;
}
const VIOL=new Set(['I','P','R']);
function summarise(label,B,P){
  const S=run(B,P); const domCount={};
  let violDays=0, firstCritical=null;
  S.forEach(d=>{
    const dom=Object.entries(d.comps).sort((a,b)=>b[1]-a[1])[0][0];
    domCount[dom]=(domCount[dom]||0)+1;
    if(VIOL.has(dom))violDays++;
    if(firstCritical===null && d.sev>=0.70) firstCritical=d.i;
  });
  const order=Object.entries(domCount).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+v).join(' ');
  return {label, violDays, dom:order,
    firstCrit: firstCritical===null?'never':dayDate(firstCritical).toISOString().slice(0,10),
    meanSev:(S.reduce((a,d)=>a+d.sev,0)/NDAYS).toFixed(3)};
}
const base={bI:10,bP:6,bL:15,bT:18,bTf:-10,bD:60};
const rows=[];
rows.push(summarise('BASELINE (bI=10, bD=60, p=6)',base,6));
// intensity normalised to observed max (4.8)
rows.push(summarise('bI=4.8 (observed max)',{...base,bI:4.8},6));
// deprivation ceilings
for(const bD of [45,60,90]) rows.push(summarise(`bD=${bD}`,{...base,bD},6));
// power-mean exponent
for(const p of [2,4,6]) rows.push(summarise(`p=${p}`,base,p));
// combined worst case for the claim
rows.push(summarise('bI=4.8 & bD=90 & p=2',{...base,bI:4.8,bD:90},2));
rows.push(summarise('bI=4.8 & bD=90 & p=6',{...base,bI:4.8,bD:90},6));
console.log('label|violence-dominant days|dominant-component counts|first Critical (>=0.70)|mean sev');
rows.forEach(r=>console.log([r.label,r.violDays+'/77',r.dom,r.firstCrit,r.meanSev].join(' | ')));

console.log('\n--- band crossings (baseline) ---');
const S=run(base,6);
[0.40,0.55,0.70].forEach(t=>{
  const d=S.find(x=>x.sev>=t);
  console.log('first sev >= '+t+': '+(d?dayDate(d.i).toISOString().slice(0,10)+' (day '+d.i+')':'never'));
});
console.log('max sev', Math.max(...S.map(d=>d.sev)).toFixed(3));
console.log('\n--- intensity component I: baseline vs observed-max ---');
console.log('bI=10  max I =', Math.max(...run(base,6).map(d=>d.comps.I)).toFixed(3));
console.log('bI=4.8 max I =', Math.max(...run({...base,bI:4.8},6).map(d=>d.comps.I)).toFixed(3));
