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
 const alpha=[...'qwertyuiop',...'asdfghjkl',...'zxcvbnm'];
 const escapeText=v=>String(v).replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[ch]);
 const key=(value,label='',cls='')=>'<button type="button" class="dk-key '+cls+
  '" data-kb-key="'+escapeText(value)+'" aria-label="'+escapeText(label||value)+'">'+
  escapeText(label||value)+'</button>';
 function draw(){
  const a=numbers?
   (shifted?
    [['[',']','{','}','#','%','^','*','+','='],
     ['~','<','>','€','£','¥','•','_','|'],
     ['.',',','?',':',';','!','/','@',"'"]]:
    [['1','2','3','4','5','6','7','8','9','0'],
     ['@','#','$','%','&','-','+','(',')','/'],
     ['*','"',"'",':',';','!','?',',','.']]):
   ['qwertyuiop'.split(''),'asdfghjkl'.split(''),'zxcvbnm'.split('')];
  const letters=arr=>arr.map(x=>key(shifted&&!numbers?x.toUpperCase():x)).join('');
  keyboard.innerHTML='<div class="dk-toolbar">'+
   '<span class="dk-language">English (US)</span>'+
   '<button type="button" class="dk-done" data-kb-action="done">Done</button></div>'+
   '<div class="dk-rows" role="group" aria-label="Keyboard keys">'+
    '<div class="dk-row">'+letters(a[0])+'</div>'+
    '<div class="dk-row dk-offset">'+letters(a[1])+'</div>'+
    '<div class="dk-row">'+
     '<button type="button" class="dk-key dk-special" data-kb-action="shift" aria-label="Shift">'+(numbers?(shifted?'123':'#+='):'⇧')+'</button>'+
     letters(a[2])+
     '<button type="button" class="dk-key dk-special" data-kb-action="delete" aria-label="Delete">⌫</button>'+
    '</div>'+
    '<div class="dk-row dk-bottom">'+
     '<button type="button" class="dk-key dk-special dk-mode" data-kb-action="mode">'+(numbers?'ABC':'?123')+'</button>'+
     '<button type="button" class="dk-key dk-special dk-emoji" data-kb-key="😊" aria-label="Emoji">☺</button>'+
     '<button type="button" class="dk-key dk-space" data-kb-key=" " aria-label="Space">space</button>'+
     '<button type="button" class="dk-key dk-send" data-kb-action="send">send</button>'+
    '</div>'+
   '</div>';
 }
 const currentInput=()=>document.querySelector('#s-thread.on #cin');
 function scrollEnd(){
  requestAnimationFrame(()=>{
   const el=document.querySelector('#s-thread.on #msgs');
   if(el)el.scrollTop=el.scrollHeight;
  });
 }
 function show(){
  if(typeof topId==='function'&&topId()!=='thread')return;
  if(!currentInput())return;
  if(!opened){
   opened=true;
   keyboard.hidden=false;
   dev.classList.add('demo-keyboard-open');
   shifted=false;numbers=false;draw();
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
