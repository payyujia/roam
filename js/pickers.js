/* ===== PICKERS: Dropdown + Calendar (Components Library · Sunrise Frost v11) =====
   Replace the native <select> and <input type="date">. Markup/classes mirror the library sheet:
   .dd-trigger / .dd-list / .dd-opt  and  .cal-h / .cal-wd / .cal-g / .day. */
const DDP={};                                   /* id -> pick handler, registered at render time */
Object.assign(I,{'chevron-left':'<path d="M15 18l-6-6 6-6"/>'});
const TRIPDOT=['var(--sky-500)','var(--coral-500)','var(--amber)','var(--rose)'];

/* Dropdown({id,label,aria,value,ph,opts:[{v,t,sub,dot}],pick}) — one open at a time (S.dd) */
const Dropdown=o=>{
 const open=S.dd===o.id,cur=o.opts.find(x=>x.v==o.value),lid='ddl-'+o.id;
 DDP[o.id]=o.pick;DDP['+'+o.id]=o.add&&o.add.fn;
 const dot=x=>x&&x.dot?`<i class="dd-dot" style="--g:${x.dot}"></i>`:'';
 return `<div class="dd fw">${o.label?`<span class="lb" id="${lid}">${o.label}</span>`:''}
<button type="button" class="fld glass dd-trigger${open?' open':''}" data-dd="${o.id}" data-a="ddt:${o.id}" aria-haspopup="listbox" aria-expanded="${open}"${open?` aria-controls="ddo-${o.id}"`:''} ${o.label?`aria-labelledby="${lid}"`:`aria-label="${esc(o.aria||o.ph||'')}"`}>${dot(cur)}<span class="dd-val${cur?'':' nov'}">${esc(cur?cur.t:(o.ph||''))}</span><svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
${open?`<div class="dd-list glass"><div class="dd-opts" id="ddo-${o.id}" role="listbox"${o.label?` aria-labelledby="${lid}"`:` aria-label="${esc(o.aria||o.ph||'')}"`}>${o.opts.map(x=>{const on=x.v==o.value;return `<button type="button" role="option" class="dd-opt" aria-selected="${on}" data-a="ddp:${o.id}:${encodeURIComponent(x.v)}">${dot(x)}<span class="t">${esc(x.t)}${x.sub?`<small>${esc(x.sub)}</small>`:''}</span>${on?'<svg class="tick" viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>':''}</button>`}).join('')}</div>${o.add?`<div class="rule" style="margin:6px 8px"></div><button type="button" class="dd-opt add" data-a="ddadd:${o.id}"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>${esc(o.add.t)}</button>`:''}</div>`:''}</div>`};

/* ----- Calendar (range) ----- */
const MFULL=['January','February','March','April','May','June','July','August','September','October','November','December'],DFULL=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const tripDays=()=>{const m={};T.filter(t=>!t.left).forEach((t,i)=>{m[iso(t.date)]=TRIPDOT[i%4]});return m};
const calHint=c=>!c.a?'Pick a start date':!c.b?'Pick an end date (optional)':`${fd(p8(c.a))} – ${fd(p8(c.b))}`;
const calSub=c=>c.a&&c.b?`${Math.round((p8(c.b)-p8(c.a))/864e5)} night${Math.round((p8(c.b)-p8(c.a))/864e5)==1?'':'s'}`:c.a?'Day trip, or tap an end date':'';
const Calendar=c=>{
 const y=c.m.getFullYear(),mo=c.m.getMonth(),first=new Date(y,mo,1).getDay(),len=new Date(y,mo+1,0).getDate(),cells=Math.ceil((first+len)/7)*7,td=tripDays(),nowIso=iso(NOW),canPrev=y*12+mo>NOW.getFullYear()*12+NOW.getMonth();
 let g='';
 for(let i=0;i<cells;i++){
  const d=new Date(y,mo,1-first+i),k=iso(d),out=d.getMonth()!==mo,past=d<NOW,dis=out||past,A_=c.a===k,B_=c.b===k,range=c.a&&c.b&&c.b>c.a,inr=range&&k>c.a&&k<c.b;
  const cl=['day',k===nowIso?'today':'',dis&&out?'out':'',A_||B_?'sel':'',range&&A_?'start':'',range&&B_?'end':'',inr?'mid':''].filter(Boolean).join(' ');
  g+=`<button type="button" class="${cl}" aria-label="${DFULL[d.getDay()]} ${d.getDate()} ${MFULL[d.getMonth()]}"${k===nowIso?' aria-current="date"':''}${A_||B_?' aria-pressed="true"':''}${dis?' disabled':` data-a="calday:${k}"`}><span>${d.getDate()}${!out&&td[k]?`<i class="dot" style="--g:${td[k]}"></i>`:''}</span></button>`;
 }
 return `<div class="cal glass" role="group" aria-label="Choose trip dates"><div class="cal-h"><b aria-live="polite">${MFULL[mo]} ${y}</b><div class="cal-nav"><button type="button" class="btn mini" aria-label="Previous month" data-a="calmo:-1"${canPrev?'':' disabled'}>${ic('chevron-left',15)}</button><button type="button" class="btn mini" aria-label="Next month" data-a="calmo:1">${ic('chevron-right',15)}</button></div></div>
<div class="cal-wd" aria-hidden="true">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(x=>`<span>${x}</span>`).join('')}</div><div class="cal-g">${g}</div><div class="rule"></div>
<div class="cal-f"><div><div class="s">${calHint(c)}</div><div class="micro">${calSub(c)}</div></div><div class="cal-act"><button type="button" class="btn sec sm2" data-a="calclear">Clear</button><button type="button" class="btn sm2" data-a="calset"${c.a?'':' disabled'}>Set dates</button></div></div></div>`};

