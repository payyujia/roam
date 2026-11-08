/* ===== COMPONENTS (each has one builder of the same name) ===== */
const Bullet=(t,z='')=>`<span class="bl ${z} l-${t.c}" aria-hidden="true">${t.b}</span>`;
const PH={hike:'photo-1441974231531-c6227db76b6e',read:'photo-1481627834876-b7833e8f5570',game:'photo-1511512578047-dfb367046420',jb:'photo-1519501025264-65ba15a82390',cn:'photo-1508804185872-d7badad00f7d',laz:'photo-1507525428034-b723cf961d3e',nan:'photo-1544025162-d76694265947',sun:'photo-1470252649378-9c29740c9fa8'};
const RP=['photo-1560275619-4662e36fa65c','photo-1568901346375-23c9450c58cd','photo-1563245372-f21724e3856d','photo-1544367567-0f2fcb009e0b','photo-1550745165-9bc0b252726f','url:https://images.pexels.com/videos/20711643/monk-walking-2-20711643.jpeg?auto=compress&dpr=1&h=750&w=1260'];
const Pic=(id,seed,w=600)=>`<img src="${id?`url:`+id.startsWith("url:")?id.slice(4):`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`:`https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${w}`}" alt="" decoding="async" data-s="${encodeURIComponent(seed)}" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='https://picsum.photos/seed/'+this.dataset.s+'/600/600'}else this.remove()">`;
const Cover=(t,z='m')=>`<div class="cover z-${z} l-${t.c}" aria-hidden="true">${Pic(PH[t.id],t.n,z=='l'||z=='xl'?600:240)}</div>`;
/* Local illustrated profile pictures: shared by trip members, friends, and the profile tab. */
/* Photographic demo profiles. Photos are loaded from Unsplash, not AI illustrations. */
const AVATAR={
 P:'https://images.unsplash.com/photo-1758691737605-69a0e78bd193?auto=format&fit=crop&crop=faces&w=256&h=256&q=75',
 R:'https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?auto=format&fit=crop&crop=faces&w=256&h=256&q=75',
 E:'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&crop=faces&w=256&h=256&q=75',
 L:'https://images.unsplash.com/photo-1745434159123-5b99b94206ca?auto=format&fit=crop&crop=faces&w=256&h=256&q=75',
 J:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=256&h=256&q=75'
};
const Av=(k,z='')=>{
 const p=PE[k];if(!p)return '';
 /* Only the expanded account avatar previews an unsaved photo. Everywhere
    else continues to show the committed image until Save changes. */
 const avatar=k==='P'
   ?(z==='xl'&&S.p.avatarDraft!==undefined?S.p.avatarDraft:S.p.avatar)
   :undefined;
 const src=avatar==='none'?'':(typeof avatar==='string'&&/^data:image\/jpeg;base64,[a-z0-9+/=]+$/i.test(avatar)?avatar:AVATAR[k]);
 return `<span class="av ${z} l-${p[1]}" title="${esc(k==='P'?(S.p.name||'You'):p[2])}">${esc(p[0])}${src?`<img src="${esc(src)}" alt="" decoding="async" onerror="this.remove()">`:''}</span>`;
},Stack=s=>`<span class="st" aria-hidden="true">${[...s].map(k=>Av(k)).join('')}</span>`;
const Btn=(l,a,o={})=>`<button class="btn ${o.v||''}" data-a="${a}"${o.off?' disabled':''}>${o.i?ic(o.i,20):''}${l}</button>`;
const IBtn=(i,a,l,v='',s=24)=>`<button class="ib ${v}" data-a="${a}" aria-label="${l}">${ic(i,s)}</button>`;
const Pill=(l,a,on)=>`<button class="pill${on?' on':''}" aria-pressed="${!!on}" data-a="${a}">${l}</button>`;
const Row=o=>{const g=o.a?'button':'div';return `<${g} class="row ${o.x||''}"${o.a?` data-a="${o.a}"`:''}${o.label?` aria-label="${o.label}"`:''}>${o.lead||''}<div class="gr"><b>${o.title}</b>${o.sub?`<div class="cap sm">${o.sub}</div>`:''}${o.sub2?`<div class="cap sm">${o.sub2}</div>`:''}</div>${o.trail||''}</${g}>`};
const Sec=(t,r='')=>`<div class="sec"><h2>${t}</h2>${r}</div>`,Top=(l,t='',r='')=>`<div class="top">${l}<b class="tt">${t}</b>${r||'<span></span>'}</div>`;
const Empty=(h,p)=>`<div class="empty"><b>${h}</b><div class="cap">${p}</div></div>`,Ban=(h,p,act='')=>`<div class="ban"><div><b>${h}</b><div class="cap">${p}</div></div>${act}</div>`;
const Sign=(t,sub,r='')=>`<div class="sign l-${t.c}">${Bullet(t,'l')}<div class="gr"><h2>${t.n}</h2><div class="cap">${sub}</div></div>${r}</div>`;
/* Use recognizable category icons on compact vote cards; leave other StopIc
   uses (itinerary, saved places, etc.) unchanged. */
