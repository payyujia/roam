/* ===== VIEWS ===== */
const V={};
const TOP=3,ViewAll=(n,k)=>n>TOP?`<button data-a="viewall:${k}">View all</button>`:'';
const TaskRow=id=>{if(id=='inv')return InviteRow();const t=trip(id),n=needs(t);return Row({a:'votefor:'+t.id,lead:Cover(t,'xs'),title:`Vote on ${t.n}`,sub:`${n?n+' stop'+(n==1?'':'s')+' to review':'Submit your votes'}${t.close?` · closes ${fd(t.close)}`:''}`,trail:ic('chevron-right',20)})};
V.trips=()=>{const up=UP(),tk=tasksByDue(),L=S.seg=='up'?up:PAST(),nx=up[0];return `<div class="hd"><h1>${greet()}, ${esc(S.p.name.trim()||'there')}</h1></div>
${nx?Sec('Up next')+`<button class="feat l-${nx.c}" data-a="open:${nx.id}">${Cover(nx,'l')}<div class="gr"><div class="eyebrow">${rel(nx.date)}</div><h2>${nx.n}</h2><div class="cap">${fd(nx.date)} · ${nx.stops.length} stops</div><div class="mt">${Stack(nx.m)}</div></div></button>`:''}
${Sec('Your trips',ViewAll(L.length,S.seg))}<div class="pills">${Pill('Upcoming','seg:up',S.seg=='up')}${Pill('Past','seg:past',S.seg=='past')}</div><div style="margin-top:8px">${L.length?L.slice(0,TOP).map(TripRow).join(''):Empty(S.seg=='up'?'No upcoming trips':'No past trips','Tap Create trip! to start one.')}</div>
${Sec('Tasks'+(tk.length?` · ${tk.length}`:''),ViewAll(tk.length,'tasks'))}${tk.length?tk.slice(0,TOP).map(TaskRow).join(''):Empty('You’re all caught up','Nothing needs your attention.')}`};
V.all=()=>{const k=S.all,tk=k=='tasks',L=tk?tasksByDue():k=='up'?UP():PAST(),ttl=tk?'Tasks':k=='up'?'Upcoming trips':'Past trips';return `${Top(IBtn('arrow-left','back','Back'),ttl)}<div class="pad" style="margin-top:12px">${L.length?L.map(tk?TaskRow:TripRow).join(''):Empty(tk?'You’re all caught up':k=='up'?'No upcoming trips':'No past trips',tk?'Nothing needs your attention.':'Tap Create trip! to start one.')}</div>`};
/* Use the same required fields as formnext so the sticky CTA reflects validity
   without re-rendering (or stealing focus from) the text inputs. End is optional. */
