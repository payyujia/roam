/* ===== DATA: people, trips, places, reels, chats ===== */
const LINE=['red','green','blue','orange','yellow','lime','brown','purple','grey','teal'];
const LN={cg:'green',cy:'yellow',cp:'purple',cb:'blue',cr:'red'};
const PE={P:['P','blue','You'],R:['R','orange','Raymond'],E:['E','yellow','Eustace'],L:['L','green','Ling Ling'],J:['J','purple','Jason']};
const sp=(n,t,i,s,k,x,y,tr,u=0,d=0)=>({n,t,i,s,k,x,y,tr,u,d,m:0});
const T=[
{id:'hike',n:'MacRitchie Hike',date:D(11,1),t1:'07:00',c:'cg',i:'sun',m:'PJR',st:'confirmed',budget:'SGD 20',origin:'Caldecott MRT Station',o:[18,48],note:'Meet at the Venus Drive entrance. Bring water and a rain jacket.',stops:[sp('MacRitchie Reservoir','07:30','map-pin','Trailhead · Venus Drive','Do',30,42,'5 min walk'),sp('TreeTop Walk','09:00','sun','Suspension bridge · 35 min','Do',58,30,'35 min walk'),sp('Lornie Trail','11:00','sun','Forest trail · 40 min','Do',76,44,'40 min walk')]},
{id:'read',n:'Reading Date',date:D(11,12),t1:'14:00',c:'cr',i:'book',m:'PR',st:'confirmed',budget:'SGD 40',origin:'Your location',o:[16,46],note:'Table for two booked under Plaise.',stops:[sp('Books Actually','14:00','book','Indie bookstore · Yong Siak St','Shop',34,38,'20 min by MRT'),sp('Tiong Bahru Bakery','16:00','coffee','Café · $$','Eat',62,32,'8 min walk')]},
{id:'game',n:'Gaming Cafe',date:D(11,18),t1:'19:00',close:D(11,15),c:'cp',i:'smile',m:'PEJ',st:'draft',budget:'SGD 30',origin:'Your location',o:[16,46],note:'',stops:[sp('Arcade at Bugis+','19:00','smile','Arcade · Level 4','Do',40,36,'15 min by MRT'),sp('Burger Shot','21:00','bag','Dinner · $$','Eat',66,44,'6 min walk')]},
{id:'jb',n:'JB Daytrip',date:D(12,19),t1:'08:30',c:'cy',i:'truck',m:'PREL',st:'voting',close:D(11,9),budget:'SGD 150',origin:'Your location',o:[14,48],note:'',stops:[sp('The Loneliest Robot in Great Britain','10:00','cpu','Exhibit · 90 min','Do',34,40,'Cross the Causeway · 40 min',5,1),Object.assign(sp('Dim Sum Ting','12:00','coffee','Lunch · $$','Eat',62,34,'12 min by car',12,0),{m:1}),sp('Super Mall','13:30','bag','Mall · Air-con','Shop',72,46,'8 min walk',7,2),sp('Legoland Malaysia','15:00','box','Theme park · Iskandar Puteri','Do',46,28,'25 min by car',9,0)]},
{id:'cn',n:'China 3D2N',date:D(12,27),t1:'09:00',c:'cb',i:'globe',m:'LEJP',st:'voting',close:D(11,12),budget:'SGD 900',origin:'Your location',o:[14,48],note:'',stops:[sp('Chengdu Panda Base','09:00','smile','Wildlife · 3 hrs','Do',32,40,'Airport transfer · 45 min',6,0),sp('Jinli Ancient Street','14:00','map-pin','Street · Shopping','Shop',60,30,'25 min by metro',4,1),sp('Hotpot dinner','19:00','coffee','Dinner · $$','Eat',72,46,'15 min by taxi',8,0)]},
{id:'laz',n:'Lazarus Island',date:D(1,1,2027),t1:'09:00',close:D(12,27),c:'cg',i:'anchor',m:'LEJ',st:'draft',budget:'SGD 60',origin:'Your location',o:[16,48],note:'',stops:[sp('Marina South Pier','09:00','anchor','Ferry terminal','Do',30,42,'20 min by MRT'),sp('Lazarus Beach','10:30','sun','Beach · Picnic spot','Do',60,32,'25 min ferry')]},
{id:'nan',n:'Nando’s Night',date:D(1,9,2027),t1:'18:30',c:'cy',i:'coffee',m:'PRE',st:'confirmed',budget:'SGD 35',origin:'Your location',o:[16,46],note:'Booked for 3 at 6:30 pm.',stops:[sp('Nando’s Plaza Singapura','18:30','coffee','Dinner · $$','Eat',50,36,'12 min by MRT')]},
{id:'sun',n:'Sunrise at East Coast',date:D(10,4),t1:'05:45',c:'cy',i:'sun',m:'P',st:'done',budget:'SGD 10',origin:'Your location',o:[16,46],note:'',stops:[sp('East Coast Park','05:45','sun','Beach · Park','Do',50,36,'20 min by bus')]}];

