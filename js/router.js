/* ===== ROUTER: screens, tab bar, chrome, toast ===== */
const IDS=['trips','trip','form','map','reels','chat','thread','profile','all','pdet'],ROOT={trips:1,map:1,reels:1,chat:1,profile:1},RAW={map:1,reels:1,thread:1};
const cur=()=>S.stack[S.tab],topId=()=>cur()[cur().length-1];
const render=id=>{if(id=='profile'&&S.pd&&topId()=='pdet')render('pdet');const e=$('#s-'+id);if(!e||!V[id])return;const y=e.scrollTop,h=V[id]();e.innerHTML=RAW[id]?h:`<div class="pg">${h}</div>`;e.scrollTop=y;if(id=='map'&&typeof mapAfter=='function')mapAfter();if(id=='reels'&&typeof reelsAfter=='function')reelsAfter()};
IDS.forEach(id=>{const s=document.createElement('section');s.id='s-'+id;s.dataset.id=id;s.className='scr'+(id=='map'?' nos':id=='reels'?' rls':id=='thread'?' flex':'');$('#app').append(s)});
/* Render the visible screen only. Navigation already renders its destination;
   rebuilding every hidden page (especially the map) on each update stalls taps. */
const rr=()=>{const id=topId();if(id!=='reels')render(id);upd()};
function tabbar(){const u=unread();$('#tb').innerHTML=[['profile','Profile'],['reels','Reels','play'],['trips','Trips'],['map','Map','tab-map'],['chat','Chats','tab-chat']].map(([id,l,i])=>{const on=S.tab==id,al=`aria-label="${l}${id=='chat'&&u?`, ${u} unread`:''}"${on?' aria-current="page"':''}`;
 return id=='trips'?`<button class="ctr${on?' on':''}" data-t="trips" ${al}><span class="circ"><svg class="trip-plane" width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true"><path d="M24.413 1.85968C25.4543 2.901 24.9915 4.52082 23.9502 5.56213L18.9751 10.5373L21.4048 21.1818L19.0908 23.4959L14.4627 15.0497L9.37183 19.7934L9.71893 23.2645L7.98341 25L5.32227 19.6777L0 17.0166L1.73552 15.2811L5.20657 15.6282L9.95034 10.5373L1.50412 5.90924L3.81815 3.59521L14.4627 6.02494L19.4379 1.04977C20.4792 0.00845782 22.099 -0.454348 23.1403 0.586966L24.413 1.85968Z" fill="none" stroke="#2F8CFF" stroke-width="2" stroke-linejoin="round"/></svg></span>Trips</button>`:`<button class="${on?'on':''}" data-t="${id}" ${al}><span class="ti">${id=='profile'?Av('P','tab'):id=='map'&&on?ic('tab-map-filled',22):ic(i,22,on?'currentColor':'none')}${id=='chat'&&u?`<i class="bdg">${u}</i>`:''}</span>${l}</button>`}).join('')}
/* Share one app-level button for both actions so their clearance above the
   Trips navigation icon is identical, regardless of scroll position. */
function chrome(){
 const tp=topId(),create=(!S.nav&&S.tab=='map'&&tp=='map')||(S.tab=='trips'&&tp=='trips'),add=tp=='trip'&&S.step==1;
 const fab=$('#fab');
 $('#tb').classList.toggle('off',['form'].includes(tp));
 fab.hidden=!(create||add);
 fab.dataset.s=add?'vote':S.tab;
 fab.dataset.a=add?'addact':'newtrip';
 if(add){
  const label=downvoted(trip(S.cur))?'Suggest someplace new':'Add a new activity';
  fab.innerHTML=`${ic('plus',20)}<span>${label}</span>`;
  fab.setAttribute('aria-label',label);
 }else{
  fab.innerHTML=`${ic('plus',20)}<span>Create trip</span>`;
  fab.setAttribute('aria-label','Create trip');
 }
}
function upd(){const st=cur(),tp=topId();$$('.scr').forEach(s=>{const id=s.dataset.id,i=st.indexOf(id);s.classList.toggle('on',id==tp);s.classList.toggle('under',i>-1&&id!=tp);s.inert=id!=tp});tabbar();chrome();sbSync();typeof reelsSync=='function'&&reelsSync()}
/* iOS-style status bar: adapt foreground to the visible screen surface.
   Blue headers and full-screen reels use white glyphs; light pages use dark.
   A scrolled screen gets the existing light frosted scrim and dark glyphs. */
