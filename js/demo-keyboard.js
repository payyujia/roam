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
 const deleteIcon='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4.8h10.3a1.5 1.5 0 0 1 1.5 1.5v11.4a1.5 1.5 0 0 1-1.5 1.5H9.5L2.8 12l6.7-7.2Z"/><path d="m12.1 9.4 5.4 5.2m0-5.2-5.4 5.2"/></svg>';
 const globeIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg>';
 const micIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4m-4 0h8"/></svg>';
 /* Monochrome icons match the supplied iPhone screenshots. The display
    differs by skin; both bottom action icons still send the chat message. */
 const emojiIcon='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10.25" fill="currentColor"/><circle cx="8.6" cy="9.5" r="1.1" fill="var(--dk-emoji-cutout)"/><circle cx="15.4" cy="9.5" r="1.1" fill="var(--dk-emoji-cutout)"/><path d="M6.6 13.15c.65 3.9 2.8 5.95 5.4 5.95s4.75-2.05 5.4-5.95c-3.2 1.1-7.6 1.1-10.8 0Z" fill="var(--dk-emoji-cutout)"/><path d="M7.45 14.2c3.05.85 6.05.85 9.1 0" stroke="currentColor" stroke-width="1.05" stroke-linecap="round" fill="none"/></svg>';
 /* The reference's iOS Return glyph hooks from a short top bar into a
    left-pointing arrow. The previous glyph had an overly tall vertical stem. */
 /* Minimal bent Return arrow, proportioned to the subdued iOS key glyph. */
 const returnIcon='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M19.7 5.7v7.5a3.3 3.3 0 0 1-3.3 3.3H5.1"/><path d="m9.7 11.9-4.6 4.6 4.6 4.4"/></svg>';
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


 /* Offline QuickType-like predictions. No network or AI service is required:
    completions, context-sensitive next words, and common typo corrections
    update from the real chat input (including physical keyboard typing).
    This does not claim to reproduce Apple's proprietary prediction model. */
 const PREDICTION_LEXICON=(
  "the to and a i you it is in of for on with we are was be have has had do did " +
  "can could would should will shall may might not no yes yeah okay ok hi hey hello " +
  "thanks thank please sorry sure great good nice awesome amazing perfect wonderful " +
  "today tomorrow yesterday tonight morning afternoon evening weekend monday tuesday " +
  "wednesday thursday friday saturday sunday january february march april june july " +
  "august september october november december day days week weeks month months year " +
  "years time times date dates schedule plan plans planning trip trips travel travelling " +
  "vacation holiday holidays itinerary itineraries activity activities event events " +
  "vote voting voted review reviewing reminder reminders tomorrow morning today tonight " +
  "meeting meet meeting going go goes gone come coming arrives arrive arriving leave " +
  "leaving left start starting starts finish finished finishing end ending ends " +
  "ready done completed checked confirmed booked booking book reservation reserved " +
  "restaurant restaurants dinner lunch breakfast brunch supper food snacks snack drink " +
  "drinks coffee tea water bubbletea dessert desserts pizza burgers dimsum sushi noodles " +
  "chicken rice fish cafe cafes place places location locations destination destinations " +
  "there here where when which what who why how whose we're you're they're it's that's " +
  "i'm i'll i've don't doesn't didn't can't won't wouldn't shouldn't haven't hasn't " +
  "couldn't let's let's bring bringing brought buy buying bought get getting got " +
  "take taking taken pick picking picked check checking checked send sending sent " +
  "tell telling told ask asking asked reply replying replied message messages group " +
  "chat chats friend friends people everyone somebody anybody someone someone else " +
  "together alone early late later soon now next last first second third another " +
  "more most much many few several all any some something anything everything nothing " +
  "this that these those each every our their your my mine yours theirs his her hers " +
  "he she they them us me him her his his own same different other others both " +
  "really very quite pretty definitely absolutely probably maybe perhaps certainly " +
  "actually basically personally seriously literally exactly nearly almost around " +
  "about because since although however but or if then so therefore while still " +
  "before after until during between across above below under over through near " +
  "inside outside around away back front right left up down out into from by as at " +
  "better best worse worst fine fun cool lovely happy excited tired busy free available " +
  "possible impossible sure unsure excited quick quickly slow slowly fast faster " +
  "agree agreed agreeing sounds sound sounded think thinking thought know knowing knew " +
  "help helpful helping helped held hello helicopter helmet hellos " +
  "here where there then these them their though thorough through throw threw three " +
  "trying try tried truly true trust trusted trick tricky tree train trains training " +
  "thank thankful thankfully goodness goodnight goodbye great greater greatest " +
  "happen happened happening happens happiness happy happily " +
  "like liked liking love loved loving want wanted wanting need needed needing hope hoping " +
  "feel feeling felt look looking looked see seeing seen saw show showing showed " +
  "say saying said write writing wrote read reading listen listening heard hear " +
  "walk walking walked run running ran drive driving drove driven ride riding " +
  "car cars taxi train bus buses mrt subway flight flights plane airport station " +
  "meetup pickup pick-up drop-off travel time duration minute minutes hour hours " +
  "address contact contacts profile details information info update updates updated " +
  "change changed changing move moved moving reschedule rescheduled delay delayed " +
  "confirm confirmation cancelled cancel cancelling accepted accept decline declined " +
  "join joining joined invite invitation invited thankyou please asap tomorrow " +
  "Singapore Malaysia Japan Korea Tokyo China Johor Bahru MacRitchie Sentosa " +
  "hiking hike trail trails mountain mountains nature beach beaches park parks " +
  "city cities shopping shop shops mall malls museum museums sightseeing game gaming " +
  "reading gaming movies movie music concert festival night market markets " +
  "birthday congratulations congrats celebration celebrate celebrating " +
  "photos pictures picture image images photo selfie photoshoot camera " +
  "home house school university class classes work working office project projects " +
  "task tasks assignment assignments report presentation presentations slides " +
  "test tests testing exam exams study studying lesson lessons lecture lectures " +
  "computer keyboard typing type typed word words text texts spelling autocorrect " +
  "suggest suggestion suggestions predictive prediction predictions complete completion " +
  "hello hey hello hi hello there goodmorning goodnight goodafternoon " +
  "this is what happened yesterday"
 ).split(/\s+/).filter(Boolean);
 const NEXT_WORDS={
  i:['am','think','will','want','can'],you:['can','are','should','know'],we:['can','are','should','will'],
  they:['are','will','can'],he:['is','will','was'],she:['is','was','will'],
  it:['is','was','will'],this:['is','looks','sounds'],that:['is','sounds','was'],
  the:['trip','next','best'],a:['little','good','great'],an:['amazing','early','idea'],
  how:['are','about','do'],what:['time','about','do'],when:['are','is','will'],
  where:['are','is','should'],who:['is','can','will'],why:['not','are','is'],
  are:['you','we','they'],is:['the','it','there'],can:['you','we','i'],
  could:['you','we','i'],would:['you','like','we'],should:['we','i','you'],
  do:['you','we','i'],did:['you','we','they'],will:['you','be','we'],
  let:['me','us','them'],lets:['go','meet','do'],want:['to','it','some'],
  going:['to','home','there'],looking:['forward','good','for'],
  see:['you','the','it'],meet:['you','at','there'],pick:['up','a','the'],
  thank:['you','god','everyone'],thanks:['for','so','everyone'],
  sounds:['good','great','fun'],looks:['good','great','like'],
  good:['morning','night','idea'],happy:['birthday','to','holidays'],
  tomorrow:['morning','afternoon','night'],today:['at','is','we'],
  coming:['soon','tomorrow','with'],bring:['some','the','it'],
  check:['the','with','it'],vote:['on','for','today'],
  trip:['to','is','planning'],hello:['there','everyone','how'],
  hi:['there','everyone','how'],help:['me','with','you'],ready:['to','for','now'],
  in:['the','Singapore','a'],on:['the','my','our'],at:['the','home','around'],
  to:['the','go','see'],for:['the','you','us']
 };
 const COMMON_CORRECTIONS={
  teh:'the',thier:'their',recieve:'receive',recieved:'received',
  tommorow:'tomorrow',tommorow:'tomorrow',tommorrow:'tomorrow',
  becuase:'because',thansk:'thanks',hllo:'hello',helo:'hello',
  definitly:'definitely',definately:'definitely',wierd:'weird',
  accomodation:'accommodation',resturant:'restaurant',remeber:'remember',
  probaly:'probably',thnk:'think',woud:'would',coud:'could',
  shoud:'should',gud:'good',gonna:'going',pls:'please'
 };
 const uniqueWords=[...new Set(PREDICTION_LEXICON.map(w=>w.toLowerCase()))];
 function contextAtCursor(){
  const field=currentInput();
  if(!field)return {start:0,end:0,partial:'',word:'',previous:''};
  const caret=field.selectionStart??field.value.length;
  const before=field.value.slice(0,caret),after=field.value.slice(caret);
  const match=before.match(/[A-Za-z]+(?:['’][A-Za-z]*)?$/);
  const partial=match?match[0]:'';
  const start=caret-partial.length;
  const right=after.match(/^[A-Za-z’']*/)?.[0]||'';
  const prev=before.slice(0,start).match(/([A-Za-z]+)(?:[^A-Za-z]+)?$/);
  const noWordBefore=before.match(/([A-Za-z]+)(?:[^A-Za-z]+)?$/);
  return {start,end:caret+right.length,partial,word:partial+right,
   previous:(partial?prev?.[1]:noWordBefore?.[1]||'')?.toLowerCase()||''};
 }
 function matchCase(word,typed){
  if(!typed)return word;
  if(typed===typed.toUpperCase()&&typed.length>1)return word.toUpperCase();
  return typed[0]===typed[0].toUpperCase()?
    word[0].toUpperCase()+word.slice(1):word;
 }
 function predictionList(){
  const c=contextAtCursor(),typed=c.partial,lower=typed.toLowerCase();
  if(emojiMode||numbers)return [];
  if(!typed){
   const following=NEXT_WORDS[c.previous]||['I','The','Is'];
   return following.slice(0,3);
  }
  // Keep the actual typed text as the first choice; offer completions beside it.
  const found=[];
  function add(word){
   if(!word)return;
   const formatted=matchCase(word,typed);
   if(!found.some(x=>x.toLowerCase()===formatted.toLowerCase()))
    found.push(formatted);
  }
  const corrected=COMMON_CORRECTIONS[lower];
  // Keep the user's exact spelling available alongside suggested corrections.
  add(typed);
  if(corrected)add(corrected);
  const contextual=NEXT_WORDS[c.previous]||[];
  contextual.filter(w=>w.startsWith(lower)).forEach(add);
  uniqueWords.filter(w=>w.startsWith(lower)&&w!==lower).slice(0,8).forEach(add);
  if(corrected){
   uniqueWords.filter(w=>w.startsWith(corrected)&&w!==corrected).slice(0,3).forEach(add);
  }
  if(found.length<3&&lower.length>2){
   uniqueWords.filter(w=>w!==lower&&w.includes(lower)).slice(0,3).forEach(add);
  }
  // Keep any unused slots empty instead of inventing nonsense word endings.
  while(found.length<3)found.push('');
  return found.slice(0,3);
 }
 function updatePredictions(){
  const bar=keyboard.querySelector('.dk-predict');
  if(!bar||!opened)return;
  const suggestions=predictionList();
  bar.innerHTML=suggestions.map(word=>word?
   '<button type="button" class="dk-prediction" data-kb-suggest="'+escapeText(word)+
   '" aria-label="Use suggestion '+escapeText(word)+'">'+escapeText(word)+'</button>':
   '<span class="dk-prediction dk-prediction-empty" aria-hidden="true"></span>'
  ).join('');
 }
 function acceptPrediction(word){
  const field=currentInput();
  if(!field||!word)return;
  const c=contextAtCursor();
  field.focus({preventScroll:true});
  const existing=field.value;
  const replaceStart=c.partial?c.start:field.selectionStart??existing.length;
  const replaceEnd=c.partial?c.end:field.selectionEnd??replaceStart;
  const following=existing.slice(replaceEnd);
  // iOS-like suggestion tap completes the word and leaves a space ready for typing.
  const space=/^[\s.,!?;:]/.test(following)?'':' ';
  const replacement=word+space;
  field.setRangeText(replacement,replaceStart,replaceEnd,'end');
  field.dispatchEvent(new Event('input',{bubbles:true}));
  updatePredictions();
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
   '<div class="dk-predict" role="group" aria-label="Predictive text suggestions"></div>'+
   '<div class="dk-rows" role="group" aria-label="'+(numbers?'Numbers and symbols':'Letters')+'">'+
     '<div class="dk-row">'+chars(layout[0])+'</div>'+
     '<div class="dk-row'+(numbers?'':' dk-offset')+'">'+chars(layout[1])+'</div>'+
     '<div class="dk-row'+(numbers?' dk-numbers-third':'')+'">'+
       '<button type="button" class="dk-key dk-special dk-shift'+(shifted?' is-on':'')+
        '" data-kb-action="shift" aria-label="'+shiftLabel+'" aria-pressed="'+shifted+'">'+shiftContent+'</button>'+
       chars(layout[2])+
       '<button type="button" class="dk-key dk-special dk-delete" data-kb-action="delete" aria-label="Delete"><span class="dk-key-icon">'+deleteIcon+'</span></button>'+
     '</div>'+
     '<div class="dk-row dk-bottom">'+
       '<button type="button" class="dk-key dk-special dk-mode" data-kb-action="mode" aria-label="Switch to '+(numbers?'letters':'numbers and symbols')+'">'+bottomLabel+'</button>'+
       '<button type="button" class="dk-key dk-special dk-emoji" data-kb-action="emoji" aria-label="Open emoji keyboard"><span class="dk-key-icon">'+emojiIcon+'</span></button>'+
       '<button type="button" class="dk-key dk-space" data-kb-key=" " aria-label="Space"><span class="dk-en">EN</span></button>'+
       '<button type="button" class="dk-key dk-return" data-kb-action="send" aria-label="Send message">'+
         '<span class="dk-key-icon dk-return-icon">'+returnIcon+'</span></button>'+
     '</div>'+
   '</div>'+
   '<div class="dk-accessories" aria-hidden="true"><span class="dk-globe">'+globeIcon+'</span><span class="dk-mic">'+micIcon+'</span></div>';
  updateSend();
  updatePredictions();
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
  if(control.hasAttribute('data-kb-suggest')){
   acceptPrediction(control.dataset.kbSuggest);return;
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
  updatePredictions();
  // Match native keyboard case when typing with a physical desktop keyboard.
  if(!numbers&&!capsLock&&!emojiMode){
   const sentenceStart=!e.target.value||/[.!?]\s$/.test(e.target.value);
   if(shifted!==sentenceStart){shifted=sentenceStart;draw();}
  }
 });
 window.addEventListener('resize',()=>{if(opened)selectSkin()});
 document.addEventListener('click',e=>{
  if(opened&&e.target.id==='cin')updatePredictions();
 },true);
 document.addEventListener('keyup',e=>{
  if(opened&&e.target.id==='cin')updatePredictions();
 },true);
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
