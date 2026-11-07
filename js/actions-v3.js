/* ===== v3 ACTIONS: fork flow, paths, chat search, profile ===== */
const flagsFor=t=>{const ms=mstops(t),fr={};ms.forEach((s,i)=>{const r=S.fx.filter(id=>EXI.find(e=>e.id==id).f(s,i,t));if(r.length)fr[i]=r});return fr};
const altsFor=(t,i)=>{const ms=mstops(t),c=sll(t,ms[i]),pv=i?sll(t,ms[i-1]):oll(t),o=[[.0062,-.0085],[-.0048,.0098],[.0088,.0071],[-.0079,-.0052]];return ALTP.map((a,j)=>{const ll=[c[0]+o[j][0]*(1+.2*(i%2)),c[1]+o[j][1]];return Object.assign({},a,{ll,leg:legTxt(pv,ll)})})};
Object.assign(A,{
 rgo:i=>{const r=R[+i];if(!r)return;S.fyp=r.f?1:0;tab('reels');const at=()=>{const f=$('#s-reels .rfeed');if(f)f.scrollTop=Math.max(0,visR().indexOf(r))*f.clientHeight};at();requestAnimationFrame(at)},
 open:id=>{S.cur=id;S.pv=null;S.step=fin(trip(id))?2:1;go('trip')},
 navigate:()=>{S.mapTrip=S.cur;S.nav=1;S.leg=0;S.mx=0;S.fk=null;tab('map')},
 mload:id=>{S.mapTrip=id;S.nav=1;S.leg=0;S.mx=0;S.fk=null;render('map');chrome()},
 endnav:()=>{S.nav=0;S.leg=0;S.fk=null;S.fl=[];render('map');chrome()},
 /* fork flow */
 forkopen:()=>{const onMap=S.nav&&S.tab=='map',t=onMap?trip(S.mapTrip):trip(S.cur);if(!forkWin(t))return toast('Alternatives open 24 hours before the trip starts');
  if(t.fork&&!t.fork.members.includes('P'))return lay('sheet',blockedHTML(t),'Paths');
  if(!(onMap&&S.mapTrip==t.id)){S.mapTrip=t.id;S.nav=1;S.leg=0;S.mx=0;S.fk=null;tab('map')}
  S.fx=[];lay('sheet',exiHTML(),'What’s changed')},
 fx:id=>{S.fx=S.fx.includes(id)?S.fx.filter(x=>x!=id):[...S.fx,id];setLy(exiHTML())},
 fapply:()=>{const t=trip(S.mapTrip),fr=flagsFor(t),fl=Object.keys(fr).map(Number);if(!fl.length)return setLy(clearHTML());
  S.fr=fr;S.fl=fl;S.fi=0;S.ap=null;S.fk='flag';A.closeLy();render('map');chrome();toast(`${ic('check',16)} ${fl.length==1?'One activity':fl.length+' activities'} affected`)},
 fagain:()=>setLy(exiHTML()),
 fsel:i=>{S.fi=Math.max(0,S.fl.indexOf(+i));render('map')},fnav:d=>{const n=S.fl.length;S.fi=(S.fi+(+d)+n)%n;render('map')},
 ffind:()=>{const t=trip(S.mapTrip);S.alts=altsFor(t,S.fl[S.fi]);S.ap=null;S.fk='alts';render('map')},
 fpick:j=>{S.ap=+j;render('map')},fback:()=>{S.fk='flag';S.ap=null;render('map')},
 fexit:()=>{S.fk=null;S.fl=[];S.ap=null;render('map')},
 finfo:()=>lay('sheet',altInfoHTML(),'Place info'),
 fconfirm:()=>{const t=trip(S.mapTrip),i=S.fl[S.fi],al=S.alts[S.ap];if(!al)return;if($('#ly').classList.contains('open'))A.closeLy();
  if(!t.fork)t.fork={owner:'P',members:['P'],stops:baseStops(t).map(s=>({...s})),ch:{}};
  const old=t.fork.stops[i];t.fork.stops[i]={n:al.n,t:old.t,i:al.i,s:al.s,k:al.k,ll:al.ll,x:old.x,y:old.y,tr:al.leg,u:0,d:0,m:0,alt:1,from:old.alt?old.from:old.n};t.fork.ch[i]=1;
  if(!t.fork.members.includes('P'))t.fork.members.push('P');
  S.fl.splice(S.fi,1);delete S.fr[i];S.ap=null;S.alts=[];
  if(S.fl.length){S.fi=Math.min(S.fi,S.fl.length-1);S.fk='flag';rr();render('map');toast(`${ic('check',16)} Swapped. ${S.fl.length} more to review`)}
  else{S.fk=null;rr();render('map');lay('sheet',doneHTML(t),'Your new path')}},
 finvite:()=>{const t=trip(S.mapTrip),c=CH.find(c=>c.tid==t.id);if(c)c.m.push(['P','',0,'fork',t.id,Date.now()]);A.closeLy();rr();toast('Path shared in the '+t.n+' chat')},
 pathpick:(w,tid)=>{const t=trip(tid||(S.nav?S.mapTrip:S.cur));if(!t||!t.fork)return;if(myPath(t)==w)return toast(`You’re already on ${w=='fork'?pn(t.fork.owner)+'’s':'the main'} path`);if($('#ly').classList.contains('open'))A.closeLy();lay('sheet',joinHTML(t,w),'Join a path')},
 pathjoin:(w,tid)=>{const t=trip(tid),fk=t.fork;if(w=='fork'){if(!fk.members.includes('P'))fk.members.push('P')}else fk.members=fk.members.filter(k=>k!='P');S.leg=0;S.pv=null;A.closeLy();rr();render('map');chrome();toast(w=='fork'?`You joined ${pn(fk.owner)}’s path`:'You’re back on the main path')},
 pview:k=>{S.pv=k;render('trip')},
 fview:tid=>{S.mapTrip=tid;S.nav=1;S.leg=0;S.mx=0;S.fk=null;tab('map')},
 /* chat */
 cq:v=>{S.cq=v;$('#clist').innerHTML=chatList();const x=$('#s-chat .x');if(x)x.hidden=!v},cqclear:()=>{S.cq='';render('chat');const i=$('#cq');i&&i.focus()},
 /* profile */

 prefSearch:q=>{if(!PROFILE_PREFERENCE_PICKERS[S.pd])return;S.prefSearch=q;const el=$('#preference-suggestions');if(el)el.innerHTML=profilePreferenceOptionsHTML(S.pd)},
 prefFirst:()=>{const k=S.pd,config=PROFILE_PREFERENCE_PICKERS[k];if(!config)return;const q=(S.prefSearch||'').trim().toLocaleLowerCase();const options=q?config.catalog.filter(x=>x.toLocaleLowerCase().includes(q)):(S.prefSuggestions||profilePreferenceSuggestions(k));const name=options.find(x=>!profilePreferenceDraft(k).includes(x));if(name)A.prefAdd(encodeURIComponent(name))},
 prefAdd:value=>{const k=S.pd,config=PROFILE_PREFERENCE_PICKERS[k],draft=S.p[k+'Draft'];if(!config||!Array.isArray(draft))return;const name=decodeURIComponent(value);if(!config.catalog.includes(name)||draft.includes(name))return;draft.push(name);S.prefSearch='';const input=$('#preference-search');if(input)input.value='';refreshProfilePreferencePicker(k)},
 prefRemove:value=>{const k=S.pd;if(!PROFILE_PREFERENCE_PICKERS[k]||!Array.isArray(S.p[k+'Draft']))return;const name=decodeURIComponent(value);S.p[k+'Draft']=S.p[k+'Draft'].filter(x=>x!==name);refreshProfilePreferencePicker(k)},
 pinterestSearch:q=>{S.interestQuery=q;const el=$('#interest-suggestions');if(el)el.innerHTML=interestOptionsHTML()},
 pinterestFirst:()=>{const q=(S.interestQuery||'').trim().toLocaleLowerCase();const options=q?INTEREST_CATALOG.filter(v=>v.toLocaleLowerCase().includes(q)):(S.interestSuggestions||nextInterestSuggestions());const name=options.find(v=>!interestDraft().includes(v));if(name)A.pinterest(encodeURIComponent(name))},
 pinterest:value=>{const name=decodeURIComponent(value);if(!Array.isArray(S.p.likesDraft)||!INTEREST_CATALOG.includes(name)||S.p.likesDraft.includes(name))return;S.p.likesDraft.push(name);S.interestQuery='';const input=$('#interest-search');if(input)input.value='';refreshInterestPicker()},
 pinterestRemove:value=>{if(!Array.isArray(S.p.likesDraft))return;const name=decodeURIComponent(value);S.p.likesDraft=S.p.likesDraft.filter(v=>v!==name);refreshInterestPicker()},
 pdietSearch:q=>{
  S.dietaryQuery=q;
  const options=$('#dietary-suggestions');
  if(options)options.innerHTML=dietaryOptionsHTML();
 },
 pdietFirst:()=>{
  const name=dietaryMatches()[0]||dietaryQuery();
  if(name)A.pdietAdd(encodeURIComponent(name));
 },
 pdietAdd:value=>{
  if(!Array.isArray(S.p.dietDraft)||!value)return;
  const entered=decodeURIComponent(value).trim().replace(/\s+/g,' ').slice(0,30);
  if(!entered)return;
  const name=dietarySuggestions.find(x=>x.toLocaleLowerCase()===entered.toLocaleLowerCase())||entered;
  if(S.p.dietDraft.some(x=>x.toLocaleLowerCase()===name.toLocaleLowerCase()))return;
  S.p.dietDraft.push(name);
  S.dietaryQuery='';
  const input=$('#dietary-search');
  if(input)input.value='';
  refreshDietaryPicker();
 },
 pdietRemove:value=>{
  if(!Array.isArray(S.p.dietDraft))return;
  const name=decodeURIComponent(value);
  S.p.dietDraft=S.p.dietDraft.filter(x=>x!==name);
  refreshDietaryPicker();
 },
 pdet:k=>{S.pd=k;S.p.dirty=0;if(k==='budget')S.p.budgetDraft=String(S.p.budget);if(k==='diet')S.p.dietDraft=[...S.p.diet];S.dietaryQuery='';if(k==='likes'){S.interestQuery='';S.p.likesDraft=[...S.p.likes];S.interestSuggestions=nextInterestSuggestions()}if(PROFILE_PREFERENCE_PICKERS[k]){S.prefSearch='';S.p[k+'Draft']=[...S.p[k]];S.prefSuggestions=profilePreferenceSuggestions(k)}go('pdet')},
 pbudgetInput:el=>{
  const digits=el.value.replace(/[^0-9]/g,'');
  if(el.value!==digits)el.value=digits;
  S.p.budgetDraft=digits;
  const amount=Number(digits);
  const valid=digits!==''&&Number.isSafeInteger(amount)&&amount>0;
  const changed=valid&&amount!==Number(S.p.budget);
  S.p.dirty=changed?1:0;
  const save=$('#s-pdet .sv .btn');
  if(save)save.disabled=!changed;
  const error=$('#budget-input-error');
  if(error)error.hidden=digits===''||valid;
  el.setAttribute('aria-invalid',String(digits!==''&&!valid));
 },
 psave:()=>{
  if(S.pd==='budget'){
   const raw=S.p.budgetDraft??'';
   const amount=Number(raw);
   if(!raw||!Number.isSafeInteger(amount)||amount<=0||amount===Number(S.p.budget))return;
   S.p.budget=amount;
   S.p.budgetDraft=null;
  }
  if(S.pd==='diet'){
   if(!Array.isArray(S.p.dietDraft)||!dietDraftChanged())return;
   S.p.diet=[...S.p.dietDraft];
   S.p.dietDraft=null;
  }
  if(S.pd==='likes'){
   if(!Array.isArray(S.p.likesDraft)||!interestDraftChanged())return;
   S.p.likes=[...S.p.likesDraft];
   S.p.likesDraft=null;
  }
  if(PROFILE_PREFERENCE_PICKERS[S.pd]){
   const k=S.pd,draft=S.p[k+'Draft'];
   if(!Array.isArray(draft)||!profilePreferenceChanged(k))return;
   S.p[k]=[...draft];
   S.p[k+'Draft']=null;
  }
  S.p.dirty=0;A.back();toast('Changes saved')
 },
 ppace:k=>{S.p.pace=k;pd();render('profile')},pmove:k=>{
  k=decodeURIComponent(k);
  if(!['Walk','MRT & bus','Car'].includes(k))return;
  const selected=Array.isArray(S.p.move)?S.p.move:[S.p.move].filter(Boolean);
  S.p.move=selected.includes(k)?selected.filter(x=>x!==k):[...selected,k];
  pd();
  render('pdet');
},pgroup:d=>{S.p.group=Math.max(1,Math.min(12,S.p.group+ +d));pd();render('profile')},
 pnotif:k=>{S.p.notif[k]=S.p.notif[k]?0:1;pd();render('profile')},prate:(id,n)=>{const t=trip(id);if(!t||!t.m.includes('P')||!PAST().some(p=>p.id===id))return;S.p.ratings={...(S.p.ratings||{}),[id]:+n};if(id==='sun')S.p.rate=+n;pd();render('pdet')}});