const trip=id=>T.find(t=>t.id==id);
const TC={hike:['green','H'],read:['red','R'],game:['purple','G'],jb:['orange','J'],cn:['blue','C'],laz:['teal','L'],nan:['brown','N'],sun:['grey','S']};
T.forEach(t=>{[t.c,t.b]=TC[t.id];t.vs=Object.fromEntries([...t.m].map(k=>[k,1]));t.st=t.st=='confirmed'?'final':t.st=='draft'?'voting':t.st});
Object.assign(trip('jb').vs,{P:0,L:0});Object.assign(trip('cn').vs,{P:0,E:0,J:0});Object.assign(trip('game').vs,{P:0});
trip('jb').stops.push(sp('Clown Show','20:00','smile','Live show · 90 min','Do',30,26,'25 min by car',0,3));
[[2,1],[3,0],[2,1],[3,0]].forEach((v,i)=>{const s=trip('jb').stops[i];s.u=v[0];s.d=v[1]});trip('cn').stops.forEach((s,i)=>{s.u=[2,1,3][i];s.d=[0,1,0][i]});
/* ===== v3 DATA: real coordinates, stop attributes, prototype clock ===== */
const HOME=[1.3509,103.8485]; /* "Your location": Bishan */
const GEO={'MacRitchie Reservoir':[1.3434,103.8349],'TreeTop Walk':[1.3528,103.8198],'Lornie Trail':[1.3398,103.8302],'Books Actually':[1.2836,103.8316],'Tiong Bahru Bakery':[1.2866,103.8322],'Arcade at Bugis+':[1.2995,103.8555],'Burger Shot':[1.3012,103.8590],'The Loneliest Robot in Great Britain':[1.4605,103.7655],'Dim Sum Ting':[1.4596,103.7612],'Super Mall':[1.4640,103.7640],'Legoland Malaysia':[1.4266,103.6307],'Clown Show':[1.4587,103.7681],'Chengdu Panda Base':[30.7340,104.1450],'Jinli Ancient Street':[30.6450,104.0490],'Hotpot dinner':[30.6552,104.0817],'Marina South Pier':[1.2708,103.8628],'Lazarus Beach':[1.2234,103.8587],'Nando’s Plaza Singapura':[1.3003,103.8453],'East Coast Park':[1.3010,103.9120]};
const ORG={hike:[1.3376,103.8397],cn:[30.5785,103.9470]};
const CITY={Malacca:[2.1896,102.2501],'Johor Bahru':[1.4927,103.7414],Penang:[5.4141,100.3288],Bangkok:[13.7563,100.5018],'Kuala Lumpur':[3.139,101.6869]};
/* outdoor? intensity 0-3. Drives which stops an exigency flags. */
const ATTR={'MacRitchie Reservoir':{out:1,int:1},'TreeTop Walk':{out:1,int:2},'Lornie Trail':{out:1,int:3},'Legoland Malaysia':{out:1,int:2},'Chengdu Panda Base':{out:1,int:1},'Jinli Ancient Street':{out:1,int:1},'Marina South Pier':{out:1,int:1},'Lazarus Beach':{out:1,int:2},'East Coast Park':{out:1,int:1}};
const attr=s=>ATTR[s.n]||{out:/park|trail|beach|walk|hike|viewpoint/i.test(s.n+' '+s.s)?1:0,int:0};
/* CLOCK is defined once, in utils.js */
const hav=(a,b)=>{const r=Math.PI/180,x=Math.sin((b[0]-a[0])*r/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin((b[1]-a[1])*r/2)**2;return 12742*Math.asin(Math.sqrt(x))};
const legTxt=(a,b)=>{const k=hav(a,b);return k<1.3?`${Math.max(2,Math.round(k*1000/80))} min walk`:`${Math.max(5,Math.round(k*2.2))} min by car`};
const cityC=t=>CITY[t.dest]||HOME;
const sll=(t,s)=>s.ll||(s.ll=GEO[s.n]||(c=>[c[0]+(38-s.y)*.0009,c[1]+(s.x-50)*.0011])(cityC(t)));
const oll=t=>t.ol||(t.ol=ORG[t.id]||(t.dest?cityC(t):HOME));
const pathPts=(t,stops)=>[oll(t),...stops.map(s=>sll(t,s))];
const allPts=t=>[...pathPts(t,t.stops),...(t.fork?t.fork.stops.map(s=>sll(t,s)):[])];
/* paths (forks): a trip has a main path and at most ONE extra path */
const pn=k=>k=='P'?(S.p.name||'You'):PE[k][2];
const myPath=t=>t.fork&&t.fork.members.includes('P')?'fork':'main';
function pstops(t,p){return p=='fork'&&t.fork?t.fork.stops:baseStops(t)}
const vpath=t=>t.fork?(S.pv||myPath(t)):'main',vstops=t=>pstops(t,vpath(t));
const mainMembers=t=>[...t.m].filter(k=>!(t.fork&&t.fork.members.includes(k)));
const startAt=t=>{const[h,m]=t.t1.split(':').map(Number),d=toDate(t.date);return new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,m)};
const endAt=t=>{const ms=baseStops(t),l=ms[ms.length-1],[h,m]=(l?l.t:t.t1).split(':').map(Number),d=toDate(t.date);return new Date(d.getFullYear(),d.getMonth(),d.getDate(),h+2,m)};
const forkWin=t=>CLOCK>=new Date(startAt(t)-24*36e5)&&CLOCK<=endAt(t); /* 24h before start, and during the trip */
/* exigencies: what changed -> which stops can't be done */
const EXI=[{id:'weather',ic:'cloud-rain',n:'Inclement weather',s:'Outdoor stops get flagged',f:s=>attr(s).out},
{id:'stye',ic:'eye',n:'Eye stye',s:'Flags high-intensity outdoor stops. Calm, clean ones stay',f:s=>attr(s).out&&attr(s).int>=3,prof:'Chronic eye stye'},
{id:'unwell',ic:'activity',n:'Feeling unwell',s:'Flags anything tiring',f:s=>attr(s).int>=2},
{id:'late',ic:'clock',n:'Running late',s:'Flags the next stop on the clock',f:(s,i)=>i==Math.min(S.leg,99)}];
/* nearby alternatives are indoor, calm and clean (placeholder places) */
const ALTP=[{n:'Studio Asobi',s:'Pottery studio · Indoor',k:'Do',i:'image',sc:4.7,rv:'1.2k',pr:'$25–$45',tag:'From your saved reels',why:'Hands-on and low-key. Indoors, clean air, no glare.'},
{n:'Tea & Tales Café',s:'Café · Air-con',k:'Eat',i:'coffee',sc:4.5,rv:'860',pr:'$8–$18',tag:'Saved by Raymond',why:'Quiet corner seats and a long tea menu.'},
{n:'The Little Gallery',s:'Gallery · Free entry',k:'Do',i:'image',sc:4.4,rv:'430',pr:'Free',tag:'Popular nearby',why:'A calm, air-conditioned hour with local artists.'},
{n:'Fold Board Game Café',s:'Board games · Indoor',k:'Do',i:'smile',sc:4.6,rv:'2.1k',pr:'$12–$20',tag:'Saved by Jason',why:'Group-friendly and easy on the eyes.'}];

