/* ===== CHAT + PROFILE (v3 views, override the legacy ones in views.js) ===== */
/* Each message's real sent time lives at m[5]. Older demo conversations
   had only relative labels ("2m"/"1h"/"Mon"), not recorded timestamps.
   Estimate recent demo times once per page session for the sample UI; keep
   the older weekday label rather than inventing its unknown clock time. */
const chatDemoStartedAt=Date.now();
const chatDemoSentAt=new WeakMap(CH.map(c=>{
 const match=/^(\d+)([mh])$/.exec(c.t||'');
 const demoTime=match?chatDemoStartedAt-Number(match[1])*(match[2]==='h'?3600000:60000):null;
 return [c,demoTime];
}));
const chatLastMessage=c=>c.m.slice().reverse().find(m=>m[1]||m[3]==='fork')||null;
const chatLatestSentAt=c=>{
 const m=chatLastMessage(c),ts=m&&m[5];
 return typeof ts==='number'&&Number.isFinite(ts)&&ts>0?ts:chatDemoSentAt.get(c)||null;
};
/* Use a local 24-hour clock time instead of a relative age for today/recent
   conversations, matching the 24-hour status-bar style. */
const chatTimeOfDay=ts=>new Intl.DateTimeFormat('en-GB',{
 hour:'2-digit',minute:'2-digit',hourCycle:'h23'
}).format(new Date(ts));
/* Retain the existing sync hook from main.js without rebuilding the list. */
const syncChatAges=()=>{
 const list=$('#clist');
 if(!list)return;
 list.querySelectorAll('.chat-time[data-chat-index]').forEach(el=>{
  const c=CH[Number(el.dataset.chatIndex)],ts=c&&chatLatestSentAt(c);
  if(!ts)return;
  el.textContent=chatTimeOfDay(ts);
  const recorded=chatLastMessage(c)?.[5];
  el.title=recorded?'Sent '+new Date(ts).toLocaleString():'Demo time estimated from sample label';
 });
};
const chatList=()=>{
 const q=(S.cq||'').trim().toLowerCase();
 const has=m=>(m[1]||'').toLowerCase().includes(q);
 const L=CH.map((c,i)=>[c,i]).filter(([c])=>!q||c.n.toLowerCase().includes(q)||c.m.some(has));
 return L.length?L.map(([c,i])=>{
  const hit=q&&c.m.slice().reverse().find(has);
  const latest=chatLastMessage(c),preview=hit||latest;
  const speaker=preview?(preview[0]==='P'?'You':PE[preview[0]]?.[2]||'Member'):'';
  const body=preview?(preview[1]||'Shared a path'):'No messages yet';
  const ts=chatLatestSentAt(c),timeLabel=ts?chatTimeOfDay(ts):c.t||'';
  const recorded=latest&&typeof latest[5]==='number';
  const fullTime=recorded?'Sent '+new Date(ts).toLocaleString():ts?'Demo time estimated from sample label':'Demo conversation: send time not recorded';
  return Row({
   x:'chat-row',a:'thread:'+i,
   label:c.n+(c.u?`, ${c.u} unread`:''),
   lead:Cover(trip(c.tid),'m'),title:hl(c.n,q),
   sub:`${speaker?esc(speaker)+': ':''}${hl(body,q)}`,
   trail:`<div class="chat-meta"><span class="cap sm chat-time" data-chat-index="${i}" title="${esc(fullTime)}">${esc(timeLabel)}</span>${c.u?`<span class="bd2 chat-unread">${c.u}</span>`:''}</div>`
  });
 }).join(''):`<div style="padding-top:8px">${Empty('No chats found',`Nothing matches “${esc(S.cq)}”.`)}</div>`;
};
V.chat=()=>`<div class="hd"><h1>Chat</h1></div><div class="cs" style="margin-top:12px"><label class="fi sr">${ic('search',20)}<input id="cq" type="search" placeholder="Search chats and messages" aria-label="Search chats and messages" value="${esc(S.cq)}" oninput="A.cq(this.value)" autocomplete="off"><button class="x" data-a="cqclear" aria-label="Clear search" ${S.cq?'':'hidden'}>${ic('x',16)}</button></label></div><div id="clist" class="cl">${chatList()}</div>`;
const forkMsg=tid=>{const t=trip(tid),fk=t.fork,i=Object.keys(fk.ch)[0];return `<button class="fcm" data-a="fview:${tid}"><span class="xic">${ic('git-branch',22)}</span><span class="gr"><b>${esc(pn(fk.owner))}’s path</b><span class="cap sm" style="display:block">${i!=null?`Replaces ${esc(fk.stops[i].from)} with ${esc(fk.stops[i].n)}`:'An extra path'} · tap to view</span></span>${ic('chevron-right',18)}</button>`};
const msg=(m,i,a)=>{const me=m[0]=='P',f=!a[i-1]||a[i-1][0]!=m[0];return `<div class="m ${me?'me':''}">${f&&!me?`<span class="cap sm">${PE[m[0]][2]}</span>`:''}<div class="bub">${m[3]=='fork'?forkMsg(m[4]):(window.RoamAppleEmoji?.renderText(m[1])??esc(m[1]))}</div></div>`};
V.thread=()=>{const c=CH[S.th];return `<div class="top"><button class="ib thread-back" data-a="back" aria-label="Back to chats">${ic('arrow-left')}</button><div class="tt"><b>${c.n}</b><span class="cap sm">${c.u2.length} members</span></div><span></span></div><div class="msgs" id="msgs">${c.m.map(msg).join('')}${S.typing?`<div class="m"><div class="bub"><span class="typ" aria-label="Typing"><i></i><i></i><i></i></span></div></div>`:''}</div><div class="comp"><input class="in" id="cin" placeholder="Message" aria-label="Message" onkeydown="if(event.key=='Enter')A.send()" style="border-radius:999px"><button class="play" data-a="send" aria-label="Send message">${ic('send',20)}</button></div>`};

