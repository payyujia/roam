/* =========================================================
   MAP ENGINE: real raster tiles (Esri, no API key), routes + pins drawn on top.
   Set MAP_STYLE to 'light' or 'dark' for Esri Light/Dark Gray.
   ========================================================= */
const MAP_STYLE='color'; /* 'color' | 'light' | 'dark' */
const MAP_LAYERS={color:'World_Street_Map',light:'Canvas/World_Light_Gray_Base',dark:'Canvas/World_Dark_Gray_Base'};
const tileUrl=(z,x,y)=>`https://server.arcgisonline.com/ArcGIS/rest/services/${MAP_LAYERS[MAP_STYLE]}/MapServer/tile/${z}/${y}/${x}`;
const MERC=(lat,lng,z)=>{const s=256*2**z,sn=Math.sin(lat*Math.PI/180);return[(lng+180)/360*s,(.5-Math.log((1+sn)/(1-sn))/(4*Math.PI))*s]};
const UNMERC=(x,y,z)=>{const s=256*2**z,n=Math.PI-2*Math.PI*y/s;return[180/Math.PI*Math.atan(.5*(Math.exp(n)-Math.exp(-n))),x/s*360-180]};
const M={lat:1.35,lng:103.83,z:11,key:null,ok:0,raf:0,moved:false};
const TILEBOX=document.createElement('div');TILEBOX.className='mp-t';TILEBOX._t={};
const MAP_TONES=['sky','coral','amber','rose','duo'];
// Use the trip's insertion order so filtering or rescheduling cannot change its colour.
const mapTone=t=>MAP_TONES[T.indexOf(t)%MAP_TONES.length];
const forkTone=t=>mapTone(t)==='amber'?'rose':'amber';
/* Overview map only plots trips that are confirmed with a solid itinerary (voting finished); drafts stay off the map. */
const geoTrips=()=>OV().filter(t=>fin(t)&&allPts(t).every(p=>hav(p,HOME)<150));
const live=t=>dd(t.date)<=1&&fin(t);
const PIN_RIM='<svg class="pn-rim" viewBox="0 0 46 54" aria-hidden="true"><path d="M15 .6H31A14.4 14.4 0 0 1 45.4 15V31A14.4 14.4 0 0 1 31 45.4H27.3L24 51Q23 52.6 22 51L18.7 45.4H15A14.4 14.4 0 0 1 .6 31V15A14.4 14.4 0 0 1 15 .6Z"/></svg>';
const MAP_DEFS=`<defs>
 <linearGradient id="pin-rim" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" stop-color="#fff"/><stop offset="35%" stop-color="#fff" stop-opacity="0"/>
  <stop offset="65%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity=".9"/>
 </linearGradient>
 <linearGradient id="route-duo" gradientUnits="userSpaceOnUse" x2="100%" y2="100%">
  <stop class="route-coral"/><stop class="route-sky" offset="100%"/>
 </linearGradient>
 <linearGradient id="route-duo-edge" gradientUnits="userSpaceOnUse" x2="100%" y2="100%">
  <stop class="route-coral-edge"/><stop class="route-sky-edge" offset="100%"/>
 </linearGradient>
</defs>`;

