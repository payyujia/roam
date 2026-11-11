/* ROAM local simulated group-chat replies; no backend or AI API. */
const ROAM_CHAT_REPLIES=(function contextChatEngine(){
 /* Local deterministic simulation. Replies never contact a backend or AI service. */
 const patterns=[
  ['disruption',/\b(?:late|delay|delayed|cancel|cancelled|canceled|closed|closure|postpone|reschedule|change of plans|can't make it|cannot make it|won't make it|running behind|stuck)\b/i],
  ['weather',/\b(?:weather|forecast|rain|rains|raining|rainy|thunderstorm|storm|sunny|umbrella)\b/i],
  ['vote',/\b(?:vote|voted|voting|poll|majority|pick an option|decide together)\b/i],
  ['budget',/\b(?:budget|expensive|cheap|cheaper|cost|price|afford|spend|money|sgd|\$\d+)\b/i],
  ['food',/\b(?:food|eat|eating|breakfast|lunch|dinner|supper|snack|hungry|cafe|café|restaurant|halal|vegetarian|dessert|coffee)\b/i],
  ['transport',/\b(?:transport|mrt|train|bus|car|drive|driving|taxi|grab|ferry|parking|walking|travel there|get there|route|commute|traffic)\b/i],
  ['time',/\b(?:what time|timing|meet at|start at|earlier|later|too early|too late|morning|afternoon|evening|\d{1,2}:\d{2}|\d{1,2}\s*(?:am|pm))\b/i],
  ['meeting',/\b(?:where.*meet|where.*gather|meeting point|meet up|meetup|pick.?up point|which exit|where should we go)\b/i],
  ['date',/\b(?:what date|which date|what day|which day|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next week)\b/i],
  ['activities',/\b(?:activity|activities|itinerary|stop|sightseeing|museum|beach|hike|hiking|shopping|what should we do|where should we go first|things to do)\b/i],
  ['greeting',/^(?:hey|hi|hello|yo|sup|good morning|good evening|hey everyone|hi all)[\s!.?]*$/i],
  ['thanks',/\b(?:thanks|thank you|thx|appreciate it)\b/i]
 ];
 const rank={
  disruption:'LREJ',weather:'LRJE',vote:'LJRE',budget:'LREJ',
  food:'EJLR',transport:'RLJE',time:'RLJE',meeting:'RLEJ',
  date:'RLJE',activities:'JELR',greeting:'JERL',thanks:'EJRL',general:'JELR'
 };
 /* Character-specific templates: Raymond is organised, Eustace foodie,
    Ling Ling considers the group, and Jason is adventurous. */
 const messages={
  time:{
   R:'The trip starts at {time} on {day}. Shall we confirm when to meet?',
   E:'{time} works for me! Can we squeeze in a snack? 😄',
   L:'I see {time} on {day}. Let’s make sure everyone can arrive in time.',
   J:'{time} sounds good! More time to explore {stop} ✨'
  },
  timeChange:{
   R:'Our current start is {time}. We can suggest a change and check with everyone.',
   E:'I’m okay moving it, as long as we leave time to eat 😅',
   L:'Let’s ask everyone before shifting the {time} start.',
   J:'I’m flexible! We can adjust the timing for {stop}.'
  },
  meeting:{
   R:'We haven’t picked a meeting point yet. How about somewhere near {stop}?',
   E:'Let’s meet near {stop}—bonus if there’s breakfast nearby 😋',
   L:'Let’s confirm an easy-to-find meeting spot so nobody gets lost.',
   J:'We could meet near {stop} and head there together!'
  },
  meetingKnown:{
   R:'The plan lists {meeting} as our meeting point. Shall we stick with that?',
   E:'{meeting} works as a start. Food after? 😄',
   L:'I see {meeting} in the plan. Let’s make sure everyone knows the location.',
   J:'Let’s meet at {meeting} and head to {stop} together!'
  },
  date:{
   R:'Our trip is set for {day}. Shall we confirm with everyone?',
   E:'{day} sounds good! Hope there’s a good food stop too 😂',
   L:'I have {day} down for {name}. Let’s check everyone’s availability.',
   J:'{day} for {name}? I’m keen!'
  },
  food:{
   R:'There’s no food stop in the plan yet. Shall we add one near {stop}?',
   E:'Food is essential 😋 Let’s find something around {stop}.',
   L:'Let’s choose somewhere that fits everyone’s dietary needs and {budget} each.',
   J:'Maybe a fun café near {stop}?'
  },
  foodKnown:{
   R:'{food} is already in our itinerary. Shall we keep it?',
   E:'Yes please 😂 {food} is on the list already!',
   L:'Let’s check if {food} fits everyone’s dietary needs and {budget} budget.',
   J:'{food} sounds fun! I’m in.'
  },
  transport:{
   R:'Let’s compare MRT, bus and driving options to {stop}.',
   E:'I’m happy with whichever route gets us there without too much hassle 😅',
   L:'Let’s check travel time and transport costs for {name}.',
   J:'I’m keen to travel together! What’s the easiest way to {stop}?'
  },
  transportKnown:{
   R:'The itinerary notes “{route}” for {first}. We should verify it before leaving.',
   E:'I’m happy with whichever route gets us there without too much hassle 😅',
   L:'Let’s check travel time and transport costs for {name}.',
   J:'I’m keen to travel together! What’s the easiest way to {stop}?'
  },
  budget:{
   R:'Our planned budget is {budget} per person. Let’s estimate costs before committing.',
   E:'Let’s save a bit of that {budget} for snacks too 😅',
   L:'We have {budget} per person. I’d verify prices so everyone’s comfortable.',
   J:'We can mix free sights and paid activities to stay around {budget} each!'
  },
  vote:{
   R:'Let’s compare the options in the activity list before finalising the route.',
   E:'I’ll vote once I check the food options 😂 What’s everyone leaning towards?',
   L:'Let’s shortlist activities and give everyone a chance to choose.',
   J:'I’d shortlist {stop}! What do you all think?'
  },
  voteOpen:{
   R:'The trip is still in voting. Let’s compare the choices before finalising.',
   E:'I’ll check the food options before voting 😂',
   L:'Voting is open for {name}. Let’s give everyone a chance to choose.',
   J:'I’d shortlist {stop}! What does everyone think?'
  },
  activities:{
   R:'Let’s look at {stop} and work out how it fits into our schedule.',
   E:'{stop} sounds fun! Let’s leave a break for food 😄',
   L:'I’m up for {stop} if the timing and budget suit everyone.',
   J:'{stop} looks fun! Could be a great photo stop 📸'
  },
  weather:{
   R:'Let’s check the live forecast closer to {day} and prepare a backup.',
   E:'If it rains, a café break could save the day ☕',
   L:'Let’s check the forecast before {day} and find a safe indoor alternative if needed.',
   J:'Hope the weather holds! We could shortlist something indoors just in case.'
  },
  disruption:{
   R:'Got it. Let’s review what needs to change in the {name} itinerary and update everyone.',
   E:'We can adjust! Maybe take a food break while we sort it out 😅',
   L:'Let’s tell everyone about the change and agree on a backup plan.',
   J:'We could look for another activity if {stop} doesn’t work out!'
  },
  greeting:{
   R:'Hey! Are we sorting out the timing for {name}?',
   E:'Heyyy 😄 What’s the food plan for {name}?',
   L:'Hi! Anything we still need to decide for {name}?',
   J:'Hey! Looking forward to {name} 🎉'
  },
  thanks:{R:'All good! Just let us know if plans change.',E:'Anytime 😄',L:'Of course! Let’s keep everyone updated.',J:'No problem! Excited for the trip ✨'},
  general:{
   R:'Sounds good. Shall we check the schedule for {name}?',
   E:'Haha I’m in 😄 What’s the food plan for {name}?',
   L:'Let’s make sure everyone’s happy with our {name} plan.',
   J:'I’m up for it! What else should we do on {name}?'
  }
 };
 const detect=s=>patterns.find(([,pattern])=>pattern.test(s))?.[0]||null;
 const isFollowup=s=>/^(?:what about|how about|and what|or |instead|actually|maybe|could we|can we|what if|okay|ok\b|yes\b|no\b|sure\b|that\b|it\b|same\b|then\b)/i.test(s.trim());
 const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
 const recentTopic=c=>{
  for(const m of (c.m||[]).slice(-10).reverse()){
   if(m[0]!=='P')continue;
   const found=detect(String(m[1]||''));
   if(found&&found!=='greeting'&&found!=='thanks')return found;
  }
  return null;
 };
 const namedStop=(text,t)=>{
  const q=norm(text),words=q.split(' ');
  return (t.stops||[]).find(s=>{
   const name=norm(s.n);
   return name.length>4&&q.includes(name)||name.split(' ').some(word=>word.length>=5&&!['street','museum','beach','park','restaurant'].includes(word)&&words.includes(word));
  })||null;
 };
 const reply=(chat,t,input)=>{
  if(!chat||!t||!String(input||'').trim())return null;
  const members=[...new Set(String(chat.u2||t.m||'').split(''))].filter(k=>'RELJ'.includes(k)&&k.length===1);
  if(!members.length)return null; // No imaginary replies to a solo trip.
  const previous=chat.replyContext||{topic:null,lastSpeaker:null,turn:0,stopName:null};
  const topic=detect(input)||(isFollowup(input)?previous.topic||recentTopic(chat):null)||'general';
  const direct=namedStop(input,t);
  const stop=direct||(t.stops||[]).find(s=>s.n===previous.stopName);
  const first=(t.stops||[])[0],food=(t.stops||[]).find(s=>s.k==='Eat');
  const knownMeeting=t.origin&&t.origin!=='Your location';
  let kind=topic;
  if(topic==='time'&&/\b(?:earlier|later|shift|change)\b/i.test(input))kind='timeChange';
  if(topic==='meeting'&&knownMeeting)kind='meetingKnown';
  if(topic==='food'&&food)kind='foodKnown';
  if(topic==='transport'&&first?.tr)kind='transportKnown';
  if(topic==='vote'&&t.st==='voting')kind='voteOpen';
  const choices=[...(rank[topic]||rank.general)].filter(c=>members.includes(c));
  const speaker=choices.find(c=>c!==previous.lastSpeaker)||choices[0];
  const values={name:t.n||'our trip',day:t.date?fd(t.date):'the planned day',time:t.t1?tt(t.t1):'our start time',budget:t.budget||'our budget',stop:stop?.n||first?.n||'the first stop',first:first?.n||'the first stop',food:food?.n||'a meal stop',meeting:knownMeeting?t.origin:'a meeting point',route:first?.tr||'a suggested route'};
  const text=messages[kind][speaker].replace(/\{(\w+)\}/g,(_,key)=>values[key]||'');
  chat.replyContext={topic,lastSpeaker:speaker,turn:previous.turn+1,stopName:direct?.n||previous.stopName||null};
  return {speaker,text,topic};
 };
 return {reply};
})();
