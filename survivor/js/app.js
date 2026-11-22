import {state,save,ensureData} from "./state.js";
import {ARCHETYPES,twistDefs,RELATIONSHIPS} from "./data/index.js";
import {renderSetup} from "./pages/setup.js";
import {renderTimeline} from "./pages/timeline.js";
import {renderCast} from "./pages/cast.js";
import {renderTeams} from "./pages/teams.js";
import {renderRelationships} from "./pages/relationships.js";
import {esc,heading,field,rangeField,displayName,safeColor,relColor} from "./utils.js";
import {episodeCount as getEpisodeCount,episodePhase as getEpisodePhase} from "./systems/season-generator.js";
import {randomizeTeams} from "./systems/team-assignment.js";
import {openRelationshipMenu} from "./systems/relationship-system.js";
import {setActiveNavigation} from "./navigation.js";
let page="setup";
function render(){
 ensureData();save();setActiveNavigation(page);
 const episodeCount=()=>getEpisodeCount(state),episodePhase=(i)=>getEpisodePhase(state,i);
 const pages={setup:()=>renderSetup({state,heading,field,esc,rangeField}),timeline:()=>renderTimeline({state,heading,esc,twistDefs,episodeCount,episodePhase}),cast:()=>renderCast({state,heading,esc,displayName,ARCHETYPES}),teams:()=>renderTeams({state,heading,esc,displayName,safeColor}),relationships:()=>renderRelationships({state,heading,esc,displayName,RELATIONSHIPS,relColor})};
 document.getElementById("page-content").innerHTML=pages[page]();
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-page]");if(nav){page=nav.dataset.page;render();return}
 const go=e.target.closest("[data-go]");if(go){page=go.dataset.go;render();return}
 const add=e.target.closest("[data-add-twist]");if(add){const i=+add.dataset.addTwist;const sel=document.querySelector(`[data-twist-select="${i}"]`);if(sel.value&&!state.timeline[i].twists.includes(sel.value))state.timeline[i].twists.push(sel.value);render();return}
 const toggle=e.target.closest("[data-toggle-twists]");if(toggle){const i=toggle.dataset.toggleTwists,p=document.getElementById("twist-picker-"+i),open=p.classList.toggle("hidden")===false;toggle.setAttribute("aria-expanded",String(open));toggle.textContent=(open?"−":"＋")+" Choose twists ("+state.timeline[+i].twists.length+")";return}
 const pick=e.target.closest("[data-episode-twist]");if(pick){const i=+pick.dataset.episodeTwist,name=pick.dataset.twistName,list=state.timeline[i].twists;state.timeline[i].twists=list.includes(name)?list.filter(x=>x!==name):[...list,name];render();const p=document.getElementById("twist-picker-"+i),b=document.querySelector(`[data-toggle-twists="${i}"]`);if(p&&b){p.classList.remove("hidden");b.setAttribute("aria-expanded","true");b.textContent="− Choose twists ("+state.timeline[i].twists.length+")"}return}
 const openRel=e.target.closest("[data-open-rel]");if(openRel){openRelationshipMenu(state,openRel.dataset.openRel,openRel.dataset.relA,openRel.dataset.relB,esc,displayName,RELATIONSHIPS);return}
 const setRel=e.target.closest("[data-set-rel]");if(setRel){state.relationships[setRel.dataset.relKey]=setRel.dataset.setRel;document.querySelector(".rel-backdrop")?.remove();render();return}
 const clearRel=e.target.closest("[data-clear-rel]");if(clearRel){delete state.relationships[clearRel.dataset.clearRel];document.querySelector(".rel-backdrop")?.remove();render();return}
 const ass=e.target.closest("[data-assignment]");if(ass){state.assignment=ass.dataset.assignment;render();return}
 if(e.target.closest("[data-randomize]")){randomizeTeams(state);render();return}
 if(e.target.closest("[data-add-alliance]")){state.alliances.push({name:"",members:[],strengths:{}});render();return}
 const ra=e.target.closest("[data-remove-alliance]");if(ra){state.alliances.splice(+ra.dataset.removeAlliance,1);render();return}
 const clear=e.target.closest("[data-clear-player]");if(clear){const i=+clear.dataset.clearPlayer;state.cast[i]={...state.cast[i],name:"",nicknameOn:false,nickname:"",image:"",gender:"",archetype:"",class:"",stats:[5,5,5,5,5,5,5]};render();return}
});
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.dataset.setting){const k=el.dataset.setting;state.settings[k]=el.value;if(k==="logo"){save();return}render();return}
 if(el.dataset.rangeSetting){const k=el.dataset.rangeSetting;state.settings[k]=Number(el.value);if(k==="castSize"){state.settings.mergeAt=Math.min(state.settings.mergeAt,state.settings.castSize-1);ensureData()}if(k==="tribes")ensureData();save();render();return}
 if(el.dataset.settingCheck){state.settings[el.dataset.settingCheck]=el.checked;save();return}
 if(el.dataset.episode!==undefined){state.timeline[+el.dataset.episode][el.dataset.key]=el.value;save();return}
 if(el.dataset.jointSafe!==undefined){state.timeline[+el.dataset.jointSafe].jointSafe=Math.max(0,Number(el.value)||0);save();return}
 if(el.dataset.player!==undefined){const p=state.cast[+el.dataset.player],k=el.dataset.key;p[k]=el.value;if(k==="archetype"){const a=ARCHETYPES.find(x=>x.name===p.archetype);p.class=a?.class||"";p.stats=a?[...(state.archetypeStats?.[a.name]||a.stats)]:[5,5,5,5,5,5,5]}render();return}
 if(el.dataset.playerCheck!==undefined){state.cast[+el.dataset.playerCheck][el.dataset.key]=el.checked;render();return}
 if(el.dataset.archStat!==undefined){ARCHETYPES[+el.dataset.archStat].stats[+el.dataset.statIndex]=Math.max(1,Math.min(10,Number(el.value)||1));save();return}
 if(el.dataset.team!==undefined){state.teams[+el.dataset.team][el.dataset.key]=el.value;save();if(el.dataset.key==="name"||el.dataset.key==="color")render();return}
 if(el.dataset.playerTeam!==undefined){state.cast[+el.dataset.playerTeam].team=el.value;save();render();return}
 if(el.dataset.rel!==undefined){state.relationships[el.dataset.rel]=el.value;save();return}
 if(el.dataset.alliance!==undefined){state.alliances[+el.dataset.alliance][el.dataset.key]=el.value;save();return}
 if(el.dataset.allianceMembers!==undefined){const i=+el.dataset.allianceMembers;state.alliances[i].members=[...el.selectedOptions].map(o=>o.value);state.alliances[i].strengths=state.alliances[i].strengths||{};render();return}
 if(el.dataset.strengthAlliance!==undefined){const a=state.alliances[+el.dataset.strengthAlliance];a.strengths[el.dataset.playerId]=el.value;save();return}
});
document.addEventListener("input",e=>{
 if(e.target.id==="season-logo"){const preview=document.getElementById("logo-preview");preview.innerHTML=e.target.value?`<img src="${esc(e.target.value)}" alt="Season logo">`:"NO LOGO"}
 if(e.target.dataset.rangeSetting){const out=document.getElementById("value-"+e.target.dataset.rangeSetting);if(out)out.textContent=e.target.value;}
});
function init(){ensureData();if(!state.cast.some(p=>p.team))randomizeTeams(state);render();}
init();