const canAdvanceNewTrip=()=>{
 const f=S.f,s=f.start&&p8(f.start),end=f.end&&p8(f.end);
 return !!(typeof f.dest==='string'&&f.dest.trim()
   &&s&&dd(s)>=0
   &&(!f.end||(end&&end>=s))
   &&Number(f.budget)>0);
};
V.form=()=>{const f=S.f,e=S.fe,er=k=>e[k]?`<div class="err sm" id="f-err-${k}" role="alert">${e[k]}</div>`:'';
const field=(k,input,icon='')=>`<div class="fld${e[k]?' bad':''}">${icon?ic(icon,17):''}${input}</div>${er(k)}`;
const invalid=k=>e[k]?` aria-invalid="true" aria-describedby="f-err-${k}"`:'';
return `<div class="top">${IBtn('x','back','Close')}<h3 class="tt">New trip</h3><span></span></div>${Stepper(null,0,false)}
<div class="pad" style="display:flex;flex-direction:column;gap:20px;margin-top:20px"><div class="new-trip-core-fields"><div><label class="lb" for="f-d">Destination</label>${field('dest',`<input class="in" id="f-d" value="${esc(f.dest||'')}" placeholder="Search a country or city" oninput="S.f.dest=this.value;A.refreshFormNext()" autocomplete="off"${invalid('dest')}>`,'map-pin')}</div>
<div class="form-date-picker"><div class="form-dates">${DateField('start','Start',f.start,er('start'),invalid('start'))}${DateField('end','End',f.end,er('end'),invalid('end'))}</div>${S.cal?Calendar(S.cal):''}</div>
<div><label class="lb" for="f-b">Budget per person (SGD)</label>${field('budget',`<input class="in" id="f-b" inputmode="numeric" value="${f.budget||''}" oninput="S.f.budget=this.value.replace(/\\D/g,'');A.refreshFormNext()"${invalid('budget')}>`)}</div>
<div><span class="lb">Invite friends</span>${FriendInvitePicker()}</div></div>
<div class="form-collections-field"><span class="lb">Reel collections to include <span class="opt">(optional)</span></span><button type="button" class="glass set-row form-collections-trigger" data-a="formColOpen" aria-haspopup="dialog" aria-label="Choose reel collections, ${(f.cols||[]).filter(id=>S.col.some(c=>c.id===id)).length} selected"><span class="sic">${ic('bookmark',18)}</span><span class="gr"><b class="stt">Choose collections</b><span class="cap sm">${(f.cols||[]).filter(id=>S.col.some(c=>c.id===id)).length} collection${(f.cols||[]).filter(id=>S.col.some(c=>c.id===id)).length===1?'':'s'} selected</span></span>${ic('chevron-right',20)}</button></div>
<div class="new-trip-recommend-activities" style="display:flex;justify-content:space-between;align-items:center;gap:16px"><div><b class="lb" style="margin:0">Recommend activities</b><div class="cap sm">Get activity suggestions based on everyone’s travel preferences.</div></div><button class="sw ${f.auto?'on':''}" role="switch" aria-checked="${!!f.auto}" aria-label="Recommend activities" data-a="fsw"></button></div></div>
<div class="dock low">${Btn('Next: vote on activities','formnext',{off:!canAdvanceNewTrip()})}</div>`};
V.trip=()=>{const t=trip(S.cur);if(!t)return '';const lk=!fin(t),n=needs(t),ms=mstops(t),go=!lk&&dd(t.date)>=0&&ms.length,pn=pend(t).filter(k=>k!='P').map(k=>PE[k][2]);let b='';
if(S.step==0)b=`${Sec('Trip details')}${Row({lead:`<div class="si">${ic('calendar',20)}</div>`,title:fd(t.date,1),sub:'Starts '+tt(t.t1)})}${Row({lead:`<div class="si">${ic('map-pin',20)}</div>`,title:t.origin,sub:'Meet-up point'})}${Row({lead:`<div class="si">${ic('info',20)}</div>`,title:t.budget,sub:'Budget per person'})}${t.note?Ban('Note',t.note):''}${Sec('Who’s going')}${Members(t)}`;
else if(S.step==1){
 const categories=['All',...['Do','Eat','Shop'].filter(c=>t.stops.some(s=>s.k===c))];
 if(!categories.includes(S.cat))S.cat='All';
 const L=t.stops.map((s,i)=>[s,i]).filter(([s])=>S.cat==='All'||s.k===S.cat);
b=(t.vs.P?Ban('You’ve voted',pn.length&&!fin(t)?`Waiting on ${pn.join(' & ')}. Your itinerary unlocks once everyone has voted.`:'Everyone’s in. Changing a vote updates the itinerary.',fin(t)?Btn('See itinerary','step:2',{v:'y'}):''):Ban(!t.stops.length?'No activities to vote on':n?`${n} activit${n==1?'y':'ies'} left to vote on`:'Ready to submit',`${t.close?`Voting closes ${fd(t.close)}. `:''}${!t.stops.length?'Add activities to start voting.':n?'Give every activity a thumbs-up or thumbs-down to submit.':'All activities reviewed. Your votes are ready to submit.'}`,Btn('Submit votes','submit',{off:n>0||!t.stops.length})))
+`<div class="pills activity-category-filters" style="margin:32px 0 4px">${categories.map(c=>ActivityFilterPill(c,S.cat===c)).join('')}</div>${L.length?`<div class="vote-place-list">${L.map(([s,i])=>VoteRow(s,i,t)).join('')}</div>`:Empty('No activities yet','Add places from your saved list below.')}`}
else b=lk?`<div class="lockc"><div class="si" style="background:var(--white)">${ic('lock',22)}</div><h2>Itinerary locked</h2><div class="cap">It unlocks as soon as everyone has voted.</div><div class="segs">${[...t.m].map(k=>`<i class="${t.vs[k]?'on':''}"></i>`).join('')}</div><div class="cap sm"><b>${t.m.length-pend(t).length} of ${t.m.length}</b> voted</div></div>${Sec('Votes in')}${Members(t)}<div class="pad" style="display:flex;flex-direction:column;gap:10px;margin-top:16px">${pn.length?Btn('Nudge '+pn.join(' & '),'nudge',{v:'sec',i:'send'}):''}${Btn(t.vs.P?'Review my votes':'Go to vote','step:1')}</div>`
:`${pathSeg(t)}${forkBan(t)}<div class="sec itinerary-section"><h2>Itinerary</h2><span class="cap sm">${ms.length} stop${ms.length==1?'':'s'}</span></div>${ms.length?Timeline(t,{stops:ms,official:true}):Empty('No confirmed activities','Activities need to be included by the group vote to appear here.')}${altRow(t)}<div class="itinerary-review-wrap pad"><button type="button" class="itinerary-review-votes" data-a="step:1">Review or change votes</button></div>`;
return `<div class="l-${t.c}"><div class="th">${Top(IBtn('arrow-left','back','Back'),'')}<div class="thd">${Cover(t,'l')}<div class="gr"><h1>${t.n}</h1><div class="dt">${fd(t.date,1)}</div></div></div><div class="tact"><button class="gob" data-a="navigate" ${go?'':'disabled'}>${ic('navigation',20,go?'currentColor':'none')}Navigate</button><button data-a="menu" aria-label="More trip options">${ic('dots',24,'currentColor')}</button></div><div class="meta">${Stack(t.m)}<span class="cap sm">${t.m.length} going · ${stxt(t)}</span></div></div>
${Stepper(t,S.step,true)}<div style="margin-top:8px">${b}</div></div>`};
/* Legacy SVG map (superseded by the real-tile V.map in map-screen.js, kept for reference) */
const MAPBG=`<svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="390" height="844" fill="#F5F4F0"/><path d="M0 590Q80 550 170 610T330 720T390 670V844H0Z" fill="#CFE6F2"/><rect x="236" y="104" width="120" height="76" rx="14" fill="#DDEFD3"/><rect x="24" y="300" width="80" height="96" rx="14" fill="#DDEFD3"/>${[[16,96,88,64],[120,84,64,56],[200,196,88,72],[304,172,72,96],[16,200,64,80],[112,300,88,64],[216,292,72,112],[304,296,72,60],[112,400,80,80],[304,400,72,120],[216,440,72,88],[16,432,72,70]].map(b=>`<rect x="${b[0]}" y="${b[1]}" width="${b[2]}" height="${b[3]}" rx="8" fill="#ECECEA"/>`).join('')}<g stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"><path d="M0 180H390M0 290H390M0 420H390M0 530H390M104 0V844M208 0V560M300 0V844"/><path d="M0 60L390 560" stroke-width="14"/></g></svg>`;
const poly=(P,c)=>`<polyline class="${c}" points="${P.map(p=>p.join(',')).join(' ')}"/>`,at=p=>`style="left:${p[0]}%;top:${p[1]}%"`;
/* Leg helpers for live navigation: mode, duration and an estimated distance from the "N min walk / by car" strings. */
const LEG=function(s){
  const tr=String(s.tr||'').trim(),
    start=/^(?:meet|start|gather|arrive)\b/i.test(tr),
    hike=/\b(?:hike|hiking)\b/i.test(tr),
    walk=hike||/\b(?:walk|walking|on foot)\b/i.test(tr),
    car=/\b(?:car|taxi|drive|driving)\b/i.test(tr),
    rail=/\b(?:MRT|metro|train)\b/i.test(tr),
    ferry=/\bferry\b/i.test(tr),
    hr=tr.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|h)\b/i),
    min=tr.match(/(\d+)\s*(?:minutes?|mins?|min)\b/i),
    length=tr.match(/\b(\d+(?:\.\d+)?)\s*(km|m)\b/i),
    m=hr?Math.round(Number(hr[1])*60):min?Number(min[1]):null,
    d=length?Math.round(Number(length[1])*(length[2].toLowerCase()==='km'?1000:1)):null;
  return {
    m,d,start,hike,text:tr,
    ic:start?'map-pin':walk?'walk':car?'car':rail?'train':ferry?'ship':'navigation',
    vb:start?'Meet':hike?'Hike':walk?'Walk':car?'Drive':rail?'Take the train':ferry?'Take the ferry':'Travel',
    km:d==null?'':fkm(d)
  };
},
fkm=d=>d>=1000?+(d/1000).toFixed(1)+' km':Math.round(d)+' m';
const NavTL=(t,ms,cu,live)=>{const dn=live?cu:0;return `<ol class="tl nv l-${t.c}">${dn?`<li class="tdone">${ic('check',14)}${dn} stop${dn>1?'s':''} done</li>`:''}${ms.map((s,i)=>{if(i<dn)return '';const g=LEG(s),legLabel=t.id==='hike'?(i===1?'2 hr forest hike · 4.5 km':i===2?'1.5 hr exit hike · 2.5 km + walk to lunch':s.tr):s.tr,tr=i>dn?`<li class="tc"><span class="ln"></span><span class="cap sm">${ic(g.ic,14)}${esc(legLabel)}${g.km?' · '+g.km:''}</span></li>`:'',info=`<div class="gr"><b>${s.n}</b><div class="cap sm">${tt(s.t)} · ${s.s}</div></div>`;
 if(i==cu)return `${tr}<li class="tn cur"><span class="nd">${i+1}</span>${live?`<button class="cc" data-a="next" aria-label="Arrived at ${s.n}"><div class="gr"><span class="kick">Now heading here</span><b>${s.n}</b><div class="cap sm">${tt(s.t)} · ${s.s}</div></div></button>`:`<div class="cc">${info}</div>`}</li>`;
 return `${tr}<li class="tn ${i==cu+1?'nx':'rest'}"><span class="nd">${i+1}</span>${info}<span class="tn-t">${tt(s.t)}</span></li>`}).join('')}</ol>`};
