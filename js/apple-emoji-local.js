/* Optional local emoji artwork for the standalone Roam prototype.
   Place images in assets/apple-emojis/ on your own computer only.
   Artwork is NOT bundled with this repository or downloaded by this script.
   The filename is the emoji's lowercase Unicode code points joined by dashes,
   omitting FE0E/FE0F variation selectors: 😀 -> 1f600.png, ❤️ -> 2764.png.
   PNG and WebP are supported. Missing images retain native Unicode emoji. */
(function(){
 'use strict';
 const BASE='assets/apple-emojis/';
 const segmenter=typeof Intl!=='undefined'&&typeof Intl.Segmenter==='function'
  ?new Intl.Segmenter('en',{granularity:'grapheme'}):null;
 const emojiLike=/[\p{Extended_Pictographic}\p{Regional_Indicator}\u20E3]/u;
 const escapeHtml=value=>String(value).replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'
 })[ch]);
 function filename(glyph){
  return [...String(glyph)].map(c=>c.codePointAt(0))
   .filter(cp=>cp!==0xFE0E&&cp!==0xFE0F)
   .map(cp=>cp.toString(16)).join('-');
 }
 function renderEmoji(glyph){
  const text=String(glyph);
  if(!emojiLike.test(text))return escapeHtml(text);
  const key=filename(text);
  if(!/^[0-9a-f-]+$/.test(key))return escapeHtml(text);
  /* Keep the actual Unicode text underneath; artwork is purely visual. */
  return '<span class="roam-local-emoji">'+
   '<span class="roam-emoji-fallback">'+escapeHtml(text)+'</span>'+
   '<img class="roam-emoji-art" src="'+BASE+key+'.png" alt="" '+
   'aria-hidden="true" loading="lazy" decoding="async">'+
   '</span>';
 }
 function renderText(value){
  const str=String(value??'');
  if(!segmenter)return [...str].map(renderEmoji).join('');
  return Array.from(segmenter.segment(str),part=>renderEmoji(part.segment)).join('');
 }
 /* Capture load/error for dynamically rendered picker cells and chat bubbles.
    Retry a locally saved WebP if PNG is not present; otherwise show Unicode. */
 document.addEventListener('load',event=>{
  const img=event.target;
  if(img?.classList?.contains('roam-emoji-art'))
   img.parentElement?.classList.add('has-art');
 },true);
 document.addEventListener('error',event=>{
  const img=event.target;
  if(!img?.classList?.contains('roam-emoji-art'))return;
  if(!img.dataset.triedWebp){
   img.dataset.triedWebp='1';
   img.src=img.getAttribute('src').replace(/\.png$/i,'.webp');
  }else img.remove();
 },true);
 window.RoamAppleEmoji=Object.freeze({renderEmoji,renderText,filename,basePath:BASE});
})();