const activityIcon=s=>{
 const label=String(s.n||'').toLowerCase(),description=String(s.s||'').toLowerCase();
 if(/theme park|legoland|amusement park|funfair/.test(label+' '+description))return 'ticket';
 if(/clown|circus|live show|theatre|theater|performance/.test(label+' '+description))return 'theater';
 if(/mall|market|shopping center|shopping centre|retail/.test(label+' '+description))return 'store';
 if(s.k==='Eat'&&!/cafe|café|coffee|bakery|tea/.test(label+' '+description))return 'utensils';
 return s.i||'map-pin';
};
const VoteStopIc=s=>`<div class="si">${ic(activityIcon(s),20)}</div>`;

/* Activity sheet photos are illustrative, not claims about a venue's imagery.
   Prefer photos already used elsewhere in ROAM and matching real-world
   categories; the fallback icon displays if the image cannot load. */
const ACTIVITY_PHOTO_BY_NAME={
 'MacRitchie Reservoir':PH.hike,'TreeTop Walk':PH.hike,'Lornie Trail':PH.hike,
 'Books Actually':PH.read,'Tiong Bahru Bakery':RP[4],
 'Arcade at Bugis+':PH.game,'Burger Shot':RP[1],
 'The Loneliest Robot in Great Britain':'unsplash:Lv5o-Xixi4c',
 'Dim Sum Ting':RP[2],
 'Super Mall':'unsplash:s4rZ1gG9qgM',
 'Legoland Malaysia':'unsplash:71srBJyS5gg',
 'Clown Show':'unsplash:qEas1jFgZu4',
 'Chengdu Panda Base':'unsplash:hRALOfpQyZY',
 'Jinli Ancient Street':PH.cn,
 'Hotpot dinner':'unsplash:Oo5PXEEkIMg',
 'Marina South Pier':PH.laz,'Lazarus Beach':PH.laz,
 'Nando’s Plaza Singapura':PH.nan,'East Coast Park':PH.sun
};
const activityPhotoSource=(s,t)=>{
 const val=ACTIVITY_PHOTO_BY_NAME[s.n]||PH[t.id]||null;
 if(!val)return null;
 return val.startsWith('unsplash:')
  ?`https://unsplash.com/photos/${encodeURIComponent(val.slice(9))}/download?force=true&w=960`
  :`https://images.unsplash.com/${val}?auto=format&fit=crop&w=960&q=75`;
};
const ActivityPhoto=(s,t)=>{
 const src=activityPhotoSource(s,t);
 if(!src)return '';
 return `<figure class="activity-photo l-${esc(t.c)}">
  <div class="activity-photo-fallback" aria-hidden="true">${ic(activityIcon(s),32)}</div>
  <img src="${esc(src)}" alt="Illustrative photo for ${esc(s.n)}" loading="lazy" decoding="async" onload="this.parentElement.classList.add('has-photo')" onerror="this.remove()">
  <figcaption class="cap sm">Illustrative photo</figcaption>
 </figure>`;
};
const StopIc=s=>`<div class="si">${ic(s.i,20)}</div>`,Mi=(i,l,a,x='')=>`<button class="mi ${x}" data-a="${a}">${ic(i)}${l}</button>`;
const stxt=t=>fin(t)?(t.st=='done'?'<span class="dotc off"></span>Completed':'<span class="dotc ok"></span>Itinerary ready'):'<span class="dotc wait"></span>Voting open';
const Stepper=(t,at,live)=>{const dn=t?[1,+!!t.vs.P,+fin(t)]:[0,0,0],g=live?'button':'div';return `<div class="step${t?' l-'+t.c:''}"${live?' role="tablist"':''}>${['Details','Vote','Itinerary'].map((n,i)=>{const lk=t&&i==2&&!fin(t),on=i==at;return `<${g} class="stp${dn[i]?' done':''}${on?' on':''}${lk?' lock':''}"${live?` role="tab" aria-selected="${on}" data-a="step:${i}"`:''}><span class="sd">${lk?ic('lock',12):dn[i]?ic('check',13):i+1}</span>${n}</${g}>`}).join('')}</div>`};
const Timeline=(t,o)=>`<ol class="tl l-${t.c}">${o.origin?`<li class="tn org"><span class="nd"></span><div class="gr"><b>${o.origin}</b><div class="cap sm">Start</div></div></li>`:''}${o.stops.map((s,i)=>{const lv=o.leg!=null,c=lv&&i==o.leg,d=lv&&i<o.leg;return `${i||o.origin?`<li class="tc${d?' done':''}"><span class="ln"></span><span class="cap sm">${ic('clock',12)}${s.tr}</span></li>`:''}<li class="tn${c?' cur':''}${d?' done':''}"${o.live?` data-a="leg:${i}" role="button" tabindex="0"`:''}><span class="nd">${d?ic('check',14):i+1}</span><div class="gr"><b>${s.n}</b><div class="cap sm">${tt(s.t)} · ${s.s}</div>${s.alt?'<span class="tag">Changed</span>':''}</div></li>`}).join('')}</ol>`;
const Members=t=>[...t.m].map(k=>Row({lead:Av(k,'big'),title:PE[k][2],trail:t.vs[k]?'<span class="tag ok">Voted</span>':'<span class="tag">Voting…</span>'})).join('');
/* Details and voting are sibling controls: tapping a vote never opens the details panel. */
/* Only the small info button opens activity details; voting uses separate controls. */
/* Summarise only information recorded for a stop: start time, type, duration.
   Other notes such as price and location stay in the activity details panel. */