/* ===== PROFILE: Settings-style. The list shows one row per topic; tap a row to see and edit its details. ===== */
const pSum=a=>a.length?a[0]+(a.length>1?' +'+(a.length-1):''):'None';
/* Shared component-library multiselect card: independent selections,
   labels on the left, frosted square checkbox on the right. */
const TransportCheck=(key,label,subtitle,values)=>{
 const checked=values.includes(key);
 return `<button type="button" class="checkcard glass transport-checkcard${checked?' on':''}" data-a="pmove:${encodeURIComponent(key)}" aria-pressed="${checked}">
 <span class="cc-main"><b>${label}</b><small>${subtitle}</small></span>
 <span class="checkbox${checked?' on':''}" aria-hidden="true">${checked?'<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>':''}</span>
 </button>`;
};
/* Count configured preference categories, not individual transport checkboxes. */
const travelPreferenceCount=p=>Number(!!p.pace)+Number(Array.isArray(p.move)?p.move.length>0:!!p.move);
const pTags=(k,ph,sg,note)=>`<div class="pad" style="margin-top:12px">${note?`<p class="cap" style="margin-bottom:12px">${note}</p>`:''}${TagBox(k,S.p[k],ph,sg)}</div>`;
/* Dietary needs share the exact Interests screen components and layout.
   Unlike the fixed Interests catalogue, dietary needs also allow custom entries. */
