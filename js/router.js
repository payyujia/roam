/* ===== ROUTER: screens, tab bar, chrome, toast ===== */
const IDS=['trips','trip','form','map','reels','chat','thread','profile','all'],ROOT={trips:1,map:1,reels:1,chat:1,profile:1},RAW={map:1,reels:1,thread:1};
const cur=()=>S.stack[S.tab],topId=()=>cur()[cur().length-1];
const render=id=>{const e=$('#s-'+id);if(!e||!V[id])return;const y=e.scrollTop,h=V[id]();e.innerHTML=RAW[id]?h:`<div class="pg">${h}</div>`;e.scrollTop=y;if(id=='map'&&typeof mapAfter=='function')mapAfter();if(id=='reels'&&typeof reelsAfter=='function')reelsAfter()};
IDS.forEach(id=>{const s=document.createElement('section');s.id='s-'+id;s.dataset.id=id;s.className='scr'+(id=='map'?' nos':id=='reels'?' rls':id=='thread'?' flex':'');$('#app').append(s)});
const rr=()=>{IDS.forEach(id=>id!='reels'&&render(id));upd()};
function tabbar(){const u=unread();$('#tb').innerHTML=[['profile','Profile'],['reels','Reels','film'],['trips','Trips'],['map','Map','map'],['chat','Chats','message-circle']].map(([id,l,i])=>{const on=S.tab==id,al=`aria-label="${l}${id=='chat'&&u?`, ${u} unread`:''}"${on?' aria-current="page"':''}`;
 return id=='trips'?`<button class="ctr${on?' on':''}" data-t="trips" ${al}><span class="circ">${ic('plane',30,'currentColor')}</span>Trips</button>`:`<button class="${on?'on':''}" data-t="${id}" ${al}><span class="ti">${id=='profile'?Av('P','tab'):ic(i)}${id=='reels'&&S.newReel?'<i class="bdg dot"></i>':''}${id=='chat'&&u?`<i class="bdg">${u}</i>`:''}</span>${l}</button>`}).join('')}
function chrome(){const tp=topId(),fab=!S.nav&&((S.tab=='trips'&&tp=='trips')||(S.tab=='map'&&tp=='map')),mn=$('#mini'),ps=$('#psave'),show=S.nav&&S.tab!='map'&&tp!='thread'&&tp!='form';
 $('#tb').classList.toggle('off',['form'].includes(tp));$('#fab').hidden=!fab;ps.hidden=S.tab!='profile';ps.disabled=!S.p.dirty;ps.textContent=S.p.dirty?'Save changes':'Saved';mn.hidden=!show;
 if(show){const t=trip(S.mapTrip),ms=mstops(t),c=Math.min(S.leg,ms.length-1);mn.innerHTML=`${Bullet(t,'l')}<div class="gr"><b>${t.n}</b><div class="cap sm">Stop ${c+1} of ${ms.length} · ${ms[c].n}</div></div>${ic('chevron-right',20)}`}}
function upd(){const st=cur(),tp=topId();$$('.scr').forEach(s=>{const id=s.dataset.id,i=st.indexOf(id);s.classList.toggle('on',id==tp);s.classList.toggle('under',i>-1&&id!=tp);s.inert=id!=tp});tabbar();chrome();typeof reelsSync=='function'&&reelsSync()}
const go=id=>{render(id);const st=cur(),i=st.indexOf(id);if(i>-1)st.length=i+1;else st.push(id);upd();if(!ROOT[id])$('#s-'+id).scrollTop=0};
function tab(t){const same=S.tab==t;$('#app').classList.add('nt');if(same)S.stack[t]=[t];else{S.prev=S.tab;S.tab=t}if(t=='reels')S.newReel=0;render(t);upd();requestAnimationFrame(()=>requestAnimationFrame(()=>$('#app').classList.remove('nt')))}
function toast(m,undo){const t=$('#toast');t.innerHTML=`<span>${m}</span>${undo?'<button data-a="undo">Undo</button>':''}`;S.undo=undo||null;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),undo?5500:2800)}
function pd(){S.p.dirty=1;const b=$('#psave');if(b){b.disabled=false;b.textContent='Save changes'}}
const bottom=()=>setTimeout(()=>{const m=$('#msgs');m&&(m.scrollTop=m.scrollHeight)},60);
const addStop=(t,p)=>{const n=t.stops.length;t.stops.push({n:p.n,t:'15:00',i:p.i,s:p.s||'Added by you',k:p.k||'Do',x:25+n*19%52,y:26+n*13%24,tr:'15 min by car',u:1,d:0,m:1});t.stops.sort((a,b)=>a.t.localeCompare(b.t))};