V.map=()=>{const L=S.nav?trip(S.mapTrip):null;let svg='',pins='',top='',sh='';
if(!L){OV().forEach(t=>{const ms=mstops(t),P=ms.map(s=>ov(t,[s.x,s.y])),c=!fin(t);svg+=`<g class="l-${t.c}" data-a="mload:${t.id}">${poly(P,'rc')}${poly(P,'rl'+(c?' dash':''))}${poly(P,'rh')}</g>`;pins+=P.map((p,i)=>i?`<button class="pin d l-${t.c}" ${at(p)} data-a="mload:${t.id}" aria-label="${t.n}, stop ${i+1}"></button>`:`<button class="pin b l-${t.c}${c?' cand':''}" ${at(p)} data-a="mload:${t.id}" aria-label="${t.n}">${t.b}</button>`).join('')});
 top=`<div class="mtop"><label class="fld">${ic('search',20)}<input placeholder="Search places or trips" aria-label="Search the map"></label></div>`;
 sh=`<div class="pad"><h2>On the map</h2><div class="cap">Tap a trip’s pin or route to load it.</div></div>${OV().map(t=>Row({a:'mload:'+t.id,lead:Bullet(t,'l'),title:t.n,sub:`${fd(t.date)} · ${rel(t.date)}`,sub2:fin(t)?'':'Voting open',trail:ic('chevron-right',20)})).join('')}`}
else{const ms=mstops(L),cu=Math.min(S.leg,ms.length-1),P=[L.o,...ms.map(s=>[s.x,s.y])],live=dd(L.date)<=1&&fin(L),from=live&&cu?[ms[cu-1].x,ms[cu-1].y]:L.o;
 svg=`<g class="l-${L.c}">${poly(P,'rc')}${poly(P,'rl'+(fin(L)?'':' dash'))}${live?poly(P.slice(0,cu+1),'rt'):''}</g>`;
 pins=ms.map((s,i)=>`<span class="pin stn l-${L.c}${live&&i==cu?' cur':''}${live&&i<cu?' done':''}" ${at([s.x,s.y])}>${live&&i<cu?ic('check',14):i+1}</span>`).join('')+`<span class="pl" ${at([ms[cu].x,ms[cu].y])}>${ms[cu].n}</span><span class="you" ${at(from)} role="img" aria-label="You are here"></span>`;
 top=`<div class="mtop"><button class="chip" data-a="endnav" aria-label="Close trip">${ic('x',18)}${Bullet(L,'s')}${L.n}</button></div>`;sh=navSheet()}
return `<div class="mapbg">${MAPBG}</div><svg class="mb" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${svg}</svg>${pins}${top}<div class="msh${L?' nav':''}${S.mx?' x':''}" id="msh"><div class="grab" role="button" tabindex="0" aria-label="Expand or collapse panel" data-a="toggleMx"></div><div id="mc">${sh}</div></div>`};
const visR=()=>R.filter(r=>S.fyp?r.f:!r.f);
V.reels=()=>`<div class="rtg" role="tablist" aria-label="Feed">${[[1,'For you'],[0,'Friends']].map(([k,l])=>`<button role="tab" aria-selected="${S.fyp==k}" class="${S.fyp==k?'on':''}" data-a="feed:${k}">${l}</button>`).join('<span class="sp" aria-hidden="true"></span>')}</div><div class="rfeed">${visR().map(r=>{const gi=R.indexOf(r);return `<article class="rv l-${r.c}">${Reel(gi,r.n)}${Sap(gi)}<h1>${r.h}</h1><div><b>${r.n}</b> · ${r.loc}</div><div class="cap">${r.d}</div><div class="pills"><span class="pill">★ ${r.sc}</span><span class="pill">${r.pr}</span></div><button class="rinfo" data-a="info:${gi}">${ic('info',20)}Info</button><div class="rail"><button class="ib coll" aria-pressed="${inCol(gi)}" aria-label="Save ${r.n} to a collection" data-a="colopen:${gi}">${ic('bookmark',28)}</button><button class="ib heart" aria-pressed="${!!S.saved[gi]}" aria-label="Like ${r.n}" data-a="rlike:${gi}">${ic('reel-heart',24)}</button><button class="ib" data-a="toast:Sent to your friends" aria-label="Share ${r.n}">${ic('send',20)}</button></div></article>`}).join('')}</div>`;
/* Legacy chat + profile views (superseded in chat-profile.js) */
V.chat=()=>`<div class="hd"><h1>Chat</h1></div><div style="margin-top:8px">${CH.map((c,i)=>Row({a:'thread:'+i,label:c.n+(c.u?`, ${c.u} unread`:''),lead:Cover(trip(c.tid),'m'),title:c.n,sub:c.m[c.m.length-1][1],trail:`<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="cap sm">${c.t}</span>${c.u?`<span class="bd2">${c.u}</span>`:''}</div>`})).join('')}</div>`;
V.thread=()=>{const c=CH[S.th];return `${Top(IBtn('arrow-left','back','Back'),'')}<div style="text-align:center;margin-top:-40px;padding-bottom:12px"><b>${c.n}</b><div class="cap sm">${c.u2.length} members</div></div><div class="msgs" id="msgs">${c.m.map(msg).join('')}${S.typing?`<div class="m"><div class="bub"><span class="typ" aria-label="Typing"><i></i><i></i><i></i></span></div></div>`:''}</div><div class="comp"><input class="in" id="cin" placeholder="Message" aria-label="Message" onkeydown="if(event.key=='Enter')A.send()"><button class="play" style="width:48px;height:48px" data-a="send" aria-label="Send message">${ic('send',20)}</button></div>`};
V.profile=()=>{const p=S.p,tg=(k,x)=>Pill(x,`ptag:${k}:${x}`,p[k].includes(x));return `<div class="pad" style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:16px"><span class="av xl l-blue">${(p.name[0]||'P').toUpperCase()}</span><h1>${p.name||'You'}</h1><div class="cap">${T.filter(t=>!t.left).length} trips · 4 friends</div></div>
<div class="pad" style="margin-top:28px"><label class="lb" for="pn">Name</label><input class="in" id="pn" value="${p.name}" oninput="S.p.name=this.value;pd()"></div>
${Sec('Budget per trip',`<span class="cap sm" id="bv">SGD ${p.budget}</span>`)}<div class="pad"><input type="range" class="rg" min="50" max="2000" step="50" value="${p.budget}" style="--v:${(p.budget-50)/1950*100}%" aria-label="Budget per trip in SGD" oninput="S.p.budget=+this.value;this.style.setProperty('--v',((this.value-50)/1950*100)+'%');$('#bv').textContent='SGD '+this.value;pd()"><div class="rgl"><span>SGD 50</span><span>SGD 2,000</span></div></div>${Sec('Dietary Needs')}<div class="pad">${TagBox('diet',p.diet,'Add a dietary need…',['Halal','Vegetarian','Kosher','Vegan','Gluten-free'])}</div>${Sec('Accessibility needs')}<div class="pad">${TagBox('access',p.access,'Add an accessibility need…',['Step-free routes','Wheelchair access','Limited walking','Quiet spaces','Visual support','Hearing support'])}</div>${Sec('Places you like')}<div class="pad">${TagBox('likes',p.likes,'Add a place type…',['Cafes','Museums','Hikes','Movies','Arts & crafts','Beaches','Night markets'])}</div>
${Sec('Saved places',`<span class="cap sm">${SVL().length}</span>`)}${SVL().slice(0,3).map(s=>Row({lead:StopIc(s),title:s.n,sub:byTxt(s.by)})).join('')}`};
/* layers (sheets + dialogs) */
let lastF=null;
function lay(type,html,label){const c=$('#lyc');lastF=document.activeElement;c.className=type;c.setAttribute('aria-label',label);c.innerHTML=(type=='sheet'?'<div class="grab"></div>':'')+`<div class="lyb">${html}</div>`;$('#ly').classList.add('open');$('#app').inert=$('#tb').inert=$('#fab').inert=$('#psave').inert=true;reelsSync();setTimeout(()=>c.focus(),60)}
const setLy=h=>{$('#lyc .lyb').innerHTML=h},hdr=(t,sub)=>`<div class="mh">${Cover(t,'xs')}<div class="gr"><b>${t.n}</b><div class="cap sm">${sub||fd(t.date)}</div></div>${IBtn('x','closeLy','Close')}</div>`;
/* Activity facts are grounded in the trip's existing stop data, not invented venue details. */
const activityHTML=i=>{
 const t=trip(S.cur),s=t&&t.stops[+i];
 if(!s)return Empty('Activity not found','Return to the trip and try again.');
 const fields=[['Category',s.k],['Scheduled time',tt(s.t)],['Activity information',s.s],['Travel to this stop',s.tr]].filter(([,v])=>v);
 return `<div class="mh"><span class="si">${ic(activityIcon(s),20)}</span><div class="gr"><h2>${esc(s.n)}</h2><span class="cap sm">${esc(t.n)}</span></div>${IBtn('x','closeLy','Close activity details')}</div><div class="pad activity-details">${ActivityPhoto(s,t)}<dl class="activity-facts">${fields.map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><div class="activity-vote-totals"><b>Group votes</b><div><span>${ic('thumbs-up',18)} ${s.u} up</span><span>${ic('thumbs-down',18)} ${s.d} down</span></div></div><p class="cap sm">Use the thumbs-up or thumbs-down buttons in the activity list to cast your vote.</p></div>`;
};
/* Trip options uses the same slide-up sheet and title hierarchy as
   New Trip > Select collections; existing actions are unchanged. */