const dietarySuggestions=Object.freeze(['Halal','Vegetarian','Kosher','Vegan','Gluten-free']);
const dietDraft=()=>Array.isArray(S.p.dietDraft)?S.p.dietDraft:S.p.diet;
const dietDraftChanged=()=>{
 const draft=dietDraft(),saved=S.p.diet;
 return draft.length!==saved.length||draft.some(name=>!saved.some(v=>v.toLocaleLowerCase()===name.toLocaleLowerCase()));
};
const dietaryAvailable=()=>dietarySuggestions.filter(name=>!dietDraft().some(v=>v.toLocaleLowerCase()===name.toLocaleLowerCase()));
const dietaryQuery=()=>(S.dietaryQuery||'').trim().replace(/\s+/g,' ').slice(0,30);
const dietaryMatches=()=>{
 const q=dietaryQuery().toLocaleLowerCase();
 return (q?dietaryAvailable().filter(name=>name.toLocaleLowerCase().includes(q)):dietaryAvailable()).slice(0,5);
};
const DietaryTag=name=>`<span class="tag2">${esc(name)}<button type="button" aria-label="Remove ${esc(name)}" data-a="pdietRemove:${encodeURIComponent(name)}">${ic('x',14)}</button></span>`;
const dietaryTagsHTML=()=>dietDraft().length?dietDraft().map(DietaryTag).join(''):'<span class="cap sm interest-empty">No dietary needs added yet</span>';
const refreshDietaryPicker=()=>{
 const tags=$('#dietary-tags');
 if(tags)tags.innerHTML=dietaryTagsHTML();
 const count=$('#dietary-count');
 if(count)count.textContent=dietDraft().length+' selected';
 const changed=dietDraftChanged();
 S.p.dirty=changed?1:0;
 const save=$('#s-pdet .sv .btn');
 if(save)save.disabled=!changed;
};
/* Reusable ROAM Card Components 'Multiselect · with query input' SVG control. */
const ProfileQueryMultiselect=(id,label,placeholder,query,searchAction,addAction,tagsId,tagsHTML,suggestionsId)=>`<div class="glass invite-box tag-query profile-multi-card">
 <div class="tq-row">
  <svg viewBox="0 0 24 24" class="tq-ic" aria-hidden="true"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/></svg>
  <input id="${id}" type="text" placeholder="${esc(placeholder)}" aria-label="${esc(label)}" ${suggestionsId?`aria-controls="${suggestionsId}"`:''} value="${esc(query||'')}" maxlength="30" autocomplete="off" oninput="A.${searchAction}(this.value);this.nextElementSibling.disabled=!this.value.trim()" onkeydown="if(event.key==='Enter'){event.preventDefault();A.${addAction}()}">
  <button type="button" class="btn mini sky profile-multi-add" data-a="${addAction}" aria-label="Add ${esc(label)}" ${String(query||'').trim()?'':'disabled'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>
 </div>
 <div class="tags tq-tags profile-multi-tags" id="${tagsId}" aria-label="Selected ${esc(label)}" aria-live="polite">${tagsHTML}</div>
</div>`;
const ProfileQueryHeading=(heading,countId,count)=>`<div class="interest-section-head profile-query-heading"><span class="lb">${esc(heading)}</span><span class="cap sm" id="${countId}" aria-live="polite">${count} selected</span></div>`;
const DietaryPicker=()=>`<div class="pad interest-picker profile-query-picker dietary-picker">
 <section class="profile-query-section" aria-label="Your dietary needs">
  ${ProfileQueryHeading('Your dietary needs','dietary-count',dietDraft().length)}
  ${ProfileQueryMultiselect('dietary-search','dietary need','Add dietary need...',S.dietaryQuery,'pdietSearch','pdietFirst','dietary-tags',dietaryTagsHTML(),null)}
 </section>
</div>`;
/* Interests use a fixed catalogue rather than accepting arbitrary new categories. */
const INTEREST_CATALOG=Object.freeze(["Cafes","Museums","Hikes","Shopping","Beaches","Night markets","Art galleries","Nature","Theme parks","Movies","Arts & crafts","Food & dining","Historical sites","Photography","Live music","Outdoor adventures","Wellness","Sports","Architecture"]);
/* Keep five suggestions for each visit. Saved choices are replaced with the
   next unselected catalogue entries when Interests is opened again. */
const INTEREST_SUGGESTIONS=Object.freeze(["Shopping","Beaches","Night markets","Art galleries","Nature"]);
const INTEREST_SUGGESTION_ORDER=Object.freeze([
 ...INTEREST_SUGGESTIONS,
 ...INTEREST_CATALOG.filter(name=>!INTEREST_SUGGESTIONS.includes(name))
]);
const nextInterestSuggestions=()=>INTEREST_SUGGESTION_ORDER.filter(name=>!S.p.likes.includes(name)).slice(0,5);
/* Edit the interest selection in a draft; only Save changes commits to S.p.likes. */
const interestDraft=()=>Array.isArray(S.p.likesDraft)?S.p.likesDraft:S.p.likes;
const interestDraftChanged=()=>{
 const draft=interestDraft(),saved=S.p.likes;
 return draft.length!==saved.length||draft.some(name=>!saved.includes(name));
};
const InterestTag=x=>`<span class="tag2">${esc(x)}<button type="button" aria-label="Remove ${esc(x)}" data-a="pinterestRemove:${encodeURIComponent(x)}">${ic('x',14)}</button></span>`;
const interestTagsHTML=()=>interestDraft().length?interestDraft().map(InterestTag).join(''):'<span class="cap sm interest-empty">No interests selected yet</span>';
const refreshInterestPicker=()=>{
 const tags=$('#interest-tags');
 if(tags)tags.innerHTML=interestTagsHTML();
 const count=$('#interest-count');
 if(count)count.textContent=interestDraft().length+' selected';
 const changed=interestDraftChanged();
 S.p.dirty=changed?1:0;
 const save=$('#s-pdet .sv .btn');
 if(save)save.disabled=!changed;
};
const InterestPicker=()=>`<div class="pad interest-picker profile-query-picker">
 <section class="profile-query-section" aria-label="Your interests">
  ${ProfileQueryHeading('Your interests','interest-count',interestDraft().length)}
  ${ProfileQueryMultiselect('interest-search','interest','Add interest...',S.interestQuery,'pinterestSearch','pinterestFirst','interest-tags',interestTagsHTML(),null)}
 </section>
</div>`;
/* Accessibility and Health conditions reuse the compact multiselect input and selected tags.
   These editors remain fixed-choice and draft-only until Save changes. */
