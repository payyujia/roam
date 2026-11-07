/* ===== ROUTER: screens, tab bar, chrome, toast ===== */
const IDS=['trips','trip','form','map','reels','chat','thread','profile','all','pdet'],ROOT={trips:1,map:1,reels:1,chat:1,profile:1},RAW={map:1,reels:1,thread:1};
const cur=()=>S.stack[S.tab],topId=()=>cur()[cur().length-1];
const render=id=>{if(id=='profile'&&S.pd&&topId()=='pdet')render('pdet');const e=$('#s-'+id);if(!e||!V[id])return;const y=e.scrollTop,h=V[id]();e.innerHTML=RAW[id]?h:`<div class="pg">${h}</div>`;e.scrollTop=y;if(id=='map'&&typeof mapAfter=='function')mapAfter();if(id=='reels'&&typeof reelsAfter=='function')reelsAfter()};
IDS.forEach(id=>{const s=document.createElement('section');s.id='s-'+id;s.dataset.id=id;s.className='scr'+(id=='map'?' nos':id=='reels'?' rls':id=='thread'?' flex':'');$('#app').append(s)});
/* Render the visible screen only. Navigation already renders its destination;
   rebuilding every hidden page (especially the map) on each update stalls taps. */
const rr=()=>{const id=topId();if(id!=='reels')render(id);upd()};
function tabbar(){const u=unread();$('#tb').innerHTML=[['profile','Profile'],['reels','Reels','film'],['trips','Trips'],['map','Map','tab-map'],['chat','Chats','tab-chat']].map(([id,l,i])=>{const on=S.tab==id,al=`aria-label="${l}${id=='chat'&&u?`, ${u} unread`:''}"${on?' aria-current="page"':''}`;
 return id=='trips'?`<button class="ctr${on?' on':''}" data-t="trips" ${al}><span class="circ">${ic('plane',30)}</span>Trips</button>`:`<button class="${on?'on':''}" data-t="${id}" ${al}><span class="ti">${id=='profile'?Av('P','tab'):ic(i)}${id=='reels'&&S.newReel?'<i class="bdg dot"></i>':''}${id=='chat'&&u?`<i class="bdg">${u}</i>`:''}</span>${l}</button>`}).join('')}
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
  fab.textContent='Create trip!';
  fab.setAttribute('aria-label','Create trip!');
 }
}
function upd(){const st=cur(),tp=topId();$$('.scr').forEach(s=>{const id=s.dataset.id,i=st.indexOf(id);s.classList.toggle('on',id==tp);s.classList.toggle('under',i>-1&&id!=tp);s.inert=id!=tp});tabbar();chrome();sbSync();typeof reelsSync=='function'&&reelsSync()}
/* iPhone-style status bar: blurs once the visible screen has scrolled */
function sbSync(){
 const e=$('#s-'+topId());
 const nested=e?.querySelector('.msgs');
 const scrolled=!!e&&(e.scrollTop>2||(nested&&nested.scrollTop>2));
 $('#dev').classList.toggle('sbb',scrolled&&!e.classList.contains('nos')&&!e.classList.contains('rls'));
}
document.addEventListener('scroll',e=>{
 const t=e.target;
 if(t?.closest?.('.scr.on'))sbSync();
},true);
const go=id=>{render(id);const st=cur(),i=st.indexOf(id);if(i>-1)st.length=i+1;else st.push(id);upd();if(!ROOT[id])$('#s-'+id).scrollTop=0};
/* Review tasks should open without the horizontal transition exposing two screens at once. */
const goInstant=id=>{const app=$('#app');app.classList.add('nt');go(id);requestAnimationFrame(()=>requestAnimationFrame(()=>app.classList.remove('nt')))};
function tab(t){const same=S.tab==t;$('#app').classList.add('nt');if(same)S.stack[t]=[t];else{S.prev=S.tab;S.tab=t}if(t=='reels')S.newReel=0;render(t);upd();requestAnimationFrame(()=>requestAnimationFrame(()=>$('#app').classList.remove('nt')))}
function toast(message,undo,icon){
 const t=$('#toast'),canUndo=typeof undo==='function';
 t.innerHTML=`<span>${icon?ic(icon,20):''}<span>${message}</span></span>${canUndo?'<button data-a="undo">Undo</button>':''}`;
 S.undo=canUndo?undo:null;
 t.classList.add('on');
 clearTimeout(toast.h);
 toast.h=setTimeout(()=>t.classList.remove('on'),canUndo?5500:2800);
}
function pd(){S.p.dirty=1;$$('#s-pdet .sv .btn').forEach(b=>b.disabled=false)}
const bottom=()=>setTimeout(()=>{const m=$('#msgs');m&&(m.scrollTop=m.scrollHeight)},60);
const addStop=(t,p)=>{const n=t.stops.length;t.stops.push({n:p.n,t:'15:00',i:p.i,s:p.s||'Added by you',k:p.k||'Do',x:25+n*19%52,y:26+n*13%24,tr:'15 min by car',u:1,d:0,m:1});t.stops.sort((a,b)=>a.t.localeCompare(b.t))};