/* send keeps working with the new message shape */
A.send=()=>{const el=$('#cin'),v=el.value.trim();if(!v)return;const c=CH[S.th];c.m.push(['P',v,null,null,null,Date.now()]);S.typing=1;render('thread');$('#cin').focus();bottom();const th=S.th;setTimeout(()=>{const k=c.m.find(x=>x[0]!='P')[0];c.m.push([k,c.r[c.m.length%c.r.length],null,null,null,Date.now()]);if(S.th==th)S.typing=0;render('thread');bottom();tabbar()},1500)};
/* swipe in from the left edge = back (pushed screens only) */
let SW=null;
document.addEventListener('pointerdown',e=>{if(e.pointerType=='mouse'&&e.button)return;const d=$('#dev').getBoundingClientRect();if(e.clientX-d.left<24&&cur().length>1&&!$('#ly').classList.contains('open'))SW={x:e.clientX,y:e.clientY}});
document.addEventListener('pointerup',e=>{if(SW&&e.clientX-SW.x>70&&Math.abs(e.clientY-SW.y)<60)A.back();SW=null});
document.addEventListener('pointercancel',()=>SW=null);
/* All fixed-choice Profile editors stage selections locally. Back, edge swipe
   and tab changes discard unsaved drafts; Save commits before navigating back. */
const profileTagEditorActive=()=>S.pd==='likes'||S.pd==='diet'||!!PROFILE_PREFERENCE_PICKERS[S.pd];
const discardProfileTagDraft=()=>{
 S.p.likesDraft=null;S.interestQuery='';S.interestSuggestions=null;
 S.p.dietDraft=null;S.dietaryQuery='';
 for(const k of Object.keys(PROFILE_PREFERENCE_PICKERS))S.p[k+'Draft']=null;
 S.prefSearch='';S.prefSuggestions=null;S.p.dirty=0;
};
const tagEditorBack=A.back;
A.back=(...args)=>{
 if(S.tab==='profile'&&topId()==='pdet'&&profileTagEditorActive()&&cur().length>1
    &&!$('#app').classList.contains('back-pending'))discardProfileTagDraft();
 return tagEditorBack(...args);
};
const tagEditorTab=A.tab;
A.tab=t=>{
 if(S.tab==='profile'&&topId()==='pdet'&&profileTagEditorActive()){
  discardProfileTagDraft();
  S.stack.profile=['profile'];
 }
 return tagEditorTab(t);
};