const PROFILE_PREFERENCE_PICKERS={
 access:{
  your:'Your accessibility needs',
  search:'Add accessibility need...',empty:'No accessibility needs selected yet',
  catalog:['Wheelchair access','Limited walking','Quiet spaces','Visual support','Hearing support','Step-free routes','Accessible toilets','Elevator access','Rest stops','Seating availability','Accessible transport','Avoid stairs','Low-sensory areas','Clear signage','Assistance with navigation','Wide pathways','Accessible entrances','Short walking distances','Wheelchair-friendly seating']
 },
 health:{
  your:'Your health conditions',
  search:'Add health condition...',empty:'No health conditions selected yet',
  catalog:['Asthma','Bad knees','Motion sickness','Heat sensitivity','Migraine','Chronic eye stye','Food allergies','Back pain','Joint pain','Chronic pain','Fatigue','Respiratory sensitivity','Sun sensitivity','Dizziness','Low stamina','Diabetes','Epilepsy','Vertigo','Anxiety']
 }
};
const profilePreferenceDraft=k=>Array.isArray(S.p[k+'Draft'])?S.p[k+'Draft']:S.p[k];
const profilePreferenceChanged=k=>{
 const draft=profilePreferenceDraft(k),saved=S.p[k];
 return draft.length!==saved.length||draft.some(name=>!saved.includes(name));
};
const ProfilePreferenceTag=(k,x)=>`<span class="tag2">${esc(x)}<button type="button" aria-label="Remove ${esc(x)}" data-a="prefRemove:${encodeURIComponent(x)}">${ic('x',14)}</button></span>`;
const profilePreferenceTagsHTML=k=>profilePreferenceDraft(k).length?profilePreferenceDraft(k).map(x=>ProfilePreferenceTag(k,x)).join(''):`<span class="cap sm interest-empty">${PROFILE_PREFERENCE_PICKERS[k].empty}</span>`;
const refreshProfilePreferencePicker=k=>{
 const tags=$('#preference-tags');
 if(tags)tags.innerHTML=profilePreferenceTagsHTML(k);
 const count=$('#preference-count');
 if(count)count.textContent=profilePreferenceDraft(k).length+' selected';
 const changed=profilePreferenceChanged(k);
 S.p.dirty=changed?1:0;
 const save=$('#s-pdet .sv .btn');
 if(save)save.disabled=!changed;
};
const ProfilePreferencePicker=k=>{
 const config=PROFILE_PREFERENCE_PICKERS[k];
 return `<div class="pad interest-picker profile-query-picker">
  <section class="profile-query-section" aria-label="${esc(config.your)}">
   ${ProfileQueryHeading(config.your,'preference-count',profilePreferenceDraft(k).length)}
   ${ProfileQueryMultiselect('preference-search',k==='access'?'accessibility need':'health condition',config.search,S.prefSearch,'prefSearch','prefFirst','preference-tags',profilePreferenceTagsHTML(k),null)}
   ${config.note?`<p class="cap sm preference-helper">${esc(config.note)}</p>`:''}
  </section>
 </div>`;
};
/* Count rated past trips in the same eligibility set as the ratings page.
   The seeded Sunrise rating is kept as a fallback for existing prototype state. */
