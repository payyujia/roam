/* ===== COLLECTIONS =====
   Group saved reels into named collections. Prototype only: state lives in S.col, nothing is persisted.
   The heart (S.saved) is "Likes"; the bookmark opens the tray below to file a reel into a collection. */
const inCol=gi=>S.col.some(c=>c.r.includes(gi));
/* Re-render the feed but keep the reel the person is on. */
const reelsRefresh=()=>{const f=$('#s-reels .rfeed'),y=f?f.scrollTop:0;render('reels');const n=$('#s-reels .rfeed');if(n)n.scrollTop=y};
/* Tray: pick a collection (tap again to remove) or start a new one. Reuses .mh header + Row from the other trays. */
const colHTML=gi=>`<div class="mh"><div class="gr"><h2>Save to collection</h2><div class="cap sm">${esc(R[gi].n)}</div></div>${IBtn('x','closeLy','Close')}</div><div class="collection-options" role="group" aria-label="Choose a collection">${S.col.map(c=>{const on=c.r.includes(gi);return `<button type="button" class="cx" role="checkbox" aria-checked="${on}" data-a="coladd:${gi}:${c.id}"><span class="si">${ic('bookmark',20)}</span><span class="gr"><b>${esc(c.n)}</b><span class="cap sm">${c.r.length} reel${c.r.length==1?'':'s'}</span></span><span class="cbx">${on?ic('check',16):''}</span></button>`}).join('')}</div><button type="button" class="cx collection-create" data-a="colnewui:${gi}"><span class="si">${ic('plus',20)}</span><span class="gr"><b>Create new collection</b><span class="cap sm">Name it and add this reel</span></span>${ic('chevron-right',20)}</button><div style="height:16px"></div>`;
const colNewHTML=gi=>`<div class="mh">${IBtn('arrow-left','colback:'+gi,'Back')}<div class="gr"><h2>New collection</h2><div class="cap sm">${esc(R[gi].n)} will be added</div></div>${IBtn('x','closeLy','Close')}</div><div class="pad collection-name-field"><label class="lb" for="cn">Collection name</label><label class="fi" for="cn">${ic('bookmark',18)}<input id="cn" type="text" placeholder="e.g. Date night" maxlength="40" autocomplete="off" onkeydown="if(event.key=='Enter')A.colnew('${gi}')"></label></div><div class="pad" style="margin:16px 0">${Btn('Create and save','colnew:'+gi)}</div>`;
/* Create Trip: keep the form compact, with a scrollable sheet for any number of collections.
   Selections are drafted until Done so dismissing the sheet does not change the form. */
const formCollectionSelectedCount=()=>S.col.filter(c=>(S.formCollectionDraft||[]).includes(c.id)).length;
const formCollectionsSheetHTML=()=>{
 const selected=formCollectionSelectedCount();
 return `<div class="mh form-collection-sheet-header"><div class="gr"><h2>Select collections</h2><span class="cap sm" id="form-collections-count" aria-live="polite">${selected} selected</span></div>${IBtn('x','formColCancel','Close collections')}</div>
 <div class="form-collection-sheet-body" id="form-collection-sheet-body"><div class="collection-options form-collection-sheet-list" role="group" aria-label="Choose reel collections">
 ${S.col.length?S.col.map(c=>{const checked=(S.formCollectionDraft||[]).includes(c.id);return `<button type="button" class="cx" role="checkbox" aria-checked="${checked}" data-a="formColToggle:${encodeURIComponent(c.id)}"><span class="si">${ic('bookmark',20)}</span><span class="gr"><b>${esc(c.n)}</b><span class="cap sm">${c.r.length} reel${c.r.length===1?'':'s'}</span></span><span class="cbx">${ic('check',16)}</span></button>`}).join(''):'<p class="cap sm form-collection-empty">No reel collections yet. Save reels to a collection to include them in a trip.</p>'}
 </div></div>
 <div class="form-collection-sheet-footer">${Btn(`Done · ${selected} selected`,'formColDone')}</div>`;
};
Object.assign(A,{
 rlike:gi=>{gi=+gi;S.saved[gi]=!S.saved[gi];reelsRefresh();toast(S.saved[gi]?'Saved to your Likes':'Removed from your Likes')},
 colopen:gi=>lay('sheet',colHTML(+gi),'Save to collection'),
 colback:gi=>setLy(colHTML(+gi)),
 colnewui:gi=>{setLy(colNewHTML(+gi));setTimeout(()=>{const n=$('#cn');n&&n.focus()},80)},
 coladd:(gi,id)=>{gi=+gi;const c=S.col.find(x=>x.id==id);if(!c)return;const had=c.r.includes(gi);c.r=had?c.r.filter(x=>x!=gi):[...c.r,gi];A.closeLy();reelsRefresh();toast(had?`Removed from ${esc(c.n)}`:`Saved to ${esc(c.n)}`)},
 colnew:gi=>{gi=+gi;const el=$('#cn'),n=(el&&el.value.trim())||'New collection';S.col.push({id:'c'+Date.now(),n,r:[gi]});A.closeLy();reelsRefresh();toast(`Saved to ${esc(n)}`)},
 /* Profile > Saved reels filter */
 colf:v=>{S.colf=v;render('pdet')},
 /* Create-trip form: choose collections in an isolated draft, then apply with Done. */
 formColOpen:()=>{
  S.formCollectionDraft=(S.f.cols||[]).filter(id=>S.col.some(c=>c.id===id));
  lay('sheet',formCollectionsSheetHTML(),'Select reel collections');
  $('#lyc').classList.add('form-collections-sheet');
 },
 formColToggle:value=>{
  if(!Array.isArray(S.formCollectionDraft))return;
  const id=decodeURIComponent(value);
  if(!S.col.some(c=>c.id===id))return;
  const current=S.formCollectionDraft;
  S.formCollectionDraft=current.includes(id)?current.filter(x=>x!==id):[...current,id];
  const row=$('#lyc [data-a="formColToggle:'+encodeURIComponent(id)+'"]');
  if(row)row.setAttribute('aria-checked',String(S.formCollectionDraft.includes(id)));
  const count=formCollectionSelectedCount();
  const caption=$('#form-collections-count');
  if(caption)caption.textContent=count+' selected';
  const done=$('#lyc [data-a="formColDone"]');
  if(done)done.textContent='Done · '+count+' selected';
 },
 formColDone:()=>{
  if(!Array.isArray(S.formCollectionDraft))return;
  S.f.cols=S.col.filter(c=>S.formCollectionDraft.includes(c.id)).map(c=>c.id);
  S.formCollectionDraft=null;
  A.closeLy();
  render('form');
  const trigger=$('#s-form [data-a="formColOpen"]');
  if(trigger)trigger.focus({preventScroll:true});
 },
 formColCancel:()=>{S.formCollectionDraft=null;A.closeLy()},
 /* Legacy handler retained for existing calls outside this new sheet. */
 fcol:id=>{const c=S.f.cols||[];S.f.cols=c.includes(id)?c.filter(x=>x!==id):[...c,id];render('form')}

});