const menuHTML=()=>{
 const t=trip(S.cur);
 return `<div class="mh trip-options-sheet-header">
  <div class="trip-options-sheet-title">${Cover(t,'xs')}<div class="gr"><h2>${esc(t.n)}</h2><span class="cap sm">${esc(fd(t.date))}</span></div></div>
  ${IBtn('x','closeLy','Close trip options')}
 </div><div class="trip-options-actions">
 ${Mi('share','Share trip','mshare')}
 ${Mi('calendar','Reschedule','mresch')}
 ${Mi('log-out','Leave trip','mleave','dg')}
 </div>`;
};
const shareHTML=()=>{const t=trip(S.cur);return `${hdr(t,'Share trip')}<div class="pad" style="display:flex;flex-direction:column;gap:16px"><div style="display:flex;gap:8px;align-items:center;background:var(--s2);border-radius:8px;padding:6px 6px 6px 14px"><span class="gr cap">roam.app/t/${t.id}</span><button class="btn sm2" data-a="copylink">${ic('link',14)}Copy</button></div><b>Send to friends</b><div class="chips">${FR.map(([n,k])=>Pill(n,'shsel:'+k,S.sh.includes(k))).join('')}</div>${Btn('Send invite'+(S.sh.length?` to ${S.sh.length}`:''),'shsend',{off:!S.sh.length})}</div>`};
const reschHTML=()=>{const t=trip(S.cur),o=[7,14,21].map(n=>addD(t.date,n));return `${hdr(t,'Reschedule')}<div class="pad" style="display:flex;flex-direction:column;gap:16px"><p class="cap">Currently ${fd(t.date,1)}. Pick up to 3 dates and the group will vote.</p><div class="chips">${o.map(d=>Pill(fd(d),'rsel:'+iso(d),S.rs.includes(iso(d)))).join('')}</div>${Btn('Send poll'+(S.rs.length?` (${S.rs.length})`:''),'rsend',{off:!S.rs.length})}</div>`};
const leaveHTML=()=>{const t=trip(S.cur);return `<h2>Leave ${t.n}?</h2><p class="cap" style="margin-bottom:12px">You’ll lose access to the itinerary and chat. Everyone else will be notified.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${Btn('Stay','closeLy',{v:'sec'})}${Btn('Leave','leave',{v:'dg'})}</div>`};
const resHTML=()=>{const t=trip(S.cur),q=S.q.trim().toLowerCase(),L=SVL().map((p,i)=>[p,i]).filter(([p])=>!t.stops.some(s=>s.n==p.n)&&(!q||(p.n+p.s).toLowerCase().includes(q)));return L.length?L.map(([p,i])=>Row({a:'addp:'+i,lead:StopIc(p),title:p.n,sub:p.s,sub2:byTxt(p.by),trail:ic('plus',20)})).join(''):`<p class="cap pad" style="padding-top:16px">${q?`Nothing in your saved places matches “${esc(S.q)}”.`:'Everything you’ve saved is already on the list.'}</p>`};
const addHTML=()=>`<div class="mh"><h2 class="gr">${downvoted(trip(S.cur))?'Suggest someplace new':'Add a new activity'}</h2>${IBtn('x','closeLy','Close')}</div><div class="pad" style="margin-bottom:8px"><label class="fld" style="box-shadow:none;background:var(--s2)">${ic('search',20)}<input id="aq" class="in" style="background:none;border:0;padding:0;height:100%" placeholder="Search your saved places" aria-label="Search your saved places" oninput="A.qs(this.value)" autocomplete="off"></label></div><div class="cap pad sm" style="margin:8px 0 4px">From your saved places</div><div id="res">${resHTML()}</div>`;
const tripPick=gi=>`<div class="mh"><div class="gr"><h2>Add to which trip?</h2><div class="cap sm">${R[gi].n}</div></div>${IBtn('x','closeLy','Close')}</div>${UP().map(t=>Row({a:`addtrip:${gi}:${t.id}`,lead:Cover(t,'m'),title:t.n,sub:fd(t.date),trail:ic('plus',20)})).join('')}`;
/* place info + compare */
const RV=['5.6k','3.8k','2.1k','1.2k','890'];
const PXr=gi=>{const r=R[gi],mac=r.n==='MacRitchie Reservoir';return{ph:mac?'assets/treetop-walk.jpg':RP[gi],n:r.n,loc:r.loc,sc:mac?4.9:+r.sc,rv:mac?'2.8k':(RV[gi]||'1k'),pr:r.pr,d:mac?'A lush reservoir escape with calm water views, shaded forest trails and the famous TreeTop Walk nearby.':r.d,c:r.c,i:r.i}};
const PXs=p=>{let h=0;for(const ch of p.n)h=(h*31+ch.charCodeAt(0))%997;return{n:p.n,loc:p.s,sc:+(4.2+(h%8)/10).toFixed(1),rv:(1+h%40/10).toFixed(1)+'k',pr:p.k=='Eat'?'$10–$30':p.k=='Shop'?'$0–$50':'$5–$25',d:`${p.s}. ${byTxt(p.by)}.`,c:LINE[h%LINE.length],i:p.i}};
const PXp=p=>{const gi=R.findIndex(x=>x.n==p.n);return gi>-1?PXr(gi):PXs(p)};
const ana=x=>x.sc>=4.6?'This place is highly recommended!':x.sc>=4.4?'A well-rated pick that fits most trips.':'Mixed reviews. Worth comparing first.';
const Stars=(sc,rv)=>`<span class="stars" role="img" aria-label="${sc} out of 5">${[1,2,3,4,5].map(n=>ic('star',16,n<=Math.round(sc)?'currentColor':'none')).join('')}<span class="c">${rv}</span></span>`;
/* Preserve the shared place-image layout while accepting photo URLs as
   well as legacy Unsplash IDs. Broken remote imagery never leaves an icon
   overlay or broken-image glyph in the photo slot. */