const ratedPastTripCount=()=>PAST().filter(t=>{
 if(!t.m.includes('P'))return false;
 const rating=Number(S.p.ratings?.[t.id]??(t.id==='sun'?S.p.rate:0));
 return Number.isInteger(rating)&&rating>=1&&rating<=5;
}).length;
const PD={
 acct:{t:'Profile',i:'user',c:'blue',v:()=>'',b:()=>{const p=S.p;return `<div class="pad" style="display:flex;justify-content:center;margin-top:12px"><div class="avwrap">${Av('P','xl')}<button class="avedit" data-a="toast:Photo picker would open here" aria-label="Change photo">${ic('camera',18)}</button></div></div>
<div class="fl" style="margin-top:20px"><div><label class="lb" for="pn">Name</label><label class="fi">${ic('user',20)}<input id="pn" value="${esc(p.name)}" oninput="S.p.name=this.value;pd()" autocomplete="off"></label></div><div><label class="lb" for="pb">Bio</label><textarea class="in" id="pb" rows="3" oninput="S.p.bio=this.value;pd()">${esc(p.bio)}</textarea></div><div class="profile-home-city"><span class="lb">Home city</span>${Dropdown({id:'home',aria:'Home city',value:p.home,opts:['Singapore','Johor Bahru','Kuala Lumpur'].map((c,i)=>({v:c,t:c,dot:TRIPDOT[i%4]})),pick:v=>{S.p.home=v;pd();rr()}})}</div></div>`}},
 style:{t:'Travel preferences',i:'compass',c:'orange',v:()=>{const count=travelPreferenceCount(S.p);return `${count} ${count===1?'preference':'preferences'} set`},b:()=>{const p=S.p,selected=Array.isArray(p.move)?p.move:[p.move].filter(Boolean);return `<div class="fl travel-preferences-form" style="margin-top:12px">
<div class="travel-setting-group"><div class="travel-setting-label">Travel pace</div>
<div class="travel-pace-dropdown">${Dropdown({id:'travel-pace',aria:'Travel pace',value:p.pace,opts:[{v:'Chill',t:'Chill',dot:TRIPDOT[0]},{v:'Balanced',t:'Balanced',dot:TRIPDOT[1]},{v:'Packed',t:'Packed',dot:TRIPDOT[2]}],pick:v=>{S.p.pace=v;pd();render('pdet')}})}</div></div>
<div class="travel-setting-group"><div class="travel-setting-label" id="travel-transport-label">Transport preferences</div>
<div class="travel-transport-options" role="group" aria-labelledby="travel-transport-label">
${[['Walk','Walk','Short hops and scenic routes'],['MRT & bus','MRT & bus','Public transport first'],['Car','Car or taxi','Door to door']].map(([key,label,sub])=>TransportCheck(key,label,sub,selected)).join('')}
</div></div></div>`}},
 budget:{t:'Trip budget',i:'bag',c:'green',v:()=>'S$'+Number(S.p.budget).toLocaleString('en-SG'),b:()=>{const pc=S.p.budgetDraft ?? String(S.p.budget);return `<div class="pad budget-preference" style="margin-top:12px"><label class="lb" for="budget-input">Trip budget (SGD)</label><div class="fi budget-input-field"><input id="budget-input" type="text" inputmode="numeric" pattern="[0-9]*" value="${esc(pc)}" placeholder="Enter amount" aria-label="Trip budget in SGD" aria-describedby="budget-input-error" oninput="A.pbudgetInput(this)" autocomplete="off"></div><p id="budget-input-error" class="cap sm budget-input-error" role="alert" hidden>Enter a positive whole-dollar amount.</p></div>`}},
 diet:{nv:1,t:'Dietary needs',i:'coffee',c:'lime',v:()=>pSum(S.p.diet),b:()=>DietaryPicker()},
 access:{nv:1,t:'Accessibility',i:'user',c:'purple',v:()=>pSum(S.p.access),b:()=>ProfilePreferencePicker('access')},
 health:{nv:1,t:'Health conditions',i:'activity',c:'brown',v:()=>S.p.health.length?S.p.health.length+' added':'None',b:()=>ProfilePreferencePicker('health')},
 likes:{t:'Interests',i:'map-pin',c:'blue',v:()=>S.p.likes.length>1?S.p.likes[0]+' + '+(S.p.likes.length-1)+' more':pSum(S.p.likes),b:()=>InterestPicker()},
 notif:{t:'Notifications',i:'clock',c:'red',v:()=>Object.values(S.p.notif).filter(Boolean).length+' on',b:()=>{const n=S.p.notif;return `<div class="fl" style="margin-top:12px">${Switch('remind','Trip reminders','The day before, and on the morning',n.remind)}${Switch('vote','Voting nudges','When your group is waiting on you',n.vote)}${Switch('fork','Path activity','When someone forks a trip you’re on',n.fork)}</div>`}},
 rate:{t:'Rate past trips',i:'star',c:'yellow',v:()=>`${ratedPastTripCount()} rated`,b:()=>{
  // Match the app's Past tab, and only show trips the profile owner joined.
  const completed=PAST().filter(t=>t.m.includes('P')),p=S.p;
  return `<div class="pad" style="margin-top:12px">
    <p class="cap sm">Only past trips can be rated.</p>
    ${completed.length?`<div style="display:flex;flex-direction:column;gap:20px;margin-top:20px">${completed.map(t=>{
      const rating=Number(p.ratings?.[t.id]??(t.id==='sun'?p.rate:0))||0;
      return `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
        <div style="min-width:0"><b>${esc(t.n)}</b><div class="cap sm">${rating?rating+' out of 5':'Tap a star'}</div></div>
        <div class="rate" role="group" aria-label="Rate ${esc(t.n)}">${[1,2,3,4,5].map(n=>`<button type="button" aria-pressed="${n<=rating}" aria-label="Rate ${esc(t.n)} ${n} star${n===1?'':'s'}" data-a="prate:${t.id}:${n}">${ic('star',26,n<=rating?'currentColor':'none')}</button>`).join('')}</div>
      </div>`;
    }).join('')}</div>`:Empty('No completed trips yet','Finish a trip to rate it here.')}
  </div>`;
 }},
 liked:{t:'Liked reels',ro:1,i:'heart',c:'red',v:()=>String(savedReels('likes').length),b:()=>{const L=savedReels('likes');return L.length?`<div class="rgrid">${L.map(([r,i])=>`<button type="button" class="rg l-${r.c}" data-a="rgo:${i}" aria-label="Open ${esc(r.n)} reel">${Pic(RP[i],r.n,400)}<span class="rg-n">${ic('play',12,'currentColor')}<span>${esc(r.n)}</span></span></button>`).join('')}</div>`:Empty('No liked reels yet','Tap the heart on a reel to see it here.')}},
 saved:{t:'Saved reels',ro:1,i:'bookmark',c:'blue',v:()=>String(savedReels('all').length),b:()=>{const L=savedReels(),opts=[['all','All'],['likes','Likes'],...S.col.map(c=>[c.id,c.n])];return `<div class="pad saved-reels-filter" style="margin:12px 0 8px"><span class="lb">Collection</span>${Dropdown({id:'scf',aria:'Collection',value:S.colf,opts:opts.map(([k,n],i)=>({v:k,t:n,dot:TRIPDOT[i%4]})),pick:v=>A.colf(v)})}</div>${L.length?`<div class="rgrid">${L.map(([r,i])=>`<button class="rg l-${r.c}" data-a="rgo:${i}" aria-label="Open ${esc(r.n)} reel">${Pic(RP[i],r.n,400)}<span class="rg-n">${ic('play',12,'currentColor')}<span>${esc(r.n)}</span></span></button>`).join('')}</div>`:Empty('No reels here yet','Tap the bookmark on a reel to add it to a collection, or the heart to like it.')}`}}
};
/* Profile layout: section headers, each holding one or more filled groups */
const PG=[
 {h:'Preferences',g:[['style','budget','likes']]},
 {h:'Health & accessibility',g:[['diet','access','health']]},
 {h:'Your activity',g:[['saved','liked','rate']]}
];
V.profile=()=>{const p=S.p;return `<div class="hd profile-hd"><button class="btn round profile-notif" data-a="pdet:notif" aria-label="Notifications"><svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7zM10 20a2 2 0 0 0 4 0"/></svg></button><h1>Profile</h1></div>
<div class="sg profile-card-group"><button class="srow acct" data-a="pdet:acct">${Av('P','profile')}<span class="gr"><b>${esc(p.name)||'You'}</b><span class="cap" style="display:block">${esc(p.home)} · Joined 2025</span></span>${ic('chevron-right',20)}</button></div>
${PG.map(sec=>`<h2 class="ph">${sec.h}</h2>${sec.g.map(g=>`<div class="sg profile-settings-group">${g.map(k=>{const d=PD[k];return `<button class="srow settings-card" data-a="pdet:${k}"><span class="sic l-${d.c}">${ic(d.i,18)}</span><span class="stt">${d.t}</span>${d.nv?'':`<span class="sval">${esc(d.v())}</span>`}${ic('chevron-right',20)}</button>`}).join('')}</div>`).join('')}`).join('')}`};
/* Subpage: content + a Save bar fixed at the end (not on read-only pages). Disabled until something changes. */
V.pdet=()=>{const d=PD[S.pd];if(!d)return '';return `${Top(IBtn('arrow-left','back','Back'),d.t)}<div class="pdb">${d.b()}</div>${d.ro?'':`<div class="dock sv">${Btn('Save changes','psave',{off:!S.p.dirty})}</div>`}`};