function sbSync(){
 const id=topId(),e=$('#s-'+id),dev=$('#dev');
 const nested=e?.querySelector('.msgs');
 const scrolled=!!e&&(e.scrollTop>2||(nested&&nested.scrollTop>2));
 const frosted=scrolled&&!e.classList.contains('nos')&&!e.classList.contains('rls');
 const blueHeader=['trips','trip','chat','profile'].includes(id);
 const whiteIcons=id==='reels'||(blueHeader&&!frosted);
 dev.classList.toggle('sbb',frosted);
 dev.classList.toggle('sb-dark-ink',!whiteIcons);
}
document.addEventListener('scroll',e=>{
 const t=e.target;
 if(t?.closest?.('.scr.on'))sbSync();
},true);
const go=id=>{render(id);const st=cur(),i=st.indexOf(id);if(i>-1)st.length=i+1;else st.push(id);upd();if(!ROOT[id])$('#s-'+id).scrollTop=0};
/* Review tasks should open without the horizontal transition exposing two screens at once. */
const goInstant=id=>{const app=$('#app');app.classList.add('nt');go(id);requestAnimationFrame(()=>requestAnimationFrame(()=>app.classList.remove('nt')))};
/* Trip details: swipe right into view from the left edge, keeping the
   originating Trips page painted underneath. Back swipes left.
   Respect reduced-motion preferences. */
const goTripSwipeRight=()=>{
 const fromId=topId();
 if(fromId==='trip'){go('trip');return}
 const parent=$('#s-'+fromId),screen=$('#s-trip');
 if(!parent||!screen){go('trip');return}
 parent.classList.add('trip-enter-parent');
 screen.classList.add('trip-enter');
 let finished=false;
 const cleanup=()=>{
  if(finished)return;
  finished=true;
  screen.removeEventListener('animationend',onEnd);
  screen.classList.remove('trip-enter');
  parent.classList.remove('trip-enter-parent');
 };
 const onEnd=e=>{if(e.target===screen)cleanup()};
 screen.addEventListener('animationend',onEnd);
 go('trip');
 if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)cleanup();
 else setTimeout(cleanup,360);
};

function tab(t){const same=S.tab==t;$('#app').classList.add('nt');if(same)S.stack[t]=[t];else{S.prev=S.tab;S.tab=t}render(t);upd();requestAnimationFrame(()=>requestAnimationFrame(()=>$('#app').classList.remove('nt')))}
/* Pick toast foreground from the actual rendered surface color.
   Alpha is composited over Roam's pale app canvas before luminance is measured. */
function syncToastContrast(t){
 const raw=getComputedStyle(t).backgroundColor.match(/[\\d.]+/g);
 if(!raw||raw.length<3)return;
 const a=raw.length>3?Number(raw[3]):1,base=[243,248,255];
 const rgb=base.map((v,i)=>Number(raw[i])*a+v*(1-a));
 const linear=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
 const luminance=.2126*linear[0]+.7152*linear[1]+.0722*linear[2];
 t.classList.toggle('toast-contrast-dark',luminance>.179);
 t.classList.toggle('toast-contrast-light',luminance<=.179);
}
function toast(message,undo,icon){
 const t=$('#toast'),canUndo=typeof undo==='function';
 t.innerHTML=`<span>${icon?ic(icon,20):''}<span>${message}</span></span>${canUndo?'<button data-a="undo">Undo</button>':''}`;
 syncToastContrast(t);
 S.undo=canUndo?undo:null;
 t.classList.add('on');
 clearTimeout(toast.h);
 toast.h=setTimeout(()=>t.classList.remove('on'),canUndo?5500:2800);
}
function pd(){S.p.dirty=1;$$('#s-pdet .sv .btn').forEach(b=>b.disabled=false)}
const bottom=()=>setTimeout(()=>{const m=$('#msgs');m&&(m.scrollTop=m.scrollHeight)},60);
const addStop=(t,p)=>{const n=t.stops.length;t.stops.push({n:p.n,t:'15:00',i:p.i,s:p.s||'Added by you',k:p.k||'Do',x:25+n*19%52,y:26+n*13%24,tr:'15 min by car',u:1,d:0,m:1});t.stops.sort((a,b)=>a.t.localeCompare(b.t))};