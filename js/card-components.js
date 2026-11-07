/* ===== ROAM CARD COMPONENT LIBRARY =====
   Shared card shell for Home voting tasks, rescheduling requests and trips.
   All three variants use the same structural slots: media, title, context,
   status and trailing actions. Variant-specific markup stays in its caller.
   Appearance is controlled in css/liquid-glass-v6.css (shared card tokens).
   This builder is also used by docs/card-components.html. */
const TripTaskCard=({
  variant='trip',tierClass='',action='',label='',lead='',
  title='',detail='',detailTitle='',status='',trail=''
}={})=>{
  if(!['trip','voting','rescheduling'].includes(variant)){
    throw new Error('Unknown TripTaskCard variant: '+variant);
  }
  const isTrip=variant==='trip',isReschedule=variant==='rescheduling';
  const tag=isReschedule?'div':'button';
  const cls=`${isTrip?'row':'trow task'} tier${tierClass?' '+tierClass:''}${isReschedule?' reschedule-row':''}`;
  const attrs=`${isReschedule?' role="group"':` data-a="${action}"`}${label?` aria-label="${label}"`:''}`;
  const copy=`${lead}<div class="gr"><b>${title}</b>${detail?`<div class="cap sm"${detailTitle?` title="${detailTitle}"`:''}>${detail}</div>`:''}${status}</div>`;
  return `<${tag} class="${cls}"${attrs}>${isTrip?copy:`<div class="tmain">${copy}</div>`}${trail}</${tag}>`;
};