/* Date field: a button that opens the calendar. which = 'start' | 'end' */
const DateField=(which,label,val,err,invalid)=>`<div><span class="lb" id="dl-${which}">${label}</span><button type="button" class="fld glass dd-trigger${S.cal&&S.cal.on===which?' open':''}" data-a="calopen:${which}" aria-haspopup="dialog" aria-expanded="${!!S.cal}" aria-labelledby="dl-${which} dv-${which}"${invalid}><span id="dv-${which}" class="dd-val${val?'':' nov'}">${val?fd(p8(val),1):'Select date'}</span>${ic('calendar',17)}</button>${err}</div>`;

Object.assign(A,{
 ddadd:id=>{S.dd=null;DDP['+'+id]&&DDP['+'+id]();rr()},
 finv:(k,v)=>{v=(v||'').trim();if(!v)return;const q=v.toLowerCase(),f=FR.find(y=>y[0].toLowerCase()==q)||(FR.filter(y=>y[0].toLowerCase().startsWith(q)).length==1?FR.find(y=>y[0].toLowerCase().startsWith(q)):null);S.f.coll=S.f.coll||[];if(!f){toast('No friend named “'+v.slice(0,30)+'”');return}if(S.f.coll.includes(f[1])){toast(f[0]+' is already invited');return}S.f.coll.push(f[1]);render('form');const i=document.getElementById('tq-'+k);i&&i.focus()},
 trm:(k,x)=>{x=decodeURIComponent(x);if(k=='coll'){const f=FR.find(y=>y[0]==x);S.f.coll=(S.f.coll||[]).filter(c=>!f||c!=f[1]);render('form')}else{S.p[k]=S.p[k].filter(y=>y!=x);pd();rr()}},
 /* Keep the open trigger focused so the selected option shows the single soft
    selection highlight from the component sheet, not an extra focus outline.
    Arrow keys can still move focus into the list. */
 ddt:id=>{S.dd=S.dd===id?null:id;rr();const el=$(`[data-dd="${id}"]`);el&&el.focus()},
 ddp:(id,v)=>{S.dd=null;DDP[id]&&DDP[id](decodeURIComponent(v));const t=$(`[data-dd="${id}"]`);t&&t.focus()},
 calopen:w=>{if(S.cal&&S.cal.on===w){S.cal=null}else{const f=S.f,s=f.start&&p8(f.start);S.cal={on:w,a:f.start||null,b:f.end||null,m:new Date((s||NOW).getFullYear(),(s||NOW).getMonth(),1)}}render('form')},
 calmo:n=>{const m=S.cal.m;S.cal.m=new Date(m.getFullYear(),m.getMonth()+ +n,1);render('form');const b=$(`[data-a="calmo:${n}"]`);b&&!b.disabled&&b.focus()},
 calday:k=>{const c=S.cal;if(!c.a||(c.a&&c.b)||k<c.a){c.a=k;c.b=null}else if(k>c.a)c.b=k;else c.b=null;render('form');const b=$(`[data-a="calday:${k}"]`);b&&b.focus()},
 calclear:()=>{S.cal.a=S.cal.b=null;render('form')},
 calset:()=>{const c=S.cal;if(!c.a)return;S.f.start=c.a;S.f.end=c.b||'';delete S.fe.start;delete S.fe.end;S.cal=null;render('form')}
});
/* click outside an open dropdown closes it; Esc and arrow keys behave like a native listbox */
document.addEventListener('click',e=>{if(S.dd&&!e.target.closest('.dd')){S.dd=null;rr()}});
document.addEventListener('keydown',e=>{
 if(S.dd){
  if(e.key=='Escape'){e.stopImmediatePropagation();const id=S.dd;S.dd=null;rr();const t=$(`[data-dd="${id}"]`);t&&t.focus();return}
  if(e.key=='ArrowDown'||e.key=='ArrowUp'){
   const o=$('#dev .dd-opt'),i=o.indexOf(document.activeElement);
   if(o.length){
    e.preventDefault();
    const chosen=o.findIndex(el=>el.getAttribute('aria-selected')==='true');
    const first=i<0?(chosen>=0?chosen:(e.key=='ArrowDown'?0:o.length-1)):(i+(e.key=='ArrowDown'?1:-1)+o.length)%o.length;
    o[first].focus();
   }
  }
 }else if(S.cal&&e.key=='Escape'&&topId()=='form'){e.stopImmediatePropagation();S.cal=null;render('form')}
},true);
/* a fresh trip form always starts with the calendar closed */
{const nt=A.newtrip;A.newtrip=(...a)=>{S.cal=null;S.dd=null;return nt(...a)}}