const voteSubtitle=s=>{
 const parts=String(s.s||'').split(' · ').map(x=>x.trim()).filter(Boolean);
 const category=parts[0]||s.k||'Activity';
 const duration=s.duration||parts.slice(1).find(x=>/^\d+(?:\.\d+)?\s*(?:mins?|minutes?|hrs?|hours?)$/i.test(x));
 const time=s.t?t12(s.t).map((v,i)=>i?v.toUpperCase():v).join(' '):'';
 return [time,category,duration].filter(Boolean).join(' · ');
};
/* Activity voting uses a single horizontal card row. Title/subtitle may
   wrap within their column, while Info and both votes stay beside them. */
const VoteRow=(s,i)=>`<div class="row vote-row">${VoteStopIc(s)}<div class="gr vote-content"><div class="vote-heading"><b title="${esc(s.n)}">${esc(s.n)}</b></div><div class="cap sm vote-subtitle">${esc(voteSubtitle(s))}</div>${s.d>s.u?'<div class="cap sm vote-warning"><span class="err">Not in itinerary</span></div>':''}</div><div class="vote-actions"><button type="button" class="vote-info-btn" data-a="activity:${i}" aria-label="View details for ${esc(s.n)}" title="View activity details">${ic('info',16)}</button><div class="vt" role="group" aria-label="Vote on ${esc(s.n)}"><button type="button" class="vb up" aria-pressed="${s.m==1}" aria-label="Thumbs up for ${esc(s.n)}, ${s.u} votes" data-a="vt:${i}:1">${ic('thumbs-up',17)}<span class="vote-count" aria-hidden="true">${s.u}</span></button><button type="button" class="vb dn" aria-pressed="${s.m==-1}" aria-label="Thumbs down for ${esc(s.n)}, ${s.d} votes" data-a="vt:${i}:-1">${ic('thumbs-down',17)}<span class="vote-count" aria-hidden="true">${s.d}</span></button></div></div></div>`;
const TripRow=t=>Row({x:`tier t${dd(t.date)<0?0:tier(t.date)}`,a:`open:${t.id}`,label:`${t.n}, ${fd(t.date)}`,lead:Cover(t,'m'),title:t.n,sub:`${fd(t.date)} · ${rel(t.date)}`,sub2:stxt(t),trail:Stack(t.m)});const REQ=D(11,14);
const InviteRow=()=>{const t=trip('read');return `<div class="row wrap rq"><div class="si">${ic('calendar',20)}</div><div class="gr"><b>Raymond wants to move ${t.n}</b><div class="cap sm">${fd(t.date)} to ${fd(REQ)}</div></div><div class="rqa"><button class="btn sm2" data-a="inv:y">Accept</button><button class="btn sm2 sec" data-a="inv:n">Decline</button></div></div>`};
/* tag component */
const Tag=(k,x)=>`<span class="tag2">${esc(x)}<button aria-label="Remove ${esc(x)}" data-a="trm:${k}:${encodeURIComponent(x)}">${ic('x',14)}</button></span>`;
const TagBox=(k,vals,ph,sg=[],suggestions=true)=>suggestions?`<div class="tsl"><div class="glass invite-box tag-query"><div class="tq-row"><svg viewBox="0 0 24 24" class="tq-ic" aria-hidden="true"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/></svg><input id="tq-${k}" list="tq-${k}-sg" aria-label="${esc(ph)}" placeholder="${esc(ph)}" autocomplete="off" maxlength="30" onkeydown="if(event.key=='Enter'){event.preventDefault();this.nextElementSibling.nextElementSibling.click()}"><datalist id="tq-${k}-sg">${sg.filter(x=>!vals.includes(x)).map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist><button type="button" class="btn mini sky" aria-label="Add ${esc(ph)}" onclick="A.tsel('${k}',document.getElementById('tq-${k}').value.trim().slice(0,30))"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>${vals.length?`<div class="tags tq-tags">${vals.map(x=>Tag(k,x)).join('')}</div>`:''}</div></div>`:`<div class="tsl"><div class="glass invite-box tag-query"><div class="tq-row"><svg viewBox="0 0 24 24" class="tq-ic" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-4 3.5-6 7-6s6.2 2 7 6M17 5a3.5 3.5 0 0 1 0 7"/></svg><input id="tq-${k}" list="tq-${k}-sg" aria-label="${esc(ph)}" placeholder="${esc(ph)}" autocomplete="off" maxlength="30" onkeydown="if(event.key=='Enter'){event.preventDefault();A.finv('${k}',this.value)}"><datalist id="tq-${k}-sg">${sg.filter(x=>!vals.includes(x)).map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist><button type="button" class="btn mini sky" aria-label="Add friend" onclick="A.finv('${k}',document.getElementById('tq-${k}').value)"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button></div>${vals.length?`<div class="tags tq-tags">${vals.map(x=>Tag(k,x)).join('')}</div>`:''}</div></div>`;
/* New Trip: match friends only after typing, using an in-page list rather
   than a browser datalist popup. Keep the shared invite-box / tag styling. */