const POOL=[{n:'House of Gonjol',s:'Art centre · Jln Indera',i:'image',k:'Do'},{n:'Paradigm Mall',s:'Mall · Skudai',i:'bag',k:'Shop'},{n:'Mid Valley Southkey',s:'Mall · Southkey',i:'bag',k:'Shop'},{n:'Hutan Bandar Park',s:'Park · Larkin',i:'sun',k:'Do'}];
const R=[{h:'Trying shark restaurant!',n:'Shark Restaurant',by:'Bullshark Testosterone',loc:'Beqa Lagoon',c:'cp',i:'anchor',sc:'4.6',pr:'$1–$10',d:'Where sharks come to dine. Get up close with the locals.',f:1},{h:'DIY your own burger',n:'Burger Shot',by:'Moo Moo Chef',loc:'Bugis, Singapore',c:'cg',i:'bag',sc:'4.8',pr:'$10–$20',d:'From slaughter to grill, it’s all you.',f:1},{h:'Dim sum at 2am',n:'Dim Sum Ting',by:'Hungry Eustace',loc:'Jalan Wong Ah Fook, JB',c:'cy',i:'coffee',sc:'4.5',pr:'$5–$15',d:'Steamer baskets stacked to the ceiling.',f:1},{h:'City lights from the rooftop',n:'Skyline Terrace',by:'Zen Zoe',loc:'Tanjong Pagar',c:'cb',i:'sun',sc:'4.7',pr:'$15–$25',d:'Watch the skyline glow as the sun goes down.',f:0},{h:'Latte art, poured by hand',n:'Pour & Co',by:'Barista Ben',loc:'Haji Lane',c:'cr',i:'coffee',sc:'4.4',pr:'$5–$12',d:'Watch your flat white made fresh at the bar.',f:0},{h:'TreeTop Walk',n:'MacRitchie Reservoir',by:'Att Unchalisangkat',loc:'Central, Singapore',c:'cg',i:'trees',sc:'7km',pr:'Free',d:'Contemplate life on the 250m free-standing suspension bridge',f:1}];
const CH=[{n:'JB Daytrip',i:'truck',c:'cy',t:'2m',u:2,u2:'PREL',r:['Nice, noted!','Count me in','Haha agreed'],m:[['E','ok who’s driving on the 19th?'],['R','I can! Leaving at 8:30'],['P','Perfect. Voted for dim sum first btw'],['L','ngl the robot thing sounds weird. I’m in though'],['E','Voting closes 9 Nov, don’t forget!']]},{n:'China 3D2N',i:'globe',c:'cb',t:'1h',u:0,u2:'PLJ',r:['On it tonight','Sounds good!'],m:[['L','Voting is open!'],['P','On it tonight']]},{n:'MacRitchie Hike',i:'sun',c:'cg',t:'Mon',u:0,u2:'PJR',r:['See you at 7!','Bringing snacks too'],m:[['J','Meet at the MRT exit at 7am'],['P','Bringing snacks']]}];
const FR=[['Raymond','R'],['Eustace','E'],['Ling Ling','L'],['Jason','J']];

