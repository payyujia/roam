/* ===== COLLECTIONS =====
   Group saved reels into named collections. Prototype only: state lives in S.col, nothing is persisted.
   The heart (S.saved) is "Likes"; the bookmark opens the tray below to file a reel into a collection. */
const inCol=gi=>S.col.some(c=>c.r.includes(gi));
/* Re-render the feed but keep the reel the person is on. */
const reelsRefresh=()=>{const f=$('#s-reels .rfeed'),y=f?f.scrollTop:0;render('reels');const n=$('#s-reels .rfeed');if(n)n.scrollTop=y};
/* Tray: pick a collection (tap again to remove) or start a new one. Reuses .mh header + Row from the other trays. */
const colHTML=gi=>`<div class="mh"><div class="gr"><h2>Save to collection</h2><div class="cap sm">${esc(R[gi].n)}</div></div>${IBtn('x','closeLy','Close')}</div>${S.col.map(c=>{const on=c.r.includes(gi);return Row({a:`coladd:${gi}:${c.id}`,lead:`<div class="si">${ic('bookmark',20,on?'currentColor':'none')}</div>`,title:esc(c.n),sub:`${c.r.length} reel${c.r.length==1?'':'s'}`,trail:ic(on?'check':'plus',20)})}).join('')}${Row({a:'colnewui:'+gi,lead:`<div class="si">${ic('plus',20)}</div>`,title:'Create new collection',sub:'Name it and add this reel',trail:ic('chevron-right',20)})}<div style="height:16px"></div>`;
const colNewHTML=gi=>`<div class="mh">${IBtn('arrow-left','colback:'+gi,'Back')}<div class="gr"><h2>New collection</h2><div class="cap sm">${esc(R[gi].n)} will be added</div></div>${IBtn('x','closeLy','Close')}</div><div class="pad"><label class="lb" for="cn">Name</label><div class="fld">${ic('bookmark',17)}<input class="in" id="cn" placeholder="e.g. Date night" maxlength="40" autocomplete="off" onkeydown="if(event.key=='Enter')A.colnew('${gi}')"></div></div><div class="pad" style="margin:16px 0">${Btn('Create and save','colnew:'+gi)}</div>`;
Object.assign(A,{
 rlike:gi=>{gi=+gi;S.saved[gi]=!S.saved[gi];reelsRefresh();toast(S.saved[gi]?'Saved to your Likes':'Removed from your Likes')},
 colopen:gi=>lay('sheet',colHTML(+gi),'Save to collection'),
 colback:gi=>setLy(colHTML(+gi)),
 colnewui:gi=>{setLy(colNewHTML(+gi));setTimeout(()=>{const n=$('#cn');n&&n.focus()},80)},
 coladd:(gi,id)=>{gi=+gi;const c=S.col.find(x=>x.id==id);if(!c)return;const had=c.r.includes(gi);c.r=had?c.r.filter(x=>x!=gi):[...c.r,gi];A.closeLy();reelsRefresh();toast(had?`Removed from ${esc(c.n)}`:`Saved to ${esc(c.n)}`)},
 colnew:gi=>{gi=+gi;const el=$('#cn'),n=(el&&el.value.trim())||'New collection';S.col.push({id:'c'+Date.now(),n,r:[gi]});A.closeLy();reelsRefresh();toast(`Saved to ${esc(n)}`)},
 /* Profile > Saved reels filter */
 colf:v=>{S.colf=v;render('pdet')},
 /* Create-trip form: which collections feed the recommendations */
 fcol:id=>{const c=S.f.cols||[];S.f.cols=c.includes(id)?c.filter(x=>x!=id):[...c,id];render('form')}
});