/* What is on the map right now. Returns routes, pins, points to fit, and padding for the cards. */
function scene(){
 const routes=[],pins=[];
 if(!S.nav){const fit=[];
  geoTrips().forEach(t=>{
   const ms=mstops(t);
   if(!ms.length)return;
   const pp=ms.map(s=>sll(t,s)),tone=mapTone(t),alert=badgeOf(t);
   fit.push(...pp);
   routes.push({pts:pp,tone,walk:legWalk(ms).slice(1),a:'mload:'+t.id});
   pp.slice(1).forEach(ll=>pins.push({dot:1,ll,tone}));
   pins.push({ll:pp[0],tone,icon:t.i,photo:t.id==='hike'?activityPhotoSource(ms[0],t):PH[t.id],photoFallback:t.id==='hike'?activityPhotoBackup(ms[0]):'',mark:t.b,alert,a:'mload:'+t.id,
    label:t.n+(alert?', needs your attention':'')});
  });
  return{routes,pins,fit,pad:{t:120,r:46,b:180,l:46},maxZ:13}}
 const t=trip(S.mapTrip),me=myPath(t),fk=t.fork,mine=mstops(t),tone=mapTone(t),
  mp=baseStops(t).map(s=>sll(t,s)),fp=fk?fk.stops.map(s=>sll(t,s)):null,cur=me=='fork'?fp:mp,
  lv=mine.length>0&&live(t),cu=Math.min(S.leg,mine.length-1);
 if(fk){
  const mw=legWalk(baseStops(t)).slice(1),fw=legWalk(fk.stops).slice(1);
  routes.push({pts:mp,walk:mw,tone:me=='main'?tone:'inactive',muted:me!='main',a:`pathpick:main:${t.id}`});
  routes.push({pts:fp,walk:fw,tone:forkTone(t),muted:me!='fork',a:`pathpick:fork:${t.id}`});
 }else{routes.push({pts:mp,walk:legWalk(mine).slice(1),tone})}
 /* Expanded navigation follows the active leg; collapsed navigation fits
    the whole itinerary. Route geometry and pins remain unchanged. */
 const fit=[...cur],focusLeg=!!S.nav&&!S.fk&&S.pc==null&&!!S.mx&&cur.length>0;
 if(focusLeg){
  const a=Math.max(0,cu-1),b=Math.min(cur.length,Math.max(cu+1,2));
  fit.splice(0,fit.length,...cur.slice(a,b));
 }
 if(fk&&!focusLeg)(me=='fork'?mp:fp).forEach(p=>fit.push(p));
 mine.forEach((s,i)=>{if((S.fk=='flag'||S.fk=='alts')&&i!==S.fl[S.fi])return;const ll=cur[i],fr=S.fk&&S.fr[i],reel=R.findIndex(r=>r.n===s.n),
  o={ll,tone:me=='fork'?forkTone(t):tone,icon:s.i,photo:t.id==='hike'?activityPhotoSource(s,t):RP[reel],photoFallback:t.id==='hike'?activityPhotoBackup(s):'',mark:i+1,label:`Stop ${i+1}: ${s.n}`};
  if(fr){Object.assign(o,{tone:'coral',alert:'!',a:'fsel:'+i});if(S.fl[S.fi]==i)o.cls='editing sel'}
  else if(S.fk=='alts')o.cls='dim';
  else if(!S.fk){if(t.st=='voting'&&!t.vs.P&&s.m==0)o.alert='!';if(lv&&i<cu){o.mark=ic('check',14);o.tone='done'}if(lv&&i==cu)o.cls='sel';o.a='pstop:'+i;if(S.pc===i)o.cls='sel'}
  pins.push(o)});
 if(lv&&!S.fk)pins.push({lab:esc(mine[cu].n),ll:cur[cu]});
 if(fk&&!S.fk){const ch=Object.keys(fk.ch).map(Number).sort((a,b)=>a-b)[0];
  if(ch!=null)pins.push({pill:esc(pn(fk.owner)),tone:forkTone(t),ll:[(mp[ch][0]+fp[ch][0])/2,(mp[ch][1]+fp[ch][1])/2],a:`pathpick:fork:${t.id}`});
  Object.keys(fk.ch).forEach(i=>pins.push({dot:1,ll:(me=='fork'?mp:fp)[+i],tone:me=='fork'?'inactive':forkTone(t)}))}
 
 let pad={t:fk?190:140,r:50,b:400,l:50},maxZ=focusLeg?16:15;
 if(S.fk=='flag')pad.b=300;
 if(S.fk=='flag'||S.fk=='alts'){const i=S.fl[S.fi],c=cur[i],al=S.alts||[],AT=['rose','amber','sky5'];al.forEach((a,j)=>{pins.push({ll:a.ll,tone:AT[j],cls:'alt'+(S.ap===j&&S.fk=='alts'?' sel':''),icon:a.i,photo:ACTIVITY_PHOTO_BY_NAME[a.n]||null,mark:String.fromCharCode(65+j),a:'fpick:'+j,label:`Option ${String.fromCharCode(65+j)}: ${a.n}`})});
  if(S.fk=='alts'&&S.ap!=null&&al[S.ap])pins.push({lab:esc(al[S.ap].n),ll:al[S.ap].ll});
  pad=S.fk=='alts'?{t:150,r:50,b:470,l:50}:{t:150,r:50,b:290,l:50};maxZ=16;fit.length=0;fit.push(c,...al.map(a=>a.ll))}
 if(S.fk=='flag'||S.fk=='alts')routes.forEach(r=>r.faded=1);
 return{routes,pins,fit,pad,maxZ}}