const FriendInvitePicker=()=>{
 const chosen=(S.f.coll||[]).map(id=>Tag('coll',PE[id][2])).join('');
 return `<div class="tsl invite-friends-picker"><div class="glass invite-box tag-query">
  <div class="tq-row"><svg viewBox="0 0 24 24" class="tq-ic" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c.8-4 3.5-6 7-6s6.2 2 7 6M17 5a3.5 3.5 0 0 1 0 7"/></svg>
   <input id="tq-coll" type="text" role="combobox" aria-label="Type a friend's name" aria-autocomplete="list" aria-haspopup="listbox" aria-controls="finv-matches" aria-expanded="false" placeholder="Type a friend’s name" autocomplete="off" spellcheck="false" maxlength="30" oninput="A.finvQuery(this.value)" onkeydown="A.finvKey(event)">
   <button type="button" id="finv-add" class="btn mini sky" data-a="finvAdd" aria-label="Add matching friend" disabled>${ic('plus',15)}</button>
  </div>
  <div id="finv-matches" class="friend-suggestion-list" role="listbox" aria-label="Matching friends" hidden></div>
  ${chosen?`<div class="tags tq-tags">${chosen}</div>`:''}
 </div></div>`;
};
/* ===== REEL VIDEOS =====
   One short vertical clip per reel, same order as R in data.js.
   Drop the files in /videos. A missing/broken file silently falls back to the photo (RP). */
