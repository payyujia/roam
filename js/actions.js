/* ===== ACTIONS (data-a="name:arg" dispatch) + global listeners ===== */
const A={tadd:(k,el)=>{const inp=el.closest('.tin').querySelector('input');let v=inp.value.trim();if(!v)return;v=v[0].toUpperCase()+v.slice(1);
 if(k=='coll'){const f=FR.find(x=>x[0].toLowerCase()==v.toLowerCase());if(!f)return toast(`No friend named ${esc(v)}`);if(!S.f.coll.includes(f[1]))S.f.coll.push(f[1]);render('form')}
 else{const a=S.p[k];if(!a.some(x=>x.toLowerCase()==v.toLowerCase()))a.push(v);pd();render('profile')}
 setTimeout(()=>{const n=$('#s-'+(k=='coll'?'form':'pdet')+' [list=dl-'+k+']');n&&n.focus()},30)},
 trm:(k,v)=>{v=decodeURIComponent(v);if(k=='coll'){const f=FR.find(x=>x[0]==v);S.f.coll=S.f.coll.filter(x=>x!=f[1]);render('form')}else{S.p[k]=S.p[k].filter(x=>x!=v);pd();render('profile')}},
 activity:i=>{const t=trip(S.cur);if(!t||!t.stops[+i])return;lay('sheet',activityHTML(+i),'Activity details')},
 info:gi=>{S.ci=+gi;lay('sheet',infoHTML(+gi),'Place info')},cmpick:()=>setLy(pickHTML(S.ci)),cmpto:j=>setLy(cmpHTML(S.ci,+j)),cmpback:()=>setLy(infoHTML(S.ci)),tab,toast,back:()=>{const s=cur();if(s.length>1){s.pop();if(S.tab=='profile')render('profile');upd()}},
 open:id=>{S.cur=id;S.step=fin(trip(id))?2:1;go('trip')},votefor:id=>{S.cur=id;S.step=1;goInstant('trip')},step:i=>{S.step=+i;render('trip')},cat:k=>{S.cat=k;render('trip')},seg:k=>{S.seg=k;render('trips')},viewall:k=>{S.all=k;go('all')},
 vt:(i,d)=>{const v=trip(S.cur).stops[i];d=+d;if(v.m==d){d==1?v.u--:v.d--;v.m=0}else{v.m==1&&v.u--;v.m==-1&&v.d--;d==1?v.u++:v.d++;v.m=d}rr()},
 submit:()=>{const t=trip(S.cur);if(!t||t.vs.P)return;const missing=t.stops.filter(s=>s.m===0).length;if(!t.stops.length||missing){toast(missing?`Vote on ${missing} more activit${missing==1?'y':'ies'} before submitting`:'Add activities before submitting');return}const id=t.id;t.vs.P=1;rr();toast('Votes submitted');pend(t).forEach((k,j)=>setTimeout(()=>{t.vs[k]=1;if(!pend(t).length){t.st='final';toast('Everyone’s voted. Your itinerary is ready.');if(S.cur==id&&topId()=='trip')S.step=2}rr()},1700*(j+1)))},
 nudge:()=>toast('Nudge sent to '+pend(trip(S.cur)).filter(k=>k!='P').map(k=>PE[k][2]).join(' & ')),
 addact:()=>{S.q='';lay('sheet',addHTML(),downvoted(trip(S.cur))?'Suggest someplace new':'Add a new activity');setTimeout(()=>{const q=$('#aq');q&&q.focus()},420)},qs:v=>{S.q=v;$('#res').innerHTML=resHTML()},
 addp:i=>{const p=SVL()[i],t=trip(S.cur);if(!p)return;addStop(t,p);A.closeLy();rr();toast(`${p.n} added to the vote list`)},
 navigate:()=>{S.mapTrip=S.cur;S.nav=1;S.leg=0;S.mx=0;tab('map')},mload:id=>{S.mapTrip=id;S.nav=1;S.leg=0;S.mx=0;render('map');chrome()},endnav:()=>{S.nav=0;S.leg=0;render('map');chrome()},
 leg:i=>{S.leg=+i;render('map');chrome()},next:()=>{const t=trip(S.mapTrip),n=mstops(t).length;if(S.leg<n-1)S.leg++;else{S.nav=0;S.leg=0;toast(`You finished ${t.n}. Nice one!`)}render('map');chrome()},
 opentrip:()=>{const id=S.mapTrip;S.nav=0;render('map');tab('trips');A.open(id)},mvote:()=>{const id=S.mapTrip;S.nav=0;render('map');tab('trips');A.votefor(id)},toggleMx:()=>{S.mx=!S.mx;$('#msh').classList.toggle('x',S.mx)},
 menu:()=>lay('menu',menuHTML(),'Trip options'),closeLy:()=>{$('#ly').classList.remove('open');$('#app').inert=$('#tb').inert=$('#fab').inert=$('#psave').inert=false;lastF&&lastF.focus&&lastF.focus()},
 mshare:()=>{S.sh=[];lay('sheet',shareHTML(),'Share trip')},mresch:()=>{S.rs=[];lay('sheet',reschHTML(),'Reschedule trip')},mleave:()=>lay('dlg',leaveHTML(),'Leave trip'),
 shsel:k=>{S.sh=S.sh.includes(k)?S.sh.filter(x=>x!=k):[...S.sh,k];setLy(shareHTML())},shsend:()=>{A.closeLy();toast(`Invite sent to ${S.sh.length} friend${S.sh.length>1?'s':''}`)},copylink:()=>{try{navigator.clipboard.writeText('https://roam.app/t/'+S.cur)}catch(e){}toast('Link copied')},
 rsel:d=>{S.rs=S.rs.includes(d)?S.rs.filter(x=>x!=d):[...S.rs,d];setLy(reschHTML())},rsend:()=>{A.closeLy();toast(`Reschedule poll sent to ${trip(S.cur).m.length-1} members`)},
 leave:()=>{const t=trip(S.cur);t.left=true;A.closeLy();cur().length>1&&cur().pop();rr();toast(`You left ${t.n}`,()=>{t.left=false;rr()})},
 inv:v=>{S.inv=false;const t=trip('read'),old=t.date;if(v=='y')t.date=REQ;rr();toast(v=='y'?`${t.n} moved to ${fd(REQ)}`:'Reschedule request declined',()=>{S.inv=true;t.date=old;rr()})},
 newtrip:()=>{S.f=newF();S.fe={};if(S.tab=='map'){$('#dev').classList.add('instant');go('form');requestAnimationFrame(()=>requestAnimationFrame(()=>$('#dev').classList.remove('instant')))}else go('form')},
 fcol:(k,el)=>{const c=S.f.coll||[];S.f.coll=c.includes(k)?c.filter(x=>x!=k):[...c,k];el.classList.toggle('on');el.setAttribute('aria-pressed',S.f.coll.includes(k))},fsw:el=>{S.f.auto=S.f.auto?0:1;el.classList.toggle('on');el.setAttribute('aria-checked',!!S.f.auto)},
 formnext:()=>{const f=S.f,e={};if(!f.dest.trim())e.dest='Add a destination';const s=f.start&&p8(f.start),en=f.end&&p8(f.end);if(!s)e.start='Pick a start date';else if(dd(s)<0)e.start='Can’t be in the past';if(s&&en&&en<s)e.end='Must be after the start';if(!(+f.budget>0))e.budget='Enter a budget above 0';
  S.fe=e;if(Object.keys(e).length){render('form');return}
  const days=Math.round(((en||s)-s)/864e5)+1,d=f.dest.trim(),id='n'+T.length,m='P'+(f.coll||[]).join(''),c=LINE[(T.length+3)%LINE.length];
  T.push({id,dest:esc(d),n:days==1?`${esc(d)} Daytrip`:`${esc(d)} ${days}D${days-1}N`,date:s,t1:'08:30',c,b:esc(d[0].toUpperCase()),i:'map-pin',m,vs:Object.fromEntries([...m].map(k=>[k,0])),st:'voting',close:addD(NOW,7),budget:`SGD ${f.budget}`,origin:'Your location',o:[16,48],note:'',stops:f.auto?recs(d):[]});
  cur().pop();S.cur=id;S.step=1;S.seg='up';tab('trips');rr();go('trip');toast('Trip created. Invites sent.')},
 feed:k=>{S.fyp=+k;render('reels')},rsave:gi=>{S.saved[gi]=!S.saved[gi];render('reels');toast(S.saved[gi]?'Saved to your places':'Removed from saved')},
 addto:gi=>lay('sheet',tripPick(+gi),'Add to trip'),addtrip:(gi,id)=>{const t=trip(id),r=R[+gi];if(t.stops.some(s=>s.n==r.n)){A.closeLy();return toast(`${r.n} is already in ${t.n}`)}addStop(t,{n:r.n,i:r.i,s:r.loc,k:'Eat'});A.closeLy();rr();toast(`Added to ${t.n}'s vote list`)},
 thread:i=>{S.th=+i;CH[i].u=0;S.typing=0;go('thread');bottom()},
 send:()=>{const el=$('#cin'),v=el.value.trim();if(!v)return;const c=CH[S.th];c.m.push(['P',v]);S.typing=1;render('thread');$('#cin').focus();bottom();const th=S.th;setTimeout(()=>{const k=c.m.find(x=>x[0]!='P')[0];c.m.push([k,c.r[c.m.length%c.r.length]]);if(S.th==th)S.typing=0;render('thread');bottom()},1500)},
 ptag:(k,x,el)=>{const a=S.p[k];S.p[k]=a.includes(x)?a.filter(y=>y!=x):[...a,x];el.classList.toggle('on');el.setAttribute('aria-pressed',S.p[k].includes(x));pd()},
 psave:()=>{S.p.dirty=0;render('profile');chrome();toast('Profile saved')},undo:()=>{S.undo&&S.undo();S.undo=null;$('#toast').classList.remove('on')}};
