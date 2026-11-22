import {state,save,ensureData,resetSeason} from "./state.js";
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
function openUrlDialog(target){
 document.querySelector(".url-backdrop")?.remove();
 const current=target==="logo"?state.settings.logo:target.startsWith("player-")?state.cast[+target.split("-")[1]].image:state.teams[+target.split("-")[1]].icon||"";
 const backdrop=document.createElement("div");backdrop.className="url-backdrop";
 backdrop.innerHTML=`<section class="url-dialog" role="dialog" aria-modal="true"><h3>Add image URL</h3><p>Paste a direct image link below.</p><input class="url-dialog-input" id="image-url-value" type="url" placeholder="https://..." value="${esc(current)}"><div class="button-row"><button class="btn primary" data-url-save="${esc(target)}">Save URL</button><button class="btn" data-url-close>Cancel</button>${current?'<button class="btn danger" data-url-remove="'+esc(target)+'">Remove image</button>':""}</div></section>`;
 backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});document.body.appendChild(backdrop);
}
function applyUrl(target,value){
 if(target==="logo")state.settings.logo=value;
 else if(target.startsWith("player-"))state.cast[+target.split("-")[1]].image=value;
 else if(target.startsWith("team-"))state.teams[+target.split("-")[1]].icon=value;
 save();document.querySelector(".url-backdrop")?.remove();render();
}
document.addEventListener("click",e=>{
 const clearAll=e.target.closest("[data-clear-all]");
 if(clearAll){if(confirm("Clear the entire season setup, cast, teams, timeline, relationships and alliances?")){resetSeason();randomizeTeams(state);page="setup";render()}return}
 if(e.target.closest("[data-url-close]")){document.querySelector(".url-backdrop")?.remove();return}
 const urlSave=e.target.closest("[data-url-save]");if(urlSave){applyUrl(urlSave.dataset.urlSave,document.getElementById("image-url-value").value.trim());return}
 const urlRemove=e.target.closest("[data-url-remove]");if(urlRemove){applyUrl(urlRemove.dataset.urlRemove,"");return}
 const urlOpen=e.target.closest("[data-url-modal]");if(urlOpen){openUrlDialog(urlOpen.dataset.urlModal);return}
 const nick=e.target.closest("[data-nickname-toggle]");if(nick){const i=+nick.dataset.nicknameToggle;state.cast[i].nicknameOn=!state.cast[i].nicknameOn;render();return}
 const label=e.target.closest("[data-label-toggle]");if(label){const i=+label.dataset.labelToggle;state.teams[i].labelEdit=!state.teams[i].labelEdit;render();return}
 const nav=e.target.closest("[data-page]");if(nav){page=nav.dataset.page;render();return}
 const go=e.target.closest("[data-go]");if(go){page=go.dataset.go;render();return}
 const twist=e.target.closest("[data-episode-twist]");if(twist){const i=+twist.dataset.episodeTwist,name=twist.dataset.twistName,list=state.timeline[i].twists;state.timeline[i].twists=list.includes(name)?list.filter(x=>x!==name):[...list,name];render();const cards=document.querySelectorAll(".episode-card");if(cards[i])cards[i].open=true;return}
 const openRel=e.target.closest("[data-open-rel]");if(openRel){openRelationshipMenu(state,openRel.dataset.openRel,openRel.dataset.relA,openRel.dataset.relB,esc,displayName,RELATIONSHIPS);return}
 const setRel=e.target.closest("[data-set-rel]");if(setRel){state.relationships[setRel.dataset.relKey]=setRel.dataset.setRel;document.querySelector(".rel-backdrop")?.remove();render();return}
 const clearRel=e.target.closest("[data-clear-rel]");if(clearRel){delete state.relationships[clearRel.dataset.clearRel];document.querySelector(".rel-backdrop")?.remove();render();return}
 const ass=e.target.closest("[data-assignment]");if(ass){state.assignment=ass.dataset.assignment;render();return}
 if(e.target.closest("[data-randomize]")){randomizeTeams(state);render();return}
 if(e.target.closest("[data-add-alliance]")){state.alliances.push({name:"",members:[],strengths:{}});render();return}
 const alliancePlayer=e.target.closest("[data-alliance-player]");if(alliancePlayer){const i=+alliancePlayer.dataset.alliancePlayer,id=alliancePlayer.dataset.playerId,a=state.alliances[i];a.members=a.members||[];a.members=a.members.includes(id)?a.members.filter(x=>x!==id):[...a.members,id];a.strengths=a.strengths||{};render();return}
 const ra=e.target.closest("[data-remove-alliance]");if(ra){state.alliances.splice(+ra.dataset.removeAlliance,1);render();return}
});
document.addEventListener("change",e=>{
 const el=e.target;
 if(el.dataset.setting){state.settings[el.dataset.setting]=el.value;save();render();return}
 if(el.dataset.rangeSetting){const k=el.dataset.rangeSetting;state.settings[k]=Number(el.value);if(k==="castSize"){state.settings.mergeAt=Math.min(state.settings.mergeAt,state.settings.castSize-1);ensureData()}if(k==="tribes")ensureData();save();render();return}
 if(el.dataset.settingCheck){state.settings[el.dataset.settingCheck]=el.checked;save();return}
 if(el.dataset.episode!==undefined){state.timeline[+el.dataset.episode][el.dataset.key]=el.value;save();return}
 if(el.dataset.jointSafe!==undefined){state.timeline[+el.dataset.jointSafe].jointSafe=Math.max(0,Number(el.value)||0);save();return}
 if(el.dataset.player!==undefined){const p=state.cast[+el.dataset.player],k=el.dataset.key;p[k]=el.value;if(k==="archetype"){const a=ARCHETYPES.find(x=>x.name===p.archetype)||ARCHETYPES[0];p.class=a.class;p.stats=[...a.stats]}render();return}
 if(el.dataset.team!==undefined){const t=state.teams[+el.dataset.team],k=el.dataset.key;t[k]=el.value;if(k==="name"||k==="label")render();else save();return}
 if(el.dataset.teamColour!==undefined){const t=state.teams[+el.dataset.team];t[el.dataset.colourPart]=el.value;const c1=t.color1||"#777777",c2=t.color2||"#303030";t.color=t.gradient?`linear-gradient(135deg, ${c1}, ${c2})`:c1;save();render();return}
 if(el.dataset.teamHex!==undefined){const t=state.teams[+el.dataset.teamHex],part=el.dataset.colourPart;if(/^#[0-9a-fA-F]{6}$/.test(el.value)){t[part]=el.value;const c1=t.color1||"#777777",c2=t.color2||"#303030";t.color=t.gradient?`linear-gradient(135deg, ${c1}, ${c2})`:c1;save();render()}return}
 if(el.dataset.gradient!==undefined){const t=state.teams[+el.dataset.gradient];t.gradient=el.checked;const c1=t.color1||"#777777",c2=t.color2||"#303030";t.color=t.gradient?`linear-gradient(135deg, ${c1}, ${c2})`:c1;save();render();return}
 if(el.dataset.playerTeam!==undefined){state.cast[+el.dataset.playerTeam].team=el.value;save();render();return}
 if(el.dataset.rel!==undefined){state.relationships[el.dataset.rel]=el.value;save();return}
 if(el.dataset.alliance!==undefined){state.alliances[+el.dataset.alliance][el.dataset.key]=el.value;save();return}
 if(el.dataset.strengthAlliance!==undefined){const a=state.alliances[+el.dataset.strengthAlliance];a.strengths=a.strengths||{};a.strengths[el.dataset.playerId]=el.value;save();return}
});
document.addEventListener("input",e=>{if(e.target.dataset.rangeSetting){const out=document.getElementById("value-"+e.target.dataset.rangeSetting);if(out)out.textContent=e.target.value}});
function init(){ensureData();state.cast.forEach(p=>{if(!p.archetype){p.archetype="The Balanced";p.class="All-rounder";p.stats=[5,5,5,5,5,5,5]}});if(!state.cast.some(p=>p.team))randomizeTeams(state);render()}
init();