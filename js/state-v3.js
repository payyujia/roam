/* ===== v3 STATE + SMALL COMPONENTS ===== */
Object.assign(S,{fx:[],fr:{},fl:[],fi:0,fk:null,ap:null,alts:[],cq:'',pv:null});
Object.assign(S.p,{bio:'Always down for a hike or a hawker run.',home:'Singapore',pace:'Balanced',move:['MRT & bus'],group:4,health:['Chronic eye stye'],notif:{remind:1,vote:1,fork:1},rate:4});

const Seg=(items,cur,act,label)=>`<div class="seg" role="radiogroup" aria-label="${label}">${items.map(([k,l])=>`<button role="radio" aria-checked="${cur==k}" data-a="${act}:${k}">${l}</button>`).join('')}</div>`;
const Radio=(k,l,sub,cur,act)=>`<button class="rd" role="radio" aria-checked="${cur==k}" data-a="${act}:${encodeURIComponent(k)}"><span class="rdo"></span><span class="gr"><b>${l}</b>${sub?`<span class="cap sm">${sub}</span>`:''}</span></button>`;
const Switch=(k,l,sub,on)=>`<div class="rowx"><div><b>${l}</b><div class="cap sm">${sub}</div></div><button class="sw${on?' on':''}" role="switch" aria-checked="${!!on}" aria-label="${l}" data-a="pnotif:${k}"></button></div>`;
const hl=(s,q)=>{s=esc(s);if(!q)return s;const i=s.toLowerCase().indexOf(q.toLowerCase());return i<0?s:s.slice(0,i)+'<mark>'+s.slice(i,i+q.length)+'</mark>'+s.slice(i+q.length)};
const badgeOf=t=>{if(t.st=='voting'&&!t.vs.P){const n=needs(t);return n>0?String(n):'!'}if(t.id=='read'&&S.inv)return '!';return ''};