const mapKey=()=>{const t=S.nav?trip(S.mapTrip):null;return[t?t.id:'ov',S.fk||'',S.fi,t&&t.fork?1:0,t?myPath(t):'',S.nav?+!!S.mx:0,S.nav?S.leg:0,S.pc==null?'':S.pc].join('|')};
/* Fit to the visible map above the navigation drawer. The drawer's final
   content-based height is used even while it animates between states. */
function mapTarget(W,H){
 const sc=scene(),pts=sc.fit,pad={...sc.pad};
 if(!pts.length||!W||!H)return null;
 const drawer=$('#msh');
 if(S.nav&&!S.fk&&S.pc==null&&drawer){
  const mapRect=$('#mp').getBoundingClientRect(),header=$('#mp .mtop2');
  const top=Math.max(120,header?Math.ceil(header.getBoundingClientRect().bottom-mapRect.top+18):120);
  const contents=$('#mc'),maxSheet=Math.max(0,Math.min(S.mx?600:400,H-150));
  const sheetHeight=Math.min(maxSheet,20+(contents?contents.scrollHeight:0));
  pad.t=top;
  /* At short viewport heights, prioritise a usable map strip. */
  pad.b=Math.min(94+sheetHeight+16,Math.max(0,H-top-88));
  pad.l=50;pad.r=50;
 }
 let z=17;
 for(;z>3;z-=.25){const Q=pts.map(p=>MERC(p[0],p[1],z)),xs=Q.map(p=>p[0]),ys=Q.map(p=>p[1]);if(Math.max(...xs)-Math.min(...xs)<=W-pad.l-pad.r&&Math.max(...ys)-Math.min(...ys)<=H-pad.t-pad.b)break}
 z=Math.min(z,sc.maxZ);const Q=pts.map(p=>MERC(p[0],p[1],z)),xs=Q.map(p=>p[0]),ys=Q.map(p=>p[1]),bx=(Math.min(...xs)+Math.max(...xs))/2,by=(Math.min(...ys)+Math.max(...ys))/2,[lat,lng]=UNMERC(bx-(pad.l-pad.r)/2,by-(pad.t-pad.b)/2,z);return{lat,lng,z}}
/* Walking legs are dotted, every other mode (drive, ride) is solid. */
const legWalk=stops=>stops.map(st=>LEG(st).ic=='walk');
/* Cubic for one leg i->i+1 using the same Catmull-Rom tangents as the full curve, so split pieces join seamlessly. */
function pathRange(P,a,b){const f=n=>n.toFixed(1),q=p=>f(p[0])+' '+f(p[1]);if(P.length==2)return pathD(P);let d=`M${q(P[a])}`;for(let i=a;i<b;i++){const p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||p2;d+=`C${f(p1[0]+(p2[0]-p0[0])/6)} ${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)} ${f(p2[1]-(p3[1]-p1[1])/6)} ${q(p2)}`}return d}
function pathD(P){if(P.length<2)return '';const f=n=>n.toFixed(1),q=p=>f(p[0])+' '+f(p[1]);
 if(P.length==2){const[a,b]=P,mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1];return `M${q(a)}Q${f(mx-dy*.16)} ${f(my+dx*.16)} ${q(b)}`}
 let d=`M${q(P[0])}`;for(let i=0;i<P.length-1;i++){const p0=P[i-1]||P[i],p1=P[i],p2=P[i+1],p3=P[i+2]||p2;d+=`C${f(p1[0]+(p2[0]-p0[0])/6)} ${f(p1[1]+(p2[1]-p0[1])/6)} ${f(p2[0]-(p3[0]-p1[0])/6)} ${f(p2[1]-(p3[1]-p1[1])/6)} ${q(p2)}`}return d}
