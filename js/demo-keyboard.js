/* Roam desktop-only iPhone keyboard for the standalone HTML prototype.
   Real iOS/Android devices use their native keyboard; ?keyboard=demo forces
   the demo in a mobile emulator and ?keyboard=off disables it. */
(()=>{
 const params=new URLSearchParams(location.search);
 const mode=params.get('keyboard');
 const phone=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
 if(mode==='off'||(mode!=='demo'&&phone))return;
 const dev=document.getElementById('dev');
 const thread=document.getElementById('s-thread');
 if(!dev||!thread)return;

 const keyboard=document.createElement('div');
 keyboard.id='demo-keyboard';
 keyboard.className='demo-keyboard';
 keyboard.setAttribute('aria-label','Simulated iPhone keyboard');
 keyboard.hidden=true;
 dev.appendChild(keyboard);

 let opened=false,shifted=false,numbers=false;
 /* Inverse-contrast themes are chosen from the actual chat background.
    ?keyboard-theme=dark|light can force a skin when previewing either design. */
 function brightness(el){
  if(!el)return null;
  const color=getComputedStyle(el).backgroundColor;
  const match=color&&color.match(/^rgba?\(([^)]+)\)/i);
  if(!match)return null;
  const values=match[1].trim().split(/[,\s/]+/).map(Number);
  if(values.length<3||values.slice(0,3).some(n=>!Number.isFinite(n))||
     (values.length>3&&values[3]<.2))return null;
  const [r,g,b]=values;
  return (.2126*r+.7152*g+.0722*b)/255;
 }
 function selectSkin(){
  const forced=params.get('keyboard-theme');
  const lightSurface=(brightness(thread)??brightness(dev)??1)>.57;
  const darkKeys=forced==='dark'||(forced!=='light'&&lightSurface);
  keyboard.classList.toggle('theme-dark',darkKeys);
  keyboard.classList.toggle('theme-light',!darkKeys);
 }
 const shiftIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3 13h5v8h8v-8h5L12 3Z" fill="currentColor" stroke="none"/></svg>';
 const deleteIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H21v16H9L2 12l7-8Z"/><path d="m12 9 6 6m0-6-6 6"/></svg>';
 const globeIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg>';
 const micIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8"/></svg>';
 /* Monochrome icons match the supplied iPhone screenshots. The display
    differs by skin; both bottom action icons still send the chat message. */
 const emojiIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="8.7" cy="9.2" r="1.25" fill="var(--dk-emoji-cutout)"/><circle cx="15.3" cy="9.2" r="1.25" fill="var(--dk-emoji-cutout)"/><path d="M6.5 13.2c.7 3.1 3.1 5 5.5 5s4.8-1.9 5.5-5" fill="none" stroke="var(--dk-emoji-cutout)" stroke-width="1.7" stroke-linecap="round"/></svg>';
 const returnIcon='<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M22 6v11a4 4 0 0 1-4 4H6m0 0 6-6m-6 6 6 5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 const searchIcon='<svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="12.4" cy="12.4" r="7.8" fill="none" stroke="currentColor" stroke-width="2.1"/><path d="m18.3 18.3 6.3 6.3" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"/></svg>';
 const escapeText=v=>String(v).replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[ch]);
 const key=(value,label='',cls='')=>'<button type="button" class="dk-key '+cls+
  '" data-kb-key="'+escapeText(value)+'" aria-label="'+escapeText(label||value)+'">'+
  escapeText(label||value)+'</button>';
 /* The iPhone typing keyboard uses the same rectangular key grid for
    letters, numbers and symbols. 123 must never open the Phone app dial pad. */
 function draw(){
  const layouts=numbers?
   (shifted?
    [
     ['[',']','{','}','#','%','^','*','+','='],
     ['_','\\','|','~','<','>','€','£','¥','•'],
     ['. ',',','?','!','\u0027']
    ]:
    [
     ['1','2','3','4','5','6','7','8','9','0'],
     ['-','/',':',';','(',')','$','&','@','"'],
     ['.',',','?','!','\u0027']
    ]):
   [
    [...'qwertyuiop'],
    [...'asdfghjkl'],
    [...'zxcvbnm']
   ];
  const cap=value=>numbers?value:(shifted?value.toUpperCase():value.toUpperCase());
  const letters=row=>row.map(x=>key(numbers?x:shifted?x.toUpperCase():x,cap(x))).join('');
  const bottomMode=numbers?'ABC':'123';
  const modifierLabel=numbers?(shifted?'123':'#+='):'Shift';
  const modifierGlyph=numbers?(shifted?'123':'#+='):shiftIcon;
  keyboard.innerHTML=
   '<div class="dk-predict" aria-label="Predictive text suggestions">'+
    '<span>I</span><span>The</span><span>Is</span></div>'+
   '<div class="dk-rows" role="group" aria-label="'+(numbers?'Numbers and symbols':'Letters')+'">'+
    '<div class="dk-row">'+letters(layouts[0])+'</div>'+
    '<div class="dk-row'+(numbers?'':' dk-offset')+'">'+letters(layouts[1])+'</div>'+
    '<div class="dk-row'+(numbers?' dk-numbers-third':'')+'">'+
     '<button type="button" class="dk-key dk-special dk-shift'+(shifted?' is-on':'')+
      '" data-kb-action="shift" aria-label="'+modifierLabel+'" aria-pressed="'+shifted+'">'+modifierGlyph+'</button>'+
     letters(layouts[2])+
     '<button type="button" class="dk-key dk-special dk-delete" data-kb-action="delete" aria-label="Delete">'+deleteIcon+'</button>'+
    '</div>'+
    '<div class="dk-row dk-bottom">'+
     '<button type="button" class="dk-key dk-special dk-mode" data-kb-action="mode" aria-label="Switch to '+(numbers?'letters':'numbers')+'">'+bottomMode+'</button>'+
     '<button type="button" class="dk-key dk-special dk-emoji" data-kb-key="😊" aria-label="Emoji">'+emojiIcon+'</button>'+
     '<button type="button" class="dk-key dk-space" data-kb-key=" " aria-label="Space"><span class="dk-en">EN</span></button>'+
     '<button type="button" class="dk-key dk-return" data-kb-action="send" aria-label="Send message"><span class="dk-return-dark">'+returnIcon+'</span><span class="dk-return-light">'+searchIcon+'</span></button>'+
    '</div>'+
   '</div>'+
   '<div class="dk-accessories" aria-hidden="true"><span class="dk-globe">'+globeIcon+'</span><span class="dk-mic">'+micIcon+'</span></div>';
  updateSend();
 }
 function updateSend(){
  const button=keyboard.querySelector('.dk-return');
  if(button)button.classList.toggle('has-text',!!currentInput()?.value.trim());
 }
 const currentInput=()=>document.querySelector('#s-thread.on #cin');
 function scrollEnd(){
  // Scroll after the keyboard/composer layout has finished recalculating.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(!opened)return;
   const el=document.querySelector('#s-thread.on #msgs');
   if(el)el.scrollTop=el.scrollHeight;
  }));
 }
 function show(){
  if(typeof topId==='function'&&topId()!=='thread')return;
  if(!currentInput())return;
  if(!opened){
   opened=true;
   keyboard.hidden=false;
   dev.classList.add('demo-keyboard-open');
   shifted=false;numbers=false;
   selectSkin();draw();
  }
  scrollEnd();
 }
 function hide(blur=false){
  if(!opened)return;
  opened=false;
  dev.classList.remove('demo-keyboard-open');
  keyboard.hidden=true;
  if(blur&&document.activeElement?.id==='cin')document.activeElement.blur();
 }
 function insert(value){
  const input=currentInput();if(!input)return;
  input.focus({preventScroll:true});
  const start=input.selectionStart??input.value.length;
  const end=input.selectionEnd??start;
  input.setRangeText(value,start,end,'end');
  input.dispatchEvent(new Event('input',{bubbles:true}));
  if(shifted&&!numbers){shifted=false;draw()}
 }
 function erase(){
  const input=currentInput();if(!input)return;
  input.focus({preventScroll:true});
  const end=input.selectionEnd??input.value.length;
  let start=input.selectionStart??end;
  if(start===end&&start>0){
   const chars=Array.from(input.value.slice(0,start));
   start-=chars[chars.length-1]?.length||1;
  }
  input.setRangeText('',start,end,'end');
  input.dispatchEvent(new Event('input',{bubbles:true}));
 }
 keyboard.addEventListener('pointerdown',e=>{
  if(e.target.closest('button'))e.preventDefault(); // retain input focus
 });
 keyboard.addEventListener('click',e=>{
  const control=e.target.closest('button');if(!control)return;
  const action=control.dataset.kbAction;
  if(action==='done'){hide(true);return}
  if(action==='delete'){erase();return}
  if(action==='shift'){shifted=!shifted;draw();return}
  if(action==='mode'){numbers=!numbers;shifted=false;draw();return}
  if(action==='send'){
   const input=currentInput();
   if(input?.value.trim())A.send();
   return;
  }
  if(control.hasAttribute('data-kb-key'))insert(control.dataset.kbKey);
 });
 document.addEventListener('focusin',e=>{
  if(e.target.id==='cin')show();
 });
 document.addEventListener('input',e=>{
  if(e.target.id==='cin'&&opened)updateSend();
 });
 window.addEventListener('resize',()=>{if(opened)selectSkin()});
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&opened){
   e.preventDefault();e.stopPropagation();hide(true);
  }
 },true);
 // Clicking outside the composer dismisses the demonstration keyboard.
 document.addEventListener('pointerdown',e=>{
  if(!opened||e.target.closest('#demo-keyboard,#s-thread .comp'))return;
  hide(true); // blur so clicking Message again always reopens the keyboard
 },true);
 // Rerendering the thread after sending/receiving a message replaces #cin.
 // Keep the keyboard visible and restore focus to that new editable field.
 const observer=new MutationObserver(()=>{
  if(!opened)return;
  if(typeof topId==='function'&&topId()!=='thread'){hide(false);return}
  selectSkin();
  updateSend();
  const field=currentInput();
  if(field&&document.activeElement!==field){
   requestAnimationFrame(()=>{
    if(opened&&field.isConnected&&document.activeElement!==field){
     field.focus({preventScroll:true});scrollEnd();
    }
   });
  }
 });
 observer.observe(thread,{childList:true,attributes:true,attributeFilter:['class']});
 draw();
})();