R.forEach(r=>r.c=LN[r.c]);[['R'],['E','L'],['E','J','R'],['L','R'],[],[]].forEach((s,i)=>R[i].sv=s);['jb','cn','hike'].forEach((id,i)=>CH[i].tid=id);
const SAVED=[{n:'House of Gonjol',s:'Art centre · Jln Indera',i:'image',k:'Do',by:'RLE'},{n:'Paradigm Mall',s:'Mall · Skudai',i:'bag',k:'Shop',by:'RL'},{n:'Mid Valley Southkey',s:'Mall · Southkey',i:'bag',k:'Shop',by:'E'},{n:'Hutan Bandar Park',s:'Park · Larkin',i:'sun',k:'Do',by:'RL'},{n:'Jonker Street Night Market',s:'Market · Malacca',i:'bag',k:'Eat',by:'JE'},{n:'Books Actually',s:'Bookstore · Yong Siak St',i:'book',k:'Shop',by:'R'}];
const MA={hike:[26,24],read:[74,23],game:[50,35],jb:[24,45],cn:[76,45],laz:[30,56],nan:[70,56]};
const ov=(t,p)=>{const a=MA[t.id]||[20+T.indexOf(t)*23%60,30+T.indexOf(t)*13%22];return[a[0]+(p[0]-50)*.55,a[1]+(p[1]-38)*.7]};
const newF=()=>({dest:'Malacca',start:iso(addD(NOW,14)),end:iso(addD(NOW,15)),budget:300,coll:['R','E'],auto:1});