function pinH(p,x,y){const L=`left:${x.toFixed(1)}px;top:${y.toFixed(1)}px`;
 if(p.you)return `<span class="you" style="${L}" role="img" aria-label="You are here"></span>`;
 if(p.dot)return `<span class="mdot tone-${p.tone}" style="${L}" aria-hidden="true"></span>`;
 if(p.pill)return `<button class="pb tone-${p.tone}" style="${L}" data-a="${p.a}" aria-label="${p.pill}’s path">${p.pill}</button>`;
 if(p.lab)return `<span class="pl2" style="${L}">${p.lab}</span>`;
 const g=p.a?'button':'span',badge=p.alert||p.mark;
 const photo=p.photo?(/^(?:https:\/\/|assets\/)/.test(p.photo)?`<img src="${esc(p.photo)}" alt="" loading="eager" decoding="async" onerror="photoLoadFallback(this,'${esc(p.photoFallback||'')}')">`:Pic(p.photo,p.label,96)):'';
 const accessible=p.a?`data-a="${p.a}"`:'role="img"';
 return `<${g} class="pn tone-${p.tone} ${p.cls||''}" style="${L};z-index:${Math.round(y)}" ${accessible} aria-label="${esc(p.label)}">
  <span class="pn-face" aria-hidden="true"></span>${PIN_RIM}
  <span class="pn-cover img-fallback" aria-hidden="true">${S.nav?'':ic(p.icon,18)}${photo}${p.alert?`<span class="pn-mark">${p.mark}</span>`:''}</span>
  <span class="bg${p.tone==='done'&&p.mark?' done':''}" aria-hidden="true">${badge}</span>
 </${g}>`;
}
function routeH(r,project){
 const P=r.pts.map(project),d=pathD(P);
 if(!d)return '';
 const width=r.muted?12:16,dots=` stroke-dasharray="0.1 ${width+10}"`,runs=[];
 for(let i=0;i<P.length-1;i++){const w=!!(r.walk&&r.walk[i]),L=runs[runs.length-1];if(L&&L.w==w)L.b=i+1;else runs.push({a:i,b:i+1,w})}
 const seg=(cls,sw)=>runs.map(u=>`<path class="${cls}" d="${pathRange(P,u.a,u.b)}" stroke-width="${sw}"${u.w?dots:''}/>`).join('');
 return `<g class="route tone-${r.tone}${r.faded?' faded':''}">${seg('route-edge',width)}${seg('route-main',r.muted?8:11)}</g>${r.a?`<path class="rh" d="${d}" data-a="${r.a}"/>`:''}`;
}
function mapDraw(){const h=$('#mp');if(!h)return;const W=h.clientWidth,H=h.clientHeight;if(!W||!H)return;
 const zi=Math.max(2,Math.min(18,Math.round(M.z))),sc=2**(M.z-zi),[cx,cy]=MERC(M.lat,M.lng,zi),n=2**zi,ts=256*sc,x0=Math.floor((cx-W/2/sc)/256)-1,x1=Math.floor((cx+W/2/sc)/256)+1,y0=Math.floor((cy-H/2/sc)/256)-1,y1=Math.floor((cy+H/2/sc)/256)+1,want=new Set(),C=TILEBOX._t;
 for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++){if(y<0||y>=n)continue;const k=zi+'/'+x+'/'+y;want.add(k);let im=C[k];
  if(!im){im=C[k]=new Image();im.alt='';im.draggable=false;im.onload=()=>im.classList.add('ld');im.onerror=()=>{};im.src=tileUrl(zi,((x%n)+n)%n,y);TILEBOX.appendChild(im);if(im.complete&&im.naturalWidth)im.classList.add('ld')}
  im.style.left=((x*256-cx)*sc+W/2).toFixed(2)+'px';im.style.top=((y*256-cy)*sc+H/2).toFixed(2)+'px';im.style.width=im.style.height=(ts+.6).toFixed(2)+'px'}
 for(const k in C)if(!want.has(k)){C[k].remove();delete C[k]}
 const sc2=scene(),[mx,my]=MERC(M.lat,M.lng,M.z),pr=ll=>{const q=MERC(ll[0],ll[1],M.z);return[q[0]-mx+W/2,q[1]-my+H/2]};
 $('#mpr .routes').innerHTML=sc2.routes.map(r=>routeH(r,pr)).join('');
 $('#mpp').innerHTML=sc2.pins.filter(p=>!p.lab).map(p=>{const q=pr(p.ll);return pinH(p,q[0],q[1])}).join('');
 $('#mplabel').innerHTML=sc2.pins.filter(p=>p.lab).map(p=>{const q=pr(p.ll);return pinH(p,q[0],q[1])}).join('')}
