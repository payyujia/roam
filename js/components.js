/* ===== COMPONENTS (each has one builder of the same name) ===== */
const Bullet=(t,z='')=>`<span class="bl ${z} l-${t.c}" aria-hidden="true">${t.b}</span>`;
const PH={hike:'photo-1441974231531-c6227db76b6e',read:'photo-1481627834876-b7833e8f5570',game:'photo-1511512578047-dfb367046420',jb:'photo-1519501025264-65ba15a82390',cn:'photo-1508804185872-d7badad00f7d',laz:'photo-1507525428034-b723cf961d3e',nan:'photo-1544025162-d76694265947',sun:'photo-1470252649378-9c29740c9fa8'};
const RP=['photo-1560275619-4662e36fa65c','photo-1568901346375-23c9450c58cd','photo-1563245372-f21724e3856d','photo-1544367567-0f2fcb009e0b','photo-1550745165-9bc0b252726f'];
const Pic=(id,seed,w=600)=>`<img src="${id?`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`:`https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${w}`}" alt="" decoding="async" data-s="${encodeURIComponent(seed)}" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='https://picsum.photos/seed/'+this.dataset.s+'/600/600'}else this.remove()">`;
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
const Av=(k,z='')=>{const p=PE[k];if(!p)return '';return `<span class="av ${z} l-${p[1]}" title="${esc(k==='P'?(S.p.name||'You'):p[2])}">${esc(p[0])}<img src="${AVATAR[k]}" alt="" decoding="async" onerror="this.remove()"></span>`},Stack=s=>`<span class="st" aria-hidden="true">${[...s].map(k=>Av(k)).join('')}</span>`;
const Btn=(l,a,o={})=>`<button class="btn ${o.v||''}" data-a="${a}"${o.off?' disabled':''}>${o.i?ic(o.i,20):''}${l}</button>`;
const IBtn=(i,a,l,v='',s=24)=>`<button class="ib ${v}" data-a="${a}" aria-label="${l}">${ic(i,s)}</button>`;
const Pill=(l,a,on)=>`<button class="pill${on?' on':''}" aria-pressed="${!!on}" data-a="${a}">${l}</button>`;
const Row=o=>{const g=o.a?'button':'div';return `<${g} class="row ${o.x||''}"${o.a?` data-a="${o.a}"`:''}${o.label?` aria-label="${o.label}"`:''}>${o.lead||''}<div class="gr"><b>${o.title}</b>${o.sub?`<div class="cap sm">${o.sub}</div>`:''}${o.sub2?`<div class="cap sm">${o.sub2}</div>`:''}</div>${o.trail||''}</${g}>`};
const Sec=(t,r='')=>`<div class="sec"><h2>${t}</h2>${r}</div>`,Top=(l,t='',r='')=>`<div class="top">${l}<b class="tt">${t}</b>${r||'<span></span>'}</div>`;
const Empty=(h,p)=>`<div class="empty"><b>${h}</b><div class="cap">${p}</div></div>`,Ban=(h,p,act='')=>`<div class="ban"><div><b>${h}</b><div class="cap">${p}</div></div>${act}</div>`;
const Sign=(t,sub,r='')=>`<div class="sign l-${t.c}">${Bullet(t,'l')}<div class="gr"><h2>${t.n}</h2><div class="cap">${sub}</div></div>${r}</div>`;
const StopIc=s=>`<div class="si">${ic(s.i,20)}</div>`,Mi=(i,l,a,x='')=>`<button class="mi ${x}" data-a="${a}">${ic(i)}${l}</button>`;
const stxt=t=>fin(t)?(t.st=='done'?'<span class="dotc off"></span>Completed':'<span class="dotc ok"></span>Itinerary ready'):'<span class="dotc wait"></span>Voting open';
const Stepper=(t,at,live)=>{const dn=t?[1,+!!t.vs.P,+fin(t)]:[0,0,0],g=live?'button':'div';return `<div class="step${t?' l-'+t.c:''}"${live?' role="tablist"':''}>${['Details','Vote','Itinerary'].map((n,i)=>{const lk=t&&i==2&&!fin(t),on=i==at;return `<${g} class="stp${dn[i]?' done':''}${on?' on':''}${lk?' lock':''}"${live?` role="tab" aria-selected="${on}" data-a="step:${i}"`:''}><span class="sd">${lk?ic('lock',12):dn[i]?ic('check',13):i+1}</span>${n}</${g}>`}).join('')}</div>`};
const Timeline=(t,o)=>`<ol class="tl l-${t.c}">${o.origin?`<li class="tn org"><span class="nd"></span><div class="gr"><b>${o.origin}</b><div class="cap sm">Start</div></div></li>`:''}${o.stops.map((s,i)=>{const lv=o.leg!=null,c=lv&&i==o.leg,d=lv&&i<o.leg;return `${i||o.origin?`<li class="tc${d?' done':''}"><span class="ln"></span><span class="cap sm">${ic('clock',12)}${s.tr}</span></li>`:''}<li class="tn${c?' cur':''}${d?' done':''}"${o.live?` data-a="leg:${i}" role="button" tabindex="0"`:''}><span class="nd">${d?ic('check',14):i+1}</span><div class="gr"><b>${s.n}</b><div class="cap sm">${tt(s.t)} · ${s.s}</div>${s.alt?'<span class="tag">Changed</span>':''}</div></li>`}).join('')}</ol>`;
const Members=t=>[...t.m].map(k=>Row({lead:Av(k,'big'),title:PE[k][2],trail:t.vs[k]?'<span class="tag ok">Voted</span>':'<span class="tag">Voting…</span>'})).join('');
const VoteRow=(s,i)=>Row({x:'wrap vote-row',lead:StopIc(s),title:s.n,sub:`${tt(s.t)} · ${s.s}`,sub2:s.d>s.u?'<span class="err">Not in itinerary</span>':'',trail:`<div class="vt"><button class="vb up" aria-pressed="${s.m==1}" aria-label="Upvote ${s.n}" data-a="vt:${i}:1">${ic('thumbs-up',18)}</button><span class="cap sm">${s.u}</span><button class="vb dn" aria-pressed="${s.m==-1}" aria-label="Downvote ${s.n}" data-a="vt:${i}:-1">${ic('thumbs-down',18)}</button><span class="cap sm">${s.d}</span></div>`});
const TripRow=t=>Row({x:`tier t${dd(t.date)<0?0:tier(t.date)}`,a:`open:${t.id}`,label:`${t.n}, ${fd(t.date)}`,lead:Cover(t,'m'),title:t.n,sub:`${fd(t.date)} · ${rel(t.date)}`,sub2:stxt(t),trail:Stack(t.m)});const REQ=D(11,14);
const InviteRow=()=>{const t=trip('read');return `<div class="row wrap rq"><div class="si">${ic('calendar',20)}</div><div class="gr"><b>Raymond wants to move ${t.n}</b><div class="cap sm">${fd(t.date)} to ${fd(REQ)}</div></div><div class="rqa"><button class="btn sm2" data-a="inv:y">Accept</button><button class="btn sm2 sec" data-a="inv:n">Decline</button></div></div>`};
/* tag component */
const Tag=(k,x)=>`<span class="tag2">${esc(x)}<button aria-label="Remove ${esc(x)}" data-a="trm:${k}:${encodeURIComponent(x)}">${ic('x',14)}</button></span>`;
const TagBox=(k,vals,ph,sg=[])=>`<div class="tbx"><div class="tin">${ic('search',18)}<input class="tip" list="dl-${k}" placeholder="${ph}" aria-label="${ph}" autocomplete="off" onkeydown="if(event.key=='Enter'){event.preventDefault();A.tadd('${k}',this)}"><button class="tpl" aria-label="Add" data-a="tadd:${k}">${ic('plus',18)}</button></div><datalist id="dl-${k}">${sg.filter(x=>!vals.includes(x)).map(x=>`<option value="${x}">`).join('')}</datalist>${vals.length?`<div class="tags">${vals.map(x=>Tag(k,x)).join('')}</div>`:''}</div>`;

/* ===== REEL VIDEOS =====
   One short vertical clip per reel, same order as R in data.js.
   Drop the files in /videos. A missing/broken file silently falls back to the photo (RP). */
const RVID=['videos/shark.mp4','videos/burger.mp4','videos/dimsum.mp4','videos/skyline.mp4','videos/pixel.mp4'];
const Reel=(gi,seed)=>`${Pic(RP[gi],seed,800)}${RVID[gi]?`<video class="rvid" src="${RVID[gi]}" muted loop playsinline preload="metadata" disablepictureinpicture aria-hidden="true" onerror="this.remove()"></video>`:''}`;
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