const RVID=['videos/shark.mp4','videos/burger.mp4','videos/dimsum.mp4','videos/skyline.mp4','videos/pixel.mp4','https://videos.pexels.com/video-files/20711643/20711643-hd_1920_1080_25fps.mp4'];
const Reel=(gi,seed)=>`${Pic(RP[gi],seed,800)}${RVID[gi]?`<video class="rvid" src="${RVID[gi]}" muted loop playsinline preload="metadata" disablepictureinpicture aria-hidden="true" onerror="this.remove()"></video>`:''}`;
/* Reels the user saved, as [reel, index] pairs. */
const savedReels=(f=S.colf||'all')=>R.map((r,i)=>[r,i]).filter(([,i])=>f=='all'?(S.saved[i]||inCol(i)):f=='likes'?!!S.saved[i]:!!(S.col.find(c=>c.id==f)||{r:[]}).r.includes(i));
/* Social approval: friends who also saved this reel. Avatar + gradient heart badge (top right). */
/* Friend-approval heart is an actual 24 x 24 SVG, preserving the
   original small-badge proportions without a CSS clip-path. */
const Sap=gi=>{const f=(R[gi].sv||[]).slice(0,3);if(!f.length)return '';const nm=f.map(k=>PE[k][2]).join(', ');return `<div class="sap" role="img" aria-label="Also saved by ${nm}">${f.map((k,i)=>`<span class="sa" style="z-index:${9-i}">${Av(k)}<span class="hrt"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><defs><linearGradient id="sap-heart-${gi}-${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--rose)"/><stop offset="1" style="stop-color:var(--coral-500)"/></linearGradient></defs><path d="${I['reel-heart'].match(/ d="([^"]+)"/)[1]}" fill="url(#sap-heart-${gi}-${i})"/></svg></span></span>`).join('')}</div>`};
let _rio;
const reelsOn=()=>S.tab=='reels'&&topId()=='reels';
/* Play only the reel that is mostly on screen; pause the rest (and everything when off the Reels tab). */
function reelsSync(){$$('#s-reels video.rvid').forEach(v=>{const a=v.closest('.rv'),go=reelsOn()&&a&&a.dataset.vis=='1'&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(go){v.muted=true;const p=v.play();p&&p.catch(()=>{})}else v.pause()})}
function reelsAfter(){
 const feed=$('#s-reels .rfeed');if(_rio)_rio.disconnect();if(!feed)return;
 feed.querySelectorAll('video.rvid').forEach(v=>{v.muted=true;v.addEventListener('playing',()=>v.classList.add('on'))});
 _rio=new IntersectionObserver(es=>{es.forEach(en=>{en.target.dataset.vis=en.isIntersecting?'1':'0';const v=en.target.querySelector('video.rvid');if(v&&!en.isIntersecting)v.currentTime=0});reelsSync()},{root:feed,threshold:.6});
 feed.querySelectorAll('.rv').forEach(a=>_rio.observe(a));
 /* tap anywhere (not on a button) to pause / resume */
 feed.addEventListener('click',e=>{if(e.target.closest('button'))return;const v=e.target.closest('.rv')?.querySelector('video.rvid');if(!v)return;v.paused?v.play().catch(()=>{}):v.pause()});
}