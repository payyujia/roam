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

 let opened=false,shifted=true,numbers=false,capsLock=false,lastShiftTap=0;
 let emojiMode=false,emojiCategory='recent',emojiQuery='';
 const emojiHistory=[];
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
 /* Use the same Return glyph in both themes: this field sends chat messages,
    so a magnifying-glass Search icon would be misleading. */
 const escapeText=v=>String(v).replace(/[&<>"']/g,ch=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
 })[ch]);
 const key=(value,label='',cls='')=>'<button type="button" class="dk-key '+cls+
  '" data-kb-key="'+escapeText(value)+'" aria-label="'+escapeText(label||value)+'">'+
  escapeText(label||value)+'</button>';
 /* System-like emoji picker: categories, search and recently used.
    Labels support accessible buttons and searchable emoji names. */
 const EMOJI_SETS=[
  {id:'smileys',icon:'☺',label:'Smileys & people',items:[
   ['😀','grinning smile'],['😃','happy face'],['😄','grinning happy'],['😁','big grin'],
   ['😆','laughing'],['😅','sweat smile'],['🤣','rolling laugh'],['😂','tears of joy'],
   ['🙂','slight smile'],['🙃','upside down'],['😉','wink'],['😊','blush smiling'],
   ['😇','angel'],['🥰','smiling hearts'],['😍','heart eyes'],['🤩','starstruck'],
   ['😘','kiss'],['😗','kissing'],['😋','delicious yummy'],['😛','tongue'],
   ['🤪','silly'],['😜','winking tongue'],['😎','cool sunglasses'],['🥳','party face'],
   ['😏','smirk'],['🥺','pleading'],['🥹','holding back tears'],['😢','crying'],
   ['😭','sobbing'],['😱','shocked scream'],['😡','angry'],['😴','sleeping'],
   ['🤔','thinking'],['🫠','melting'],['🫶','heart hands'],['👍','thumbs up'],
   ['👎','thumbs down'],['👏','clapping'],['🙏','folded hands'],['👋','waving']
  ]},
  {id:'animals',icon:'🐾',label:'Animals & nature',items:[
   ['🐶','dog'],['🐱','cat'],['🐭','mouse'],['🐹','hamster'],['🐰','rabbit'],
   ['🦊','fox'],['🐻','bear'],['🐼','panda'],['🐨','koala'],['🐯','tiger'],
   ['🦁','lion'],['🐮','cow'],['🐸','frog'],['🐵','monkey'],['🐧','penguin'],
   ['🐦','bird'],['🦄','unicorn'],['🦋','butterfly'],['🐢','turtle'],['🐙','octopus'],
   ['🐬','dolphin'],['🦈','shark'],['🌷','tulip'],['🌹','rose'],['🌸','blossom'],
   ['🌻','sunflower'],['🌲','tree'],['🌴','palm tree'],['🍀','clover'],['🌈','rainbow'],
   ['☀️','sun'],['🌙','moon']
  ]},
  {id:'food',icon:'🍔',label:'Food & drink',items:[
   ['🍎','apple'],['🍓','strawberry'],['🍉','watermelon'],['🍌','banana'],
   ['🥑','avocado'],['🍞','bread'],['🥐','croissant'],['🥨','pretzel'],
   ['🍔','burger'],['🍟','fries'],['🍕','pizza'],['🌮','taco'],
   ['🍣','sushi'],['🍜','noodles ramen'],['🍝','pasta'],['🍱','bento'],
   ['🍚','rice'],['🥟','dumpling'],['🍦','ice cream'],['🍩','donut'],
   ['🍪','cookie'],['🎂','cake'],['🍫','chocolate'],['☕','coffee'],
   ['🧋','bubble tea'],['🍵','tea'],['🥤','drink'],['🍹','cocktail']
  ]},
  {id:'activity',icon:'🏀',label:'Activities',items:[
   ['⚽','soccer'],['🏀','basketball'],['🏈','football'],['⚾','baseball'],
   ['🎾','tennis'],['🏸','badminton'],['🎳','bowling'],['🎮','gaming'],
   ['🎲','dice'],['🎯','target'],['🎨','painting art'],['🎭','theatre'],
   ['🎤','microphone singing'],['🎧','headphones'],['🎵','music'],['🎸','guitar'],
   ['🏆','trophy'],['🥇','gold medal'],['🎉','celebration'],['🎊','confetti'],
   ['🎁','gift'],['🎈','balloon'],['🎬','movie'],['📸','photography'],
   ['🏊','swimming'],['🚴','cycling'],['🥾','hiking'],['🧘','yoga']
  ]},
  {id:'travel',icon:'🚗',label:'Travel & places',items:[
   ['✈️','plane flight'],['🛫','departing plane'],['🚆','train'],
   ['🚇','metro subway'],['🚌','bus'],['🚗','car'],['🚕','taxi'],
   ['🚲','bicycle'],['🛳️','ship cruise'],['🗺️','map'],['📍','location pin'],
   ['🧭','compass'],['🏖️','beach'],['🏝️','island'],['🏔️','mountain'],
   ['🏕️','camping'],['🏙️','city skyline'],['🌇','sunset city'],
   ['🏠','house'],['🏨','hotel'],['🎡','ferris wheel'],['🌉','bridge'],
   ['🗼','tower'],['🛍️','shopping bags'],['🧳','suitcase'],['🛂','passport'],
   ['📅','calendar'],['⏰','clock']
  ]},
  {id:'objects',icon:'💡',label:'Objects',items:[
   ['💡','lightbulb'],['📱','phone'],['💻','laptop'],['⌚','watch'],
   ['📷','camera'],['🔋','battery'],['🔑','key'],['🔒','lock'],
   ['💰','money'],['💳','credit card'],['📦','package'],['🛒','shopping cart'],
   ['📚','books'],['✏️','pencil'],['📝','memo'],['📣','megaphone'],
   ['💌','love letter'],['💬','speech bubble'],['🔔','bell'],
   ['🔎','search'],['🩹','bandage'],['🧸','teddy bear']
  ]},
  {id:'symbols',icon:'❤️',label:'Symbols',items:[
   ['❤️','red heart'],['🧡','orange heart'],['💛','yellow heart'],
   ['💚','green heart'],['💙','blue heart'],['💜','purple heart'],
   ['🩷','pink heart'],['🤍','white heart'],['🖤','black heart'],
   ['💕','two hearts'],['💖','sparkling heart'],['💘','heart arrow'],
   ['💯','hundred'],['✅','check mark'],['❌','cross'],['⚠️','warning'],
   ['❗','exclamation'],['❓','question'],['💤','sleep'],['♻️','recycle'],
   ['⭐','star'],['✨','sparkles'],['🔥','fire'],['💦','water'],
   ['🆗','ok'],['🆕','new']
  ]},
  {id:'flags',icon:'🏳️',label:'Flags',items:[
   ['🇸🇬','Singapore flag'],['🇲🇾','Malaysia flag'],['🇯🇵','Japan flag'],
   ['🇰🇷','Korea flag'],['🇨🇳','China flag'],['🇹🇭','Thailand flag'],
   ['🇦🇺','Australia flag'],['🇺🇸','USA flag'],['🇬🇧','UK flag'],
   ['🇫🇷','France flag'],['🇩🇪','Germany flag'],['🇮🇹','Italy flag'],
   ['🇪🇸','Spain flag'],['🇨🇦','Canada flag'],['🇳🇿','New Zealand flag'],
   ['🇮🇳','India flag'],['🇻🇳','Vietnam flag'],['🇮🇩','Indonesia flag'],
   ['🏳️‍🌈','rainbow flag'],['🏁','checkered flag']
  ]}
 ];
 const FALLBACK_RECENT=['😂','❤️','🥰','😊','😍','🤣','😭','😘','👍','🙏','✨','🔥','😅','🎉','🩷','👀','🥳','🤔','💯','😎','💀','💕','🎈','🫶'];
 const SKIN_TONES={
  '👍':['👍🏻','👍🏼','👍🏽','👍🏾','👍🏿'],
  '👎':['👎🏻','👎🏼','👎🏽','👎🏾','👎🏿'],
  '👏':['👏🏻','👏🏼','👏🏽','👏🏾','👏🏿'],
  '🙏':['🙏🏻','🙏🏼','🙏🏽','🙏🏾','🙏🏿'],
  '👋':['👋🏻','👋🏼','👋🏽','👋🏾','👋🏿'],
  '🫶':['🫶🏻','🫶🏼','🫶🏽','🫶🏾','🫶🏿']
 };
 let skinTimer=null,suppressEmojiTap=false,suppressedEmojiKey=null;
 function showSkinTones(button){
  const emoji=button.dataset.kbKey,tones=SKIN_TONES[emoji];
  if(!tones||!keyboard.getBoundingClientRect)return;
  keyboard.querySelector('.dk-skin-choices')?.remove();
  const popup=document.createElement('div');
  popup.className='dk-skin-choices';
  popup.setAttribute('role','group');
  popup.setAttribute('aria-label','Choose skin tone');
  popup.innerHTML=[emoji,...tones].map((variant,i)=>
   '<button type="button" class="dk-skin-option" data-kb-key="'+escapeText(variant)+
   '" aria-label="'+(i?'Skin tone '+i:'Default skin tone')+'">'+variant+'</button>'
  ).join('');
  const rect=button.getBoundingClientRect(),outer=keyboard.getBoundingClientRect();
  const x=Math.max(8,Math.min(outer.width-236,rect.left-outer.left-100));
  keyboard.style.setProperty('--dk-tone-x',x+'px');
  keyboard.appendChild(popup);
 }

 function allEmojiItems(){
  return EMOJI_SETS.flatMap(group=>group.items);
 }
 function emojiItems(){
  if(emojiQuery.trim()){
   const q=emojiQuery.trim().toLowerCase();
   return allEmojiItems().filter(([glyph,label])=>label.includes(q)||glyph.includes(q));
  }
  if(emojiCategory==='recent'){
   const lookup=new Map(allEmojiItems());
   return [...new Set([...emojiHistory,...FALLBACK_RECENT])].map(glyph=>[
     glyph,lookup.get(glyph)||'Recently used emoji'
   ]);
  }
  return EMOJI_SETS.find(group=>group.id===emojiCategory)?.items||[];
 }
 function updateEmojiGrid(){
  const title=keyboard.querySelector('.dk-emoji-section-title');
  if(title)title.textContent=emojiQuery.trim()?'Search Results':
   emojiCategory==='recent'?'Frequently Used':
   EMOJI_SETS.find(group=>group.id===emojiCategory)?.label||'Emoji';
  const grid=keyboard.querySelector('.dk-emoji-grid');
  if(!grid)return;
  const options=emojiItems();
  grid.innerHTML=options.length?options.map(([emoji,label])=>
   '<button type="button" class="dk-emoji-choice" data-kb-key="'+escapeText(emoji)+
   '" aria-label="'+escapeText(label)+'" title="'+escapeText(label)+'">'+emoji+'</button>'
  ).join(''):'<div class="dk-emoji-empty">No emoji found</div>';
 }
 function drawEmoji(){
  keyboard.innerHTML=
   '<div class="dk-emoji-search-row"><label class="dk-emoji-search-wrap">'+
     '<span class="dk-emoji-search-icon" aria-hidden="true">⌕</span>'+
     '<input type="search" class="dk-emoji-search" placeholder="Search Emoji" aria-label="Search Emoji" autocomplete="off" spellcheck="false" inputmode="none" value="'+escapeText(emojiQuery)+'">'+
   '</label></div>'+
   '<div class="dk-emoji-section-title">Frequently Used</div>'+
   '<div class="dk-emoji-grid" role="group" aria-label="Emoji choices"></div>'+
   '<div class="dk-emoji-categories" role="group" aria-label="Emoji categories">'+
    '<button type="button" class="dk-emoji-abc" data-kb-action="abc" aria-label="Back to letters">ABC</button>'+
    '<button type="button" class="dk-emoji-category'+(emojiCategory==='recent'?' active':'')+
     '" data-kb-action="category" data-kb-category="recent" aria-label="Frequently Used" aria-pressed="'+(emojiCategory==='recent')+'">◷</button>'+
    EMOJI_SETS.map(group=>
     '<button type="button" class="dk-emoji-category'+(emojiCategory===group.id?' active':'')+
      '" data-kb-action="category" data-kb-category="'+group.id+'" aria-label="'+group.label+
      '" aria-pressed="'+(emojiCategory===group.id)+'"><span class="dk-emoji-cat-glyph" aria-hidden="true">'+group.icon+'</span></button>'
    ).join('')+
   '</div>'+
   '<div class="dk-emoji-footer"><span aria-hidden="true">☺</span><span class="dk-emoji-title">Emoji</span>'+ 
   '<button type="button" class="dk-emoji-backspace" data-kb-action="delete" aria-label="Delete last character">'+deleteIcon+'</button></div>';
  updateEmojiGrid();
 }

 /* Render the same four-row iPhone-style typing keyboard for letters,
    numbers and symbols. Keep the chat input editable by real keyboard too. */
 function draw(){
  if(emojiMode){drawEmoji();return}
  const layout=numbers?
   (shifted?
    [
     ['[',']','{','}','#','%','^','*','+','='],
     ['_','\\','|','~','<','>','€','£','¥','•'],
     ['.',',','?','!','\'']
    ]:
    [
     ['1','2','3','4','5','6','7','8','9','0'],
     ['-','/',':',';','(',')','$','&','@','"'],
     ['.',',','?','!','\'']
    ]):
   [['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['z','x','c','v','b','n','m']];
  /* Like iOS "Show Lowercase Keys" turned off: uppercase keycap labels
     stay visually stable; Shift still controls the actual typed character. */
  const chars=row=>row.map(ch=>key(!numbers&&shifted?ch.toUpperCase():ch,
    numbers?ch:ch.toUpperCase(),'dk-char')).join('');
  const shiftLabel=numbers?(shifted?'123':'#+='):'Shift';
  const shiftContent=numbers?(shifted?'123':'#+='):shiftIcon;
  const bottomLabel=numbers?'ABC':'123';
  keyboard.innerHTML=
   '<div class="dk-predict" aria-label="Predictive text suggestions">'+
     '<span>I</span><span>The</span><span>Is</span></div>'+
   '<div class="dk-rows" role="group" aria-label="'+(numbers?'Numbers and symbols':'Letters')+'">'+
     '<div class="dk-row">'+chars(layout[0])+'</div>'+
     '<div class="dk-row'+(numbers?'':' dk-offset')+'">'+chars(layout[1])+'</div>'+
     '<div class="dk-row'+(numbers?' dk-numbers-third':'')+'">'+
       '<button type="button" class="dk-key dk-special dk-shift'+(shifted?' is-on':'')+
        '" data-kb-action="shift" aria-label="'+shiftLabel+'" aria-pressed="'+shifted+'">'+shiftContent+'</button>'+
       chars(layout[2])+
       '<button type="button" class="dk-key dk-special dk-delete" data-kb-action="delete" aria-label="Delete">'+deleteIcon+'</button>'+
     '</div>'+
     '<div class="dk-row dk-bottom">'+
       '<button type="button" class="dk-key dk-special dk-mode" data-kb-action="mode" aria-label="Switch to '+(numbers?'letters':'numbers and symbols')+'">'+bottomLabel+'</button>'+
       '<button type="button" class="dk-key dk-special dk-emoji" data-kb-action="emoji" aria-label="Open emoji keyboard">'+emojiIcon+'</button>'+
       '<button type="button" class="dk-key dk-space" data-kb-key=" " aria-label="Space"><span class="dk-en">EN</span></button>'+
       '<button type="button" class="dk-key dk-return" data-kb-action="send" aria-label="Send message">'+
         '<span class="dk-return-icon">'+returnIcon+'</span></button>'+
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
   shifted=true;numbers=false;emojiMode=false;capsLock=false;lastShiftTap=0;
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
  if(!numbers&&!emojiMode&&shifted&&!capsLock&&/^[a-z]$/i.test(value)){
   shifted=false;draw();
  } else if(!numbers&&!emojiMode&&/[.!?]\s$/.test(input.value)&&!capsLock){
   shifted=true;draw();
  }
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
  clearTimeout(skinTimer);
  const candidate=e.target.closest('.dk-emoji-choice');
  if(!candidate||!SKIN_TONES[candidate.dataset.kbKey]){
   if(!e.target.closest('.dk-skin-choices'))keyboard.querySelector('.dk-skin-choices')?.remove();
   return;
  }
  skinTimer=setTimeout(()=>{
   showSkinTones(candidate);
   suppressEmojiTap=true;
   suppressedEmojiKey=candidate.dataset.kbKey;
  },480);
 });
 keyboard.addEventListener('pointerup',()=>clearTimeout(skinTimer));
 keyboard.addEventListener('pointercancel',()=>clearTimeout(skinTimer));
 keyboard.addEventListener('contextmenu',e=>{
  const candidate=e.target.closest('.dk-emoji-choice');
  if(candidate&&SKIN_TONES[candidate.dataset.kbKey]){
   e.preventDefault();
   showSkinTones(candidate);
  }
 });
 keyboard.addEventListener('click',e=>{
  const control=e.target.closest('button');if(!control)return;
  if(suppressEmojiTap){
   const samePressedEmoji=control.classList.contains('dk-emoji-choice')&&
    control.dataset.kbKey===suppressedEmojiKey;
   suppressEmojiTap=false;
   suppressedEmojiKey=null;
   if(samePressedEmoji)return;
  }
  const action=control.dataset.kbAction;
  if(action==='done'){hide(true);return}
  if(action==='delete'){erase();return}
  if(action==='emoji'){
   emojiMode=true;emojiCategory='recent';emojiQuery='';draw();return;
  }
  if(action==='abc'){
   emojiMode=false;numbers=false;capsLock=false;
   const value=currentInput()?.value||'';
   shifted=!value||/[.!?]\s$/.test(value);
   draw();
   // Returning from emoji search restores physical keyboard typing as well.
   currentInput()?.focus({preventScroll:true});
   return;
  }
  if(action==='category'){
   emojiCategory=control.dataset.kbCategory;
   emojiQuery='';draw();return;
  }
  if(action==='shift'){
   if(numbers){shifted=!shifted;}
   else{
    const now=Date.now();
    if(now-lastShiftTap<360){capsLock=true;shifted=true;}
    else{capsLock=false;shifted=!shifted;}
    lastShiftTap=now;
   }
   draw();return;
  }
  if(action==='mode'){
   numbers=!numbers;
   capsLock=false;
   // Returning from 123 should restore iOS-style auto-capitalisation.
   const value=currentInput()?.value||'';
   shifted=!numbers&&(!value||/[.!?]\s$/.test(value));
   draw();return;
  }
  if(action==='send'){
   const input=currentInput();
   if(input?.value.trim())A.send();
   return;
  }
  if(control.hasAttribute('data-kb-key')){
   const value=control.dataset.kbKey;
   insert(value);
   if(emojiMode){
    emojiHistory.unshift(value);
    if(emojiHistory.length>24)emojiHistory.pop();
    keyboard.querySelector('.dk-skin-choices')?.remove();
    updateEmojiGrid();
   }
  }
 });
 document.addEventListener('focusin',e=>{
  if(e.target.id==='cin')show();
 });
 document.addEventListener('input',e=>{
  if(opened&&e.target.matches?.('#demo-keyboard .dk-emoji-search')){
   emojiQuery=e.target.value;
   updateEmojiGrid();return;
  }
  if(e.target.id!=='cin'||!opened)return;
  updateSend();
  // Match native keyboard case when typing with a physical desktop keyboard.
  if(!numbers&&!capsLock&&!emojiMode){
   const sentenceStart=!e.target.value||/[.!?]\s$/.test(e.target.value);
   if(shifted!==sentenceStart){shifted=sentenceStart;draw();}
  }
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