const Img=(x,dots=1)=>{
 const ph=String(x.ph||'');
 const image=/^(?:https:\/\/|assets\/)/.test(ph)
  ?`<img src="${esc(ph)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">`
  :Pic(x.ph,x.n,600);
 return `<div class="iimg l-${x.c}">${image}<span class="loc">${ic('map-pin',14)}<span>${x.loc}</span></span>${dots?'<span class="dots"><i></i><i></i><i></i></span>':''}</div>`;
};
const Chk=()=>`<div class="pad ck"><button class="fld" data-a="cmpick">${ic('search',20)}<span class="gr">Check against saved places</span>${ic('bookmark',20)}</button></div>`;
/* Visitor reviews shown at the bottom of each reel's info pop-up, keyed by place name.
   Each review is [quote, name, who they are, stars (optional, default 5)]. */
const REVIEWS={
 'MacRitchie Reservoir':{head:'A little escape, loved by many.',blurb:'Fresh air, still water and miles of green right in the heart of Singapore.',list:[
  ['The reservoir views are gorgeous. It feels like you’ve left the city without ever leaving Singapore.','Alicia','Weekend hiker'],
  ['TreeTop Walk is absolutely worth it. Go early, take your time and enjoy the canopy from above.','Marcus','Nature lover'],
  ['Beautiful trails, peaceful water and so much wildlife. One of my favourite places to reset.','Jia','First-time visitor']]},
 'Shark Restaurant':{head:'Dinner with a little bite.',blurb:'Watch the sharks feed up close, with guides keeping everything calm and safe.',list:[
  ['Watching the feeding up close was unreal. Our guide kept everything calm and explained every step.','Priya','Adventure seeker'],
  ['The staff were relaxed and clear on safety. Our kids are still talking about it.','Daniel','Family traveller'],
  ['A bit pricey for a meal, but it’s a story you’ll tell for years. Book the early slot.','Mei','Foodie']]},
 'Burger Shot':{head:'Build it your way, every time.',blurb:'Pick your patty, stack your toppings and grill it fresh at your own table.',list:[
  ['Loved building my own burger. The sauce bar alone is worth the trip to Bugis.','Kai','Burger fan'],
  ['Great for a group night out. Every burger came out different and delicious.','Sara','Group planner'],
  ['Fair prices, quick service and super friendly staff. Easy to come back.','Wei Ling','Local regular']]},
 'Dim Sum Ting':{head:'Steaming hot, at any hour.',blurb:'Baskets stacked to the ceiling and served fresh, even in the middle of the night.',list:[
  ['Came at 2am after a night out and every basket was piping hot. The har gow is a must.','Hafiz','Night owl'],
  ['So much choice and the prices are hard to beat. We ordered way too much.','Grace','Dim sum lover'],
  ['Busy and loud, but brilliant. Go with friends so you can try more baskets.','Ethan','Weekend visitor',4]]},
 'Skyline Terrace':{head:'Golden hour, high above the city.',blurb:'Rooftop views, cool drinks and a skyline that glows as the sun goes down.',list:[
  ['We arrived just before sunset and the whole skyline turned gold. Magical.','Nadia','Sunset chaser'],
  ['Relaxed vibe, friendly staff and drinks that are fairly priced for the view.','Tom','Date-night planner'],
  ['Perfect for photos. Arrive early to grab a spot by the edge.','Aisha','Travel photographer']]},
 'Pour & Co':{head:'Coffee with a little craft.',blurb:'Hand-poured latte art and a cosy bar seat in the middle of Haji Lane.',list:[
  ['The latte art was almost too pretty to drink, and the flat white was silky smooth.','Lena','Coffee lover'],
  ['Tiny spot, but the baristas make you feel at home. Great for people-watching.','Raj','Café hopper',4],
  ['Reasonably priced and consistently good. My go-to stop before wandering Haji Lane.','Chloe','Local regular']]}
};
/* Five stars with partial fill, so 4.6 shows four full stars and a star filled about 60%.
   The fill width is mapped to the star's drawn shape (about 4% to 96% of its box) so it looks proportional. */
