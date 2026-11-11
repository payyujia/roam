'use strict';
/* Run with: node --test tests/chat-replies.test.cjs */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const script=fs.readFileSync(path.join(__dirname,'../js/chat-replies.js'),'utf8');
const sandbox={
 fd:()=> 'Sun 15 Nov',
 tt:()=> '8:30 am'
};
vm.runInNewContext(script+'\nthis.bot=ROAM_CHAT_REPLIES;',sandbox);
const bot=sandbox.bot;
const trip={
 n:'MacRitchie Hike',date:new Date(2026,10,15),t1:'08:30',
 budget:'SGD 300',origin:'Your location',m:'PRE',st:'voting',
 stops:[
  {n:'TreeTop Walk',k:'Do',tr:'15 min by car'},
  {n:'The Roti Prata House',k:'Eat',tr:'8 min walk'}
 ]
};
const chat=(members='PRE')=>({u2:members,m:[]});

test('uses the itinerary time in a reply from Raymond',()=>{
 const r=bot.reply(chat('PR'),trip,'What time should we meet?');
 assert.equal(r.speaker,'R');
 assert.equal(r.topic,'time');
 assert.match(r.text,/8:30 am/);
});

test('can discuss shifting time without inventing a new one',()=>{
 const r=bot.reply(chat('PR'),trip,'Can we go earlier?');
 assert.equal(r.topic,'time');
 assert.match(r.text,/current|starts/i);
});

test('uses the real food stop and Eustace personality',()=>{
 const r=bot.reply(chat('PE'),trip,'Any lunch ideas?');
 assert.equal(r.speaker,'E');
 assert.equal(r.topic,'food');
 assert.match(r.text,/The Roti Prata House/);
});

test('uses budget and Ling Ling personality',()=>{
 const r=bot.reply(chat('PL'),trip,'How much can we spend?');
 assert.equal(r.speaker,'L');
 assert.match(r.text,/SGD 300/);
});

test('uses group members, excluding people not invited',()=>{
 const c=chat('PRE');
 for(const text of ['Hello','Food?','MRT or bus?','What if it rains?']){
  const r=bot.reply(c,trip,text);
  assert.ok(['R','E'].includes(r.speaker));
  c.m.push(['P',text],[r.speaker,r.text]);
 }
});

test('maintains a previous conversation topic for ambiguous follow-ups',()=>{
 const c=chat('PE');
 c.m.push(['P','Any lunch ideas?']);
 const r=bot.reply(c,trip,'What about that instead?');
 assert.equal(r.topic,'food');
});

test('discusses weather without claiming access to live forecasts',()=>{
 const r=bot.reply(chat('PL'),trip,'What if it rains?');
 assert.equal(r.topic,'weather');
 assert.match(r.text,/forecast|indoor|weather/i);
});

test('keeps replies tied to the correct trip and proposed activities',()=>{
 const t={...trip,n:'China 3D2N',stops:[{n:'Chengdu Panda Base',k:'Do'}]};
 const r=bot.reply(chat('PJ'),t,'Should we add the panda activity?');
 assert.equal(r.speaker,'J');
 assert.match(r.text,/Chengdu Panda Base/);
});

test('does not simulate replies for a solo trip',()=>{
 assert.equal(bot.reply(chat('P'),{...trip,m:'P'},'Hello'),null);
});

test('ignores missing trip data or blank messages',()=>{
 assert.equal(bot.reply(chat(),null,'Hello'),null);
 assert.equal(bot.reply(chat(),trip,'  '),null);
});