document.addEventListener('click',e=>{const t=e.target,tb=t.closest('[data-t]');if(tb)return A.tab(tb.dataset.t);const b=t.closest('[data-a]');if(b&&!b.disabled){const[f,...a]=b.dataset.a.split(':');Object.prototype.hasOwnProperty.call(A,f)&&A[f](...a,b)}});
document.addEventListener('keydown',e=>{if(e.key=='Escape'&&$('#ly').classList.contains('open'))return A.closeLy();if((e.key=='Enter'||e.key==' ')&&e.target.matches('[role=button][data-a]')){e.preventDefault();e.target.click()}});
document.addEventListener('pointerdown',e=>{const g=e.target.closest('.grab');if(!g)return;const s=g.parentNode,y0=e.clientY;let dy=0;const mv=v=>dy=v.clientY-y0,up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);if(s.id=='msh'){if(Math.abs(dy)>6){S.mx=dy<0;s.classList.toggle('x',S.mx);g.dataset.dragged=1;setTimeout(()=>delete g.dataset.dragged,50)}}else if(dy>80)A.closeLy()};addEventListener('pointermove',mv);addEventListener('pointerup',up)});
document.addEventListener('click',e=>{const g=e.target.closest('#msh .grab');if(g&&g.dataset.dragged)e.stopImmediatePropagation()},true);
