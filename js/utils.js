/* ===== CLOCK + DATE HELPERS ===== */
/* dates: prototype "today" = Sat 31 Oct 2026 */
/* One clock for the whole app. Default: the prototype's frozen moment (31 Oct 2026, 7:41pm).
   Add ?now=live to use the real time, or ?now=2026-11-14T09:30 for any other moment. */
const CLOCK=(()=>{const q=new URLSearchParams(location.search).get('now');if(q=='live')return new Date();const d=q?new Date(q):null;return d&&!isNaN(d)?d:new Date(2026,9,31,19,41)})();
const greet=()=>{const h=CLOCK.getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening'};
const NOW=new Date(CLOCK.getFullYear(),CLOCK.getMonth(),CLOCK.getDate()),DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const toDate=d=>d instanceof Date?d:new Date(d);
const D=(m,d,y=2026)=>new Date(y,m-1,d),dd=d=>Math.round((toDate(d)-NOW)/864e5),fd=(d,y)=>{const dt=toDate(d);return `${DN[dt.getDay()]} ${dt.getDate()} ${MN[dt.getMonth()]}${y?' '+dt.getFullYear():''}`};
const rel=d=>{const n=dd(d);return n==0?'Today':n==1?'Tomorrow':n>1?`In ${n} days`:`${-n} days ago`};
const iso=d=>{const dt=toDate(d);return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`},p8=s=>{const[a,b,c]=s.split('-');return new Date(+a,b-1,+c)};
const t12=t=>{const[h,m]=t.split(':').map(Number);return[`${h%12||12}:${String(m).padStart(2,'0')}`,h<12?'am':'pm']},tt=t=>t12(t).join(' '),addD=(d,n)=>{const dt=toDate(d);return new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()+n)};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

/* ===== DUE-DATE COLOUR TIERS =====
   1 = due in 3 days or less (or overdue) | 2 = within one calendar month | 3 = further away / no deadline */
const monthAhead=()=>{const y=NOW.getFullYear(),m=NOW.getMonth()+1,last=new Date(y,m+1,0).getDate();return new Date(y,m,Math.min(NOW.getDate(),last))};
const tier=d=>{if(d==null)return 3;const n=dd(d);return n<=3?1:n<=dd(monthAhead())?2:3};