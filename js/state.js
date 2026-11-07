/* ===== STATE + RULES ===== */
const S={tab:'trips',prev:'trips',stack:{trips:['trips'],map:['map'],reels:['reels'],chat:['chat'],profile:['profile']},cur:'hike',step:2,seg:'up',cat:'All',mapTrip:'hike',nav:0,leg:0,mx:0,fyp:1,th:0,typing:0,inv:true,saved:{0:1,1:1},shared:{},sh:[],rs:[],q:'',undo:null,newReel:1,f:newF(),fe:{},p:{name:'Plaise',diet:['Vegetarian'],likes:['Cafes','Museums','Hikes'],access:['Step-free routes'],budget:300,dirty:0}};
const needs=t=>t.st=='voting'&&!t.vs.P?t.stops.filter(s=>s.m==0).length:0;
const pend=t=>Object.keys(t.vs).filter(k=>!t.vs[k]),fin=t=>t.st!='voting'||!pend(t).length,inItin=s=>s.u>=s.d,baseStops=t=>fin(t)?t.stops.filter(inItin):t.stops,mstops=t=>vstops(t);
const UP=()=>T.filter(t=>!t.left&&dd(t.date)>=0).sort((a,b)=>a.date-b.date),PAST=()=>T.filter(t=>!t.left&&dd(t.date)<0).sort((a,b)=>b.date-a.date),OV=()=>UP().filter(t=>t.stops.length);
const tasks=()=>[...(S.inv?['inv']:[]),...T.filter(t=>!t.left&&t.st=='voting'&&!t.vs.P).map(t=>t.id)];
const taskDue=id=>id=='inv'?1e15:trip(id).close?+toDate(trip(id).close):1e15,tasksByDue=()=>tasks().map((id,i)=>[id,i]).sort((a,b)=>taskDue(a[0])-taskDue(b[0])||a[1]-b[1]).map(x=>x[0]);
const unread=()=>CH.reduce((a,c)=>a+c.u,0),downvoted=t=>t.stops.some(s=>s.m==-1);
const SVL=()=>{const x=[...SAVED];R.forEach((r,i)=>{if(S.saved[i]&&!x.some(y=>y.n==r.n))x.push({n:r.n,s:r.loc,i:r.i,k:'Eat',by:'P'})});return x};
const byTxt=(by='P')=>{const n=[...by].map(k=>k=='P'?'you':PE[k]?PE[k][2]:k);return 'Saved by '+(n.length>2?n.slice(0,2).join(', ')+` +${n.length-2}`:n.join(' & '))};
const recs=d=>[[`${d} Old Town`,'10:00','map-pin','Sightseeing · 2 hrs','Do','20 min by car'],['Heritage museum','11:30','image','Museum · 1 hr','Do','10 min walk'],['Local lunch spot','13:00','coffee','Lunch · $$','Eat','8 min walk'],['Riverside café','15:00','coffee','Café · $','Eat','12 min walk'],['Sunset viewpoint','17:30','sun','Scenic · Free','Do','15 min by taxi'],['Night market','19:00','bag','Street food · $','Eat','10 min by taxi']].map((r,j)=>sp(r[0],r[1],r[2],r[3],r[4],25+j*19%52,26+j*13%24,r[5]));
