const pick=a=>a[Math.floor(Math.random()*a.length)];
const weightedPick=list=>{let roll=Math.random()*list.reduce((n,x)=>n+Math.pow(Math.max(.1,x.score),1.25),0);return list.find(x=>(roll-=Math.pow(Math.max(.1,x.score),1.25))<=0)||list[0]};
const alive=p=>p.status==="active";
export const playersOnTribe=(g,id)=>g.cast.filter(p=>alive(p)&&p.team===id);
export const activeTribes=g=>g.tribes.filter(t=>playersOnTribe(g,t.id).length);
export function startSeason(s){
 const tribes=s.teams.slice(0,+s.settings.tribes).map(t=>({id:t.id,name:t.name,color:t.color1||t.color||"#55735a"}));
 const cast=s.cast.map(p=>({...p,stats:[...(p.stats||[5,5,5,5,5,5,5])],status:"active"}));
 s.game={episode:1,stage:"contestants",tribes,cast,alliances:s.alliances.map((a,i)=>({...a,id:"a"+i})),mergeAt:+s.settings.mergeAt,merged:false,challenge:null,eventTribes:[],eventIndex:0,losers:[],tribalIndex:0,tribal:null,history:[],winner:null};
 prepare(s);
}
function prepare(s){
 const g=s.game;
 if(!g.merged&&g.cast.filter(alive).length<=g.mergeAt){g.merged=true;const t=s.teams[+s.settings.tribes];g.tribes=[{id:"merge",name:t?.name||"Merge Tribe",color:t?.color1||t?.color||"#a18b53"}];g.cast.filter(alive).forEach(p=>p.team="merge")}
 g.stage="contestants";g.challenge=null;g.eventTribes=activeTribes(g).map(t=>({tribeId:t.id,events:[],confessionals:[]}));g.eventIndex=0;g.losers=[];g.tribalIndex=0;g.tribal=null;
}
const rel=(s,a,b)=>({"Best friends":3,"Close allies":2,"Friendly":1,"Distant":-1,"Rivals":-2,"Enemies":-3}[s.relationships[[a.id,b.id].sort().join("|")]]||0);
export function runChallenge(s){
 const g=s.game,types=[
 {name:"Hold Your Ground",description:"Castaways cling to narrow poles above the water. The last tribe still holding on wins.",w:[.15,.65,.2,0,0,0,0]},
 {name:"The Heavy Haul",description:"Tribes carry heavy crates through an obstacle course before solving a puzzle.",w:[.45,.25,.2,.1,0,0,0]},
 {name:"Memory Lane",description:"Castaways study a sequence of symbols, then recreate it accurately under pressure.",w:[0,.05,.35,.1,0,0,.5]},
 {name:"All Hands on Deck",description:"The tribe navigates a balance course while keeping everyone in sync.",w:[.15,.3,.1,.4,0,0,.05]},
 {name:"The Final Lock",description:"A physical relay ends with a complicated combination puzzle. Every stage matters.",w:[.25,.15,.35,.05,0,0,.2]}];
 const c=pick(types);
 if(g.merged){
  const scores=g.cast.filter(alive).map(p=>({playerId:p.id,score:c.w.reduce((n,w,i)=>n+w*(+p.stats[i]||5),0)*(.72+Math.random()*.56)})).sort((a,b)=>b.score-a.score);
  const winner=weightedPick(scores);g.challenge={name:c.name,description:c.description,stats:c.w.map((w,i)=>w>0?["Physical","Endurance","Strategy","Social","Loyalty","Threat","Intuition"][i]:null).filter(Boolean),individual:true,winner:winner.playerId,results:scores};g.losers=["merge"];
 }else{
  const scores=activeTribes(g).map(t=>{const ps=playersOnTribe(g,t.id),avg=c.w.reduce((n,w,i)=>n+w*ps.reduce((a,p)=>a+(+p.stats[i]||5),0)/Math.max(1,ps.length),0),bond=ps.length>1?ps.reduce((n,p)=>n+ps.reduce((a,q)=>a+(p.id===q.id?0:rel(s,p,q)),0),0)/(ps.length*(ps.length-1)):0;return {tribeId:t.id,score:avg*(1+bond*.018)*(.72+Math.random()*.56)}}).sort((a,b)=>b.score-a.score);
  const winner=weightedPick(scores);g.challenge={name:c.name,description:c.description,stats:c.w.map((w,i)=>w>0?["Physical","Endurance","Strategy","Social","Loyalty","Threat","Intuition"][i]:null).filter(Boolean),winner:winner.tribeId,results:scores};g.losers=scores.filter(x=>x.tribeId!==winner.tribeId).map(x=>x.tribeId);
 }
 g.stage="immunity";g.history.push({episode:g.episode,type:"Immunity",winner:g.challenge.winner});
}
const eventTypes=[
 ["Camp Life","A shelter disagreement","A disagreement over the shelter leaves the tribe a little divided.","rel",-1],
 ["Camp Life","A productive afternoon","The tribe works together and gets the camp in order.","social",1],
 ["Strategy","An unexpected conversation","A quiet conversation gives one castaway a clearer picture of the tribe.","intuition",1],
 ["Strategy","Whispers by the water","A possible voting plan begins to take shape around camp.","strategy",1],
 ["Relationships","A bond gets stronger","Two castaways spend time together and build trust.","rel",1],
 ["Relationships","A clash of personalities","Two castaways struggle to see eye to eye.","rel",-1],
 ["Challenge Prep","A training session","The tribe practises together and feels more prepared for the next challenge.","endurance",1]
];
export function generateEvents(s,tribeId){
 const g=s.game,ps=playersOnTribe(g,tribeId),entry=g.eventTribes.find(x=>x.tribeId===tribeId);if(!entry||entry.events.length)return;
 const count=Math.min(3,Math.max(1,Math.ceil(ps.length/5)));
 for(let i=0;i<count;i++){const e=pick(eventTypes),p=pick(ps),q=pick(ps.filter(x=>x.id!==p.id));entry.events.push({category:e[0],title:e[1],description:e[2],actor:p.id});if(e[3]==="rel"&&q){const key=[p.id,q.id].sort().join("|"),order=["Enemies","Rivals","Distant","Neutral","Friendly","Close allies","Best friends"],idx=order.indexOf(s.relationships[key]||"Neutral");s.relationships[key]=order[Math.max(0,Math.min(6,idx+e[4]))]}else{const ix={social:3,intuition:6,strategy:2,endurance:1}[e[3]];if(ix!==undefined)p.stats[ix]=Math.max(1,Math.min(10,(+p.stats[ix]||5)+e[4]))}}
 entry.confessionals=ps.map(p=>{const other=ps.find(q=>q.id!==p.id&&rel(s,p,q)!==0);return {playerId:p.id,quote:other?(rel(s,p,other)>0?"I feel like "+(other.name||"they")+" and I are starting to trust each other. That could be important.":"I'm not completely sure where "+(other.name||"they")+" stand with me, and I don't love that."):"I'm keeping my options open. It's still early, and I don't want to show all my cards."}});
}
function createTribal(s){
 const g=s.game,id=g.losers[g.tribalIndex],ps=playersOnTribe(g,id).filter(p=>!g.challenge?.individual||p.id!==g.challenge.winner);if(!id){finishEpisode(s);return}
 const groups=g.alliances.map(a=>({a,m:ps.filter(p=>(a.members||[]).includes(p.id))})).filter(x=>x.m.length>=2),big=groups.sort((a,b)=>b.m.length-a.m.length)[0],outsiders=ps.filter(p=>!big?.m.some(x=>x.id===p.id)),defaultTarget=pick(outsiders.length?outsiders:ps);
 const votes=ps.map(v=>{const options=ps.filter(p=>p.id!==v.id),group=groups.find(x=>x.m.some(p=>p.id===v.id));let target=defaultTarget;if(group&&Math.random()<.76){const shared=options.filter(p=>!group.m.some(x=>x.id===p.id));target=shared.includes(defaultTarget)?defaultTarget:pick(shared.length?shared:options)}else if(Math.random()<.35){const enemies=options.filter(p=>rel(s,v,p)<0);if(enemies.length)target=pick(enemies)}return {voterId:v.id,targetId:target.id}}).sort(()=>Math.random()-.5);
 const counts={};votes.forEach(v=>counts[v.targetId]=(counts[v.targetId]||0)+1);
 const plans=Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([targetId])=>{const ids=votes.filter(v=>v.targetId===targetId).map(v=>v.voterId),a=g.alliances.find(x=>ids.filter(id=>(x.members||[]).includes(id)).length>=2),lead=ps.filter(p=>ids.includes(p.id)).sort((x,y)=>(+y.stats[2]||5)-(+x.stats[2]||5))[0];return {targetId,voters:ids,allianceId:a?.id||null,leaderId:lead?.id,reason:a?"The alliance wants to keep its numbers and remove an outsider.":"Personal tension or strategic threat has made this castaway a target."}});
 const swing=ps.filter(p=>g.alliances.filter(a=>(a.members||[]).includes(p.id)).length!==1||Math.random()<.2).slice(0,4).map(p=>{const ties=g.alliances.filter(a=>(a.members||[]).includes(p.id)).length,friend=ps.find(q=>q.id!==p.id&&rel(s,p,q)>0);const note=ties>1?"They are playing multiple sides and their loyalties may be split.":ties===0&&friend?"They are not in an alliance, but appear to be leaning toward "+(friend.name||"this ally")+" because of their relationship.":"Their vote may be a swing because they are not fully locked into one plan.";return {playerId:p.id,note}});g.tribal={tribeId:id,votes,counts,revealed:0,plans,swing};g.stage="tribal";
}
function finishEpisode(s){const g=s.game,left=g.cast.filter(alive);if(left.length<=(s.settings.finale==="Final 2"?2:3)){g.winner=left.sort((a,b)=>(+b.stats[2]+ +b.stats[3]+ +b.stats[6])-(+a.stats[2]+ +a.stats[3]+ +a.stats[6]))[0]?.id;g.stage="winner"}else{g.episode++;prepare(s)}}
export function revealVote(s){if(s.game.tribal.revealed<s.game.tribal.votes.length)s.game.tribal.revealed++}
export function resolveTribal(s){
 const g=s.game,t=g.tribal;if(!t||t.revealed<t.votes.length)return;const sorted=Object.entries(t.counts).sort((a,b)=>b[1]-a[1]),top=sorted[0][1],id=pick(sorted.filter(x=>x[1]===top).map(x=>x[0])),p=g.cast.find(x=>x.id===id);if(p)p.status="eliminated";g.history.push({episode:g.episode,type:"Elimination",playerId:id,tribeId:t.tribeId});g.tribalIndex++;g.tribal=null;if(g.tribalIndex<g.losers.length)createTribal(s);else finishEpisode(s);
}
export function advance(s){
 const g=s.game;if(g.stage==="contestants")g.stage="tribes";else if(g.stage==="tribes")runChallenge(s);else if(g.stage==="immunity"){g.stage="events";g.eventIndex=0;generateEvents(s,g.eventTribes[0]?.tribeId)}else if(g.stage==="events"){g.eventIndex++;if(g.eventIndex<g.eventTribes.length)generateEvents(s,g.eventTribes[g.eventIndex].tribeId);else if(g.losers.length){g.tribalIndex=0;createTribal(s)}else finishEpisode(s)}else if(g.stage==="tribal"){if(g.tribal.revealed<g.tribal.votes.length)revealVote(s);else g.stage="votes"}else if(g.stage==="votes")resolveTribal(s)
}
