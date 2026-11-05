/* ===== TRIPS HOME (v4): overrides V.trips + V.all from views.js =====
   Order: greeting, Up next, Tasks, Your trips. "Up next" is not repeated in the list.
   Every task row = verb-first title, one context line, one deadline line. */
const LU=()=>UP().slice(1);
const ViewAll2=(n,k)=>n>TOP?`<button data-a="viewall:${k}">View all ${n}</button>`:'';
/* deadline line: "Closes Mon 9 Nov"; turns orange when 2 days or less away */
const due=(label,d)=>{const n=dd(d),hot=n<=2,w=n<0?'Overdue':hot?`${label} ${rel(d).toLowerCase()}`:`${label} ${fd(d)}`;return `<span class="due${hot?' hot':''}">${ic('clock',12)}${w}</span>`};
const taskDue2=id=>id=='inv'?+toDate(trip('read').date):trip(id).close?+toDate(trip(id).close):1e15;
const tasksSorted=()=>tasks().map((id,i)=>[id,i]).sort((a,b)=>taskDue2(a[0])-taskDue2(b[0])||a[1]-b[1]).map(x=>x[0]);
/* Tasks = agenda rows: date tile on the left (day + month the task is due), title + context in the middle, action on the right.
   Used on Home (first TOP rows) and on the "View all" page. */
/* status line under a task: urgent ("Overdue", "Due today", "Due tomorrow") when the deadline is close, otherwise who the task is waiting on.
   The deadline itself is shown once, on the date tile. */
const tdue=(wait,d)=>{if(!d)return `<span class="due">${ic('calendar',12)}No due date</span>`;const n=dd(d);return n<=1?`<span class="due hot">${ic('clock',12)}${n<0?'Overdue':n==0?'Due today':'Due tomorrow'}</span>`:`<span class="due">${ic('vote',12)}${wait}</span>`};
const DTile=d=>{if(!d)return `<div class="dtile" aria-hidden="true">${ic('calendar',22)}</div>`;const x=toDate(d),hot=dd(d)<=2;return `<div class="dtile${hot?' hot':''}" aria-hidden="true"><i>DUE</i><b>${x.getDate()}</b><span>${MN[x.getMonth()]}</span></div>`};
const TaskRow3=id=>{
 if(id=='inv'){const t=trip('read');return `<div class="trow task tier t${tier(null)}"><div class="tmain">${DTile(null)}<div class="gr"><b>Move ${t.n}?</b><div class="cap sm">Raymond · ${fd(REQ)}</div>${tdue('Waiting for your reply',null)}</div></div><div class="tact"><button class="ib f" data-a="inv:n" aria-label="Decline reschedule">${ic('x',18)}</button><button class="ib p" data-a="inv:y" aria-label="Accept reschedule">${ic('check',18)}</button></div></div>`}
 const t=trip(id),n=needs(t);
 return `<button class="trow task tier t${tier(t.close)}" data-a="votefor:${t.id}" aria-label="Vote on ${t.n}${t.close?`, due ${fd(t.close)}`:', no due date'}"><div class="tmain">${DTile(t.close)}<div class="gr"><b>Vote on ${t.n}</b><div class="cap sm">${n?`${n} stop${n==1?'':'s'} to review`:'Ready to submit'}</div>${tdue('Waiting for your vote',t.close)}</div></div><span class="tgo">${n?'Review':'Submit'}</span></button>`};
V.trips=()=>{const up=UP(),tk=tasksSorted(),L=S.seg=='up'?up.slice(1):PAST(),nx=up[0];return `<div class="hd"><h1>${greet()}, ${esc(S.p.name.trim()||'there')}</h1></div>
${nx?Sec('Up next')+`<button class="feat l-${nx.c}" data-a="open:${nx.id}">${Cover(nx,'l')}<div class="gr"><div class="eyebrow">${rel(nx.date)}</div><h2>${nx.n}</h2><div class="cap">${fd(nx.date)} · ${nx.stops.length} stops</div><div class="mt">${Stack(nx.m)}</div></div></button>`:''}
${Sec('Tasks',ViewAll2(tk.length,'tasks'))}${tk.length?`<div class="tlist">${tk.slice(0,TOP).map(TaskRow3).join('')}</div>`:Empty('You’re all caught up','Nothing needs your attention.')}
${Sec('Your trips',ViewAll2(L.length,S.seg))}<div class="pad">${Seg([['up','Upcoming'],['past','Past']],S.seg,'seg','Trips')}</div><div class="pad" style="margin-top:24px">${L.length?L.slice(0,TOP).map(TripRow).join(''):Empty(S.seg=='up'?(nx?'No other upcoming trips':'No upcoming trips'):'No past trips','Tap Create trip! to start one.')}</div>`};
V.all=()=>{const k=S.all,tk=k=='tasks',L=tk?tasksSorted():k=='up'?LU():PAST(),ttl=tk?'Tasks':k=='up'?'Upcoming trips':'Past trips';return `${Top(IBtn('arrow-left','back','Back'),ttl)}<div class="${tk?'tlist':'pad'}" style="margin-top:12px">${L.length?L.map(tk?TaskRow3:TripRow).join(''):Empty(tk?'You’re all caught up':k=='up'?'No upcoming trips':'No past trips',tk?'Nothing needs your attention.':'Tap Create trip! to start one.')}</div>`};