const StarsFrac=sc=>`<span class="stars" role="img" aria-label="${sc} out of 5">${[0,1,2,3,4].map(i=>{const f=Math.max(0,Math.min(1,sc-i)),w=f>=1?100:+(4.2+f*91.6).toFixed(1);return `<span class="star-frac">${ic('star',16,'none')}${f>0?`<span class="star-fill" style="width:${w}%">${ic('star',16,'currentColor')}</span>`:''}</span>`}).join('')}</span>`;
const reviewsHTML=(x,score,count)=>{const r=REVIEWS[/^MacRitchie Reservoir(?: Park)?$/i.test(x.n)?'MacRitchie Reservoir':x.n];if(!r||!Number.isFinite(score))return '';return `<section class="mac-review-section" aria-label="${esc(x.n)} visitor reviews">
 <div class="mac-review-count"><span class="mac-review-count-dot"></span>${count} visitor reviews</div>
 <div class="mac-review-list">${r.list.map(([q,n,w,st=5])=>`<article class="mac-review-card"><div class="mac-review-stars">${Stars(st,'')}</div><p>“${q}”</p><div class="mac-review-author"><span class="mac-review-avatar">${n[0]}</span><span><b>${n}</b><small>${w}</small></span></div></article>`).join('')}</div>
</section>`};
const infoHTML=gi=>{const x=typeof gi==='number'?PXr(gi):gi,isMacRitchie=/^MacRitchie Reservoir(?: Park)?$/i.test(x.n),score=isMacRitchie?4.9:x.sc,review=Number.isFinite(score);return `<div class="mh"><h2 class="gr">${x.n}</h2>${IBtn('x','closeLy','Close')}</div><div class="pad">${Img(x)}<dl class="kv"><dt>Review</dt><dd>${review?Stars(score,isMacRitchie?'2.8k':x.rv):'Not available yet'}</dd><dt>Price</dt><dd>${x.pr||'Not available yet'}</dd><dt>ROAM says</dt><dd>${review?ana({sc:score}):'There is not enough review information for an analysis yet.'}</dd></dl></div>${reviewsHTML(x,score,isMacRitchie?'2.8k':x.rv)}<div style="height:24px"></div>${Chk()}`};
const tripPlacePX=i=>{const t=trip(S.cur),s=t&&t.stops[+i];if(!s)return null;const ri=R.findIndex(r=>r.n.toLowerCase()===s.n.toLowerCase());if(ri>-1)return PXr(ri);const saved=SVL().find(p=>p.n.toLowerCase()===s.n.toLowerCase());if(saved)return PXp(saved);const mr=mockRating(s.n);return{ph:null,n:s.n,loc:s.s||'Location not listed',sc:+mr.sc,rv:mr.rv,pr:'$$',d:s.s||'Place details have not been added yet.',c:t.c,i:s.i}};
const pickHTML=gi=>{const me=(typeof gi==='number'?PXr(gi):gi).n;return `<div class="mh">${IBtn('arrow-left','cmpback','Back')}<div class="gr"><h2>Check against</h2><div class="cap sm">From your saved places</div></div>${IBtn('x','closeLy','Close')}</div>${SVL().map((p,j)=>[p,j]).filter(([p])=>p.n!=me).map(([p,j])=>Row({a:'cmpto:'+j,lead:StopIc(p),title:p.n,sub:p.s,sub2:byTxt(p.by),trail:ic('chevron-right',20)})).join('')}`};
const Col=(x,w)=>`<div class="cp l-${x.c}">${w?`<span class="win" role="img" aria-label="Higher rated">${ic('star',18,'currentColor')}</span>`:''}<b class="n">${x.n}</b>${Img(x,0)}<div><div class="cap sm">Review</div>${Number.isFinite(x.sc)?Stars(x.sc,x.rv):'<span class="cap sm">Not available yet</span>'}</div><div><div class="cap sm">Price</div><b>${x.pr||'Not available yet'}</b></div><div><div class="cap sm">Description</div><div class="ds">${x.d}</div></div></div>`;
const cmpHTML=(gi,j)=>{const a=typeof gi==='number'?PXr(gi):gi,b=PXp(SVL()[j]),rankable=Number.isFinite(a.sc)&&Number.isFinite(b.sc);return `<div class="mh">${IBtn('arrow-left','cmpback','Back')}<h2 class="gr">Compare</h2>${IBtn('x','closeLy','Close')}</div><div class="cmp">${Col(a,rankable&&a.sc>b.sc)}${Col(b,rankable&&b.sc>a.sc)}</div><div style="height:20px"></div>${Chk()}`};