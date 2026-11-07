/* ===== BOOT: render once, then keep only the live UI clock in sync. ===== */
rr();

/* Keep the seeded CLOCK/NOW for prototype trip scheduling and due-date examples.
   The status-bar time and greeting instead use the device's actual local time.
   Format the status time like iOS: hour:minute, no AM/PM suffix. The hour
   format follows the device/browser locale's 12- or 24-hour preference. */
const statusTimeFormatter=new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit'});
function syncLiveClock(){
  const now=new Date();
  const parts=statusTimeFormatter.formatToParts(now);
  const hour=parts.find(p=>p.type==='hour')?.value;
  const minute=parts.find(p=>p.type==='minute')?.value;
  const status=$('#sbt');
  if(status)status.textContent=(hour&&minute)?`${hour}:${minute}`:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
  const heading=$('#s-trips .hd h1');
  if(heading)heading.textContent=`${greet(now)}, ${S.p.name.trim()||'there'}`;
  /* Refresh only the visible age labels, without rebuilding chat/search UI. */
  if(typeof syncChatAges==='function')syncChatAges();
}
syncLiveClock();
/* Small, non-rendering updates avoid interrupting scrolling, reels and chat. */
setInterval(syncLiveClock,15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncLiveClock()});
window.addEventListener('focus',syncLiveClock);
window.addEventListener('pageshow',syncLiveClock);