function flyTo(tg){cancelAnimationFrame(M.raf);const a={lat:M.lat,lng:M.lng,z:M.z},t0=performance.now(),ez=x=>x<.5?4*x*x*x:1-(-2*x+2)**3/2;
 const f=now=>{const k=Math.min(1,(now-t0)/700),e=ez(k);M.lat=a.lat+(tg.lat-a.lat)*e;M.lng=a.lng+(tg.lng-a.lng)*e;M.z=a.z+(tg.z-a.z)*e;mapDraw();if(k<1)M.raf=requestAnimationFrame(f)};M.raf=requestAnimationFrame(f)}
/* Manual browsing never snaps back until a new leg/state is selected or the
   user explicitly requests recenter. */
function showMapRecenter(){const b=$('#map-recenter');if(b)b.hidden=!M.moved}
function mapReframe(animate=true){
 const h=$('#mp');if(!h)return;
 const tg=mapTarget(h.clientWidth,h.clientHeight);
 if(!tg)return;
 M.key=mapKey();M.moved=false;showMapRecenter();
 const vis=$('#s-map')?.classList.contains('on');
 if(animate&&M.ok&&vis&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  flyTo(tg);
 }else{
  cancelAnimationFrame(M.raf);Object.assign(M,tg);M.ok=1;mapDraw();
 }
}
function mapAfter(){
 const h=$('#mp');if(!h)return;
 const l=$('#mpl');if(TILEBOX.parentNode!==l)l.prepend(TILEBOX);
 if(M.key!==mapKey()){mapReframe(true);return}
 showMapRecenter();mapDraw();
}
/* drag to pan, wheel to zoom */
const MD={on:0,x:0,y:0,dx:0,dy:0,moved:0,t:0};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#mp')||e.target.closest('.fcard,.msh,.mtop2,.pop,.pb,.map-recenter')||(e.pointerType=='mouse'&&e.button))return;cancelAnimationFrame(M.raf);Object.assign(MD,{on:1,x:e.clientX,y:e.clientY,dx:0,dy:0,moved:0})});
addEventListener('pointermove',e=>{if(!MD.on)return;MD.dx=e.clientX-MD.x;MD.dy=e.clientY-MD.y;if(!MD.moved&&Math.hypot(MD.dx,MD.dy)>5){MD.moved=1;$('#mp').classList.add('drag')}if(MD.moved)$('#mpl').style.transform=`translate(${MD.dx}px,${MD.dy}px)`});
addEventListener('pointerup',()=>{if(!MD.on)return;MD.on=0;if(MD.moved){const[cx,cy]=MERC(M.lat,M.lng,M.z);[M.lat,M.lng]=UNMERC(cx-MD.dx,cy-MD.dy,M.z);$('#mpl').style.transform='';$('#mp').classList.remove('drag');M.moved=true;showMapRecenter();mapDraw();MD.t=Date.now()}});
document.addEventListener('click',e=>{if(MD.moved&&Date.now()-MD.t<120){e.stopPropagation();e.preventDefault();MD.moved=0}},true);
document.addEventListener('wheel',e=>{if(!e.target.closest('#mp')||e.target.closest('.fcard,.msh,.map-recenter'))return;e.preventDefault();M.z=Math.max(3,Math.min(17,M.z-e.deltaY*.0018));M.moved=true;showMapRecenter();mapDraw()},{passive:false});

/* Keep the camera fitted when the physical viewport changes size. */
addEventListener('resize',()=>{if($('#s-map')?.classList.contains('on'))mapReframe(false)});
