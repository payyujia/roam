/* ===== BOOT: render once, then keep only the live UI clock in sync. ===== */
/* Initial page load is not navigation: show the first screen without the
   horizontal slide, then restore transitions for subsequent page changes. */
/* Desktop only: preserve the iPhone 17's 402 × 874 internal layout and
   shrink the virtual device as a whole when browser zoom or a short window
   would otherwise crop the bottom navigation or home indicator.
   This changes preview size only; iPhone/touch fullscreen mode is unchanged. */
const fitRoamPhonePreview=()=>{
 const frame=document.getElementById('dev');
 if(!frame)return;
 if(window.matchMedia('(max-width:480px)').matches){
  frame.style.zoom='';
  return;
 }
 const margin=32;
 const scale=Math.min(1,(window.innerWidth-margin)/402,(window.innerHeight-margin)/874);
 const next=String(Math.max(.1,scale));
 if(frame.style.zoom!==next){
  frame.style.zoom=next;
  /* The map camera uses the viewport geometry; refit it after a zoom
     change so paths and the navigation drawer remain aligned. */
  if(document.querySelector('#s-map.on')&&typeof mapReframe==='function')
   requestAnimationFrame(()=>mapReframe(false));
 }
};
fitRoamPhonePreview();
window.addEventListener('resize',fitRoamPhonePreview,{passive:true});
if(window.visualViewport)
 window.visualViewport.addEventListener('resize',fitRoamPhonePreview,{passive:true});

const bootApp=$('#app');
bootApp.classList.add('nt');
rr();
requestAnimationFrame(()=>requestAnimationFrame(()=>bootApp.classList.remove('nt')));

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
