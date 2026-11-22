const STORE_KEY = "survivor-simulator-season-v1";
const STAT_NAMES = ["Physical","Endurance","Strategy","Social","Loyalty","Threat","Intuition"];
const ARCHETYPES = [
 {name:"The Conman",class:"Strategist",description:"A smooth talker who uses charm, misdirection and carefully managed truths to stay ahead.",stats:[4,4,9,8,3,7,7]},
 {name:"The Challenge Beast",class:"Competitor",description:"A physical powerhouse who thrives under pressure and makes their value obvious in challenges.",stats:[10,9,5,5,6,8,5]},
 {name:"The Social Butterfly",class:"Connector",description:"Builds bonds across the tribe and makes people feel heard, included and valued.",stats:[4,5,6,10,8,5,7]},
 {name:"The Puppet Master",class:"Strategist",description:"Quietly connects the pieces, influences decisions and prefers control from behind the scenes.",stats:[4,5,10,7,5,8,9]},
 {name:"The Underdog",class:"Wildcard",description:"Often underestimated, but resilient, adaptable and capable of finding an opening.",stats:[6,8,7,7,8,3,7]},
 {name:"The Loyalist",class:"Guardian",description:"Values commitment and trust, building a tight core and standing by their people.",stats:[6,7,5,8,10,4,6]},
 {name:"The Villain",class:"Wildcard",description:"Embraces bold moves and conflict, willing to become a target to shape the game.",stats:[6,6,8,5,3,10,7]},
 {name:"The Observer",class:"Analyst",description:"Listens, notices patterns and gathers information before making a decisive move.",stats:[5,6,8,6,7,4,10]},
 {name:"The Provider",class:"Guardian",description:"Keeps the tribe functioning through practical skills, reliability and steady effort.",stats:[8,8,5,8,9,4,6]},
 {name:"The Flirt",class:"Connector",description:"Uses warmth, confidence and social chemistry to build bonds and influence votes.",stats:[5,5,7,9,5,7,6]},
 {name:"The Superfan",class:"Analyst",description:"Knows the game inside out and arrives with plans, references and a deep strategic vocabulary.",stats:[5,6,9,6,6,7,8]},
 {name:"The Free Spirit",class:"Wildcard",description:"Unpredictable and independent, follows instinct and refuses to play by anyone else's script.",stats:[6,7,6,7,4,6,8]}
];
const DEFAULT_REL = ["Ride or die","Close friend","Friend","Trust","Neutral","Distrust","Enemies"];
const defaultState = () => ({
 archetypeStats:{},
 settings:{title:"Untitled Season",logo:"",castSize:18,tribes:3,mergeAt:11,quits:true,expulsions:true,medical:true,finale:"Final 3"},
 cast:[], teams:[], assignment:"random", timeline:[], relationships:{}, alliances:[]
});
let state = loadState();
let page = "setup";
function loadState(){try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORE_KEY)||"{}")}}catch{return defaultState()}}
function save(){localStorage.setItem(STORE_KEY,JSON.stringify(state));const el=document.getElementById("save-state");if(el)el.textContent="SAVED LOCALLY";document.getElementById("season-mini").textContent=(state.settings.title||"NEW SEASON").toUpperCase()}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function ensureData(){
 const n=Number(state.settings.castSize)||18;
 while(state.cast.length<n)state.cast.push({id:crypto.randomUUID(),name:"",nicknameOn:false,nickname:"",image:"",gender:"",archetype:"",class:"",stats:[5,5,5,5,5,5,5],team:""});
 if(state.cast.length>n)state.cast=state.cast.slice(0,n);
 const t=Number(state.settings.tribes)||2;
 while(state.teams.length<t+1)state.teams.push({id:"team"+state.teams.length,name:state.teams.length===t?"Merge":"Team "+(state.teams.length+1),label:"",color:["#777777","#a5a5a5","#555555","#888888"][state.teams.length%4]});
 state.teams=state.teams.slice(0,t+1);
 state.teams[t].name=state.teams[t].name||"Merge";
}
function render(){
 ensureData();save();
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 const pages={setup:renderSetup,timeline:renderTimeline,cast:renderCast,teams:renderTeams,relationships:renderRelationships};
 document.getElementById("page-content").innerHTML=pages[page]();
}
function heading(kicker,title,desc,action=""){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
function field(label,key,value,type="text",extra=""){return `<div class="field"><label for="${key}">${label}</label><input id="${key}" data-setting="${key}" type="${type}" value="${esc(value)}" ${extra}></div>`}
function rangeField(label,key,value,min,max){
 return `<div class="field range-field"><label for="range-${key}">${label}</label><div class="range-line"><input id="range-${key}" type="range" min="${min}" max="${max}" value="${value}" data-range-setting="${key}"><output class="range-value" id="value-${key}">${value}</output></div></div>`;
}
function renderSetup(){
 const s=state.settings;
 return heading("01 / FOUNDATION","Season setup","Set the format and identity of your season.")+
 `<section class="section"><div class="section-head"><h2>Season identity</h2></div><div class="field-grid">
 ${field("Season title","title",s.title)}
 <div class="field"><label for="season-logo">Logo image URL</label><input id="season-logo" data-setting="logo" value="${esc(s.logo)}" placeholder="https://..."><span class="hint">Optional. Paste a direct image URL.</span></div>
 <div class="field full"><div class="field-label">Logo preview</div><div class="logo-preview" id="logo-preview">${s.logo?`<img src="${esc(s.logo)}" alt="Season logo">`:"NO LOGO"}</div></div>
 </div></section>
 <section class="section"><div class="section-head"><h2>Game format</h2></div><div class="field-grid">
 ${rangeField("Cast size","castSize",s.castSize,8,40)}
 ${rangeField("Starting tribes","tribes",s.tribes,2,6)}
 ${rangeField("Merge at (players remaining)","mergeAt",s.mergeAt,2,Math.max(2,s.castSize-1))}
 <div class="field"><label for="finale">Finale format</label><select id="finale" data-setting="finale">${["Final 2","Final 3"].map(v=>`<option ${s.finale===v?"selected":""}>${v}</option>`).join("")}</select></div>
 </div><p class="hint">The episode count is generated automatically from the cast size and finale format.</p></section>
 <section class="section"><div class="section-head"><h2>Game events</h2></div><div class="check-list">
 ${["quits","expulsions","medical"].map((k,i)=>`<label class="check-row"><input type="checkbox" data-setting-check="${k}" ${s[k]?"checked":""}> ${["Allow quits","Allow expulsions","Allow medical evacuations"][i]}</label>`).join("")}
 </div></section>
 <div class="button-row"><button class="btn primary" data-go="timeline">Continue to timeline & twists →</button></div>`;
}
const twistDefs=[
 {category:"Elimination",name:"Fake Elimination",phase:"both",desc:"A player appears to be eliminated, but their game continues."},
 {category:"Elimination",name:"Mock Vote",phase:"both",desc:"The voted-out player joins the opposing team instead of leaving the game."},
 {category:"Teams",name:"Team Swap",phase:"pre",desc:"Players are redistributed into new tribes."},
 {category:"Teams",name:"Mutiny",phase:"pre",desc:"Players are given the opportunity to switch tribes."},
 {category:"Immunity",name:"Double Immunity Challenge",phase:"merge",desc:"Two individual players can win immunity."},
 {category:"Immunity",name:"Group Immunity",phase:"merge",desc:"A group of players earns immunity together."},
 {category:"Immunity",name:"Joint Tribal Council",phase:"pre",desc:"Multiple tribes attend one combined Tribal Council."}
];
function episodeCount(){return Math.max(1,Number(state.settings.castSize)- (state.settings.finale==="Final 2"?2:3)+1)}
function episodePhase(ep){return (Number(state.settings.castSize)-ep)>Number(state.settings.mergeAt)?"pre":"merge"}
function renderTimeline(){
 const count=episodeCount();
 while(state.timeline.length<count)state.timeline.push({twists:[],jointSafe:0});
 state.timeline=state.timeline.slice(0,count);
 return heading("02 / SEASON FLOW","Timeline & twists","Choose which twists appear in each episode. Expand an episode to see the options.")+
 `<div class="stat-grid"><div class="stat-card"><strong>${count}</strong><span>Episodes</span></div><div class="stat-card"><strong>${state.settings.castSize}</strong><span>Castaways</span></div><div class="stat-card"><strong>${state.settings.mergeAt}</strong><span>Merge at</span></div><div class="stat-card"><strong>${state.settings.tribes}</strong><span>Starting tribes</span></div></div>
 <div class="section"><div class="section-head"><div><h2>Episode schedule</h2><p>Tap “Choose twists” to expand an episode. Selected twists are highlighted.</p></div></div><div class="episode-list">${state.timeline.map((ep,i)=>{const phase=episodePhase(i);const available=twistDefs.filter(t=>t.phase==="both"||t.phase===phase);return `<article class="episode-card"><div class="episode-top"><strong>EPISODE ${String(i+1).padStart(2,"0")}</strong><span>${phase==="pre"?"PRE-MERGE":"MERGE / POST-MERGE"}</span></div><div class="episode-twists"><button class="twist-toggle" type="button" data-toggle-twists="${i}" aria-expanded="false">＋ Choose twists (${ep.twists.length})</button><div class="twist-picker hidden" id="twist-picker-${i}">${available.map(t=>`<button type="button" class="twist-option ${ep.twists.includes(t.name)?"selected":""}" data-episode-twist="${i}" data-twist-name="${esc(t.name)}">${ep.twists.includes(t.name)?"✓ ":"＋ "}${esc(t.name)}</button>`).join("")}</div></div>${ep.twists.length?`<div class="twist-list">${ep.twists.map(t=>`<span class="twist-chip">${esc(t)}</span>`).join("")}</div>`:""}${phase==="pre"&&state.settings.tribes>=3&&ep.twists.includes("Joint Tribal Council")?`<div class="field" style="margin-top:12px;max-width:300px"><label>Tribes safe (0 = everyone attends Tribal)</label><input type="number" min="0" max="${state.settings.tribes}" data-joint-safe="${i}" value="${ep.jointSafe||0}"></div>`:phase==="pre"&&state.settings.tribes===2&&ep.twists.includes("Joint Tribal Council")?'<p class="hint">Both tribes attend the same Tribal Council.</p>':""}</article>`}).join("")}</div></div>
 <div class="timeline-footer"><button class="btn primary" data-go="cast">Continue to cast →</button></div>`;
}
function renderCast(){
 return heading("03 / CASTAWAYS","Cast","Add your castaways. The number of profiles matches the cast size in season setup.")+
 `<div class="section-head"><div><h2>Cast list · ${state.cast.length} players</h2><p>Names are displayed by first name unless a nickname is enabled.</p></div></div><div class="cast-grid">${state.cast.map((p,i)=>`<article class="player-card"><div class="player-card-head"><strong>CASTAWAY ${String(i+1).padStart(2,"0")}</strong><button class="btn subtle" data-clear-player="${i}">Clear</button></div><div class="player-preview"><div class="avatar">${p.image?`<img src="${esc(p.image)}" alt="" style="width:100%;height:100%;object-fit:cover">`:"PHOTO"}</div><div><strong>${esc(displayName(p)||"Unnamed player")}</strong><br><small>${esc(p.archetype||"No archetype selected")}</small></div></div><div class="player-fields">
 <div class="field"><label>Player name</label><input data-player="${i}" data-key="name" value="${esc(p.name)}" placeholder="Full name"></div>
 <div class="field"><label>Image URL</label><input data-player="${i}" data-key="image" value="${esc(p.image)}" placeholder="https://..."></div>
 <div class="field"><label>Gender</label><select data-player="${i}" data-key="gender"><option value="">Select...</option>${["Woman","Man","Non-binary","Other"].map(v=>`<option ${p.gender===v?"selected":""}>${v}</option>`).join("")}</select></div>
 <div class="field"><label>Archetype</label><select data-player="${i}" data-key="archetype"><option value="">Select...</option>${ARCHETYPES.map(a=>`<option ${p.archetype===a.name?"selected":""}>${a.name}</option>`).join("")}</select></div>
 <div class="field full"><label class="check-row"><input type="checkbox" data-player-check="${i}" data-key="nicknameOn" ${p.nicknameOn?"checked":""}> Use nickname</label><input data-player="${i}" data-key="nickname" value="${esc(p.nickname)}" placeholder="Complete nickname" ${p.nicknameOn?"":"disabled"}></div>
 </div></article>`).join("")}</div><div class="button-row" style="margin-top:20px"><button class="btn primary" data-go="teams">Continue to teams →</button></div>`;
}
function displayName(p){if(p.nicknameOn&&p.nickname.trim())return p.nickname.trim();return (p.name||"").trim().split(/\s+/)[0]||""}
function renderTeams(){
 const tribes=Number(state.settings.tribes);
 return heading("05 / TEAM CONFIGURATION","Team assignment","Name and style each starting tribe and the merge group. Choose how players are distributed.")+
 `<div class="section"><div class="section-head"><h2>Assignment method</h2></div><div class="button-row"><button class="btn ${state.assignment==="random"?"primary":""}" data-assignment="random">Random assignment</button><button class="btn ${state.assignment==="manual"?"primary":""}" data-assignment="manual">Manual assignment</button><button class="btn" disabled>Thematic assignment · Locked</button></div><p class="hint">${state.assignment==="random"?"Randomly distributes the cast across the starting tribes.": "Choose a starting tribe for each castaway below."}</p></div>
 <div class="section"><div class="section-head"><h2>Team identities</h2></div><div class="team-grid">${state.teams.map((t,i)=>`<article class="team-card"><div class="team-swatch" style="background:${safeColor(t.color)}"></div><div class="eyebrow">${i===tribes?"MERGE TRIBE":"STARTING TRIBE "+(i+1)}</div><div class="field"><label>Team name</label><input data-team="${i}" data-key="name" value="${esc(t.name)}"></div><div class="field"><label>Label (optional)</label><input data-team="${i}" data-key="label" value="${esc(t.label)}" placeholder="e.g. Blue tribe"></div><div class="field"><label>Colour (hex)</label><input data-team="${i}" data-key="color" value="${esc(t.color)}" placeholder="#777777 or linear-gradient(...) "></div></article>`).join("")}</div></div>
 ${state.assignment==="manual"?`<div class="section"><div class="section-head"><h2>Manual placement</h2></div><div class="field-grid">${state.cast.map((p,i)=>`<div class="field"><label>${esc(displayName(p)||"Castaway "+(i+1))}</label><select data-player-team="${i}"><option value="">Unassigned</option>${state.teams.slice(0,tribes).map(t=>`<option value="${esc(t.id)}" ${p.team===t.id?"selected":""}>${esc(t.name)}</option>`).join("")}</select></div>`).join("")}</div></div>`: ""}
 <div class="section"><div class="section-head"><h2>Team preview</h2><button class="btn primary" data-randomize>Generate random teams</button></div><div class="team-preview">${state.teams.map((t,i)=>`<div class="team-preview-item"><div class="team-swatch" style="background:${safeColor(t.color)};height:4px;margin:-12px -12px 12px"></div><strong>${esc(t.name)} ${i===tribes?"· MERGE":""}</strong><span>${i===tribes?"All players after merge":state.cast.filter(p=>p.team===t.id).map(p=>esc(displayName(p)||"Unnamed")).join(", ")||"No players assigned"}</span></div>`).join("")}</div></div>
 <div class="section"><div class="section-head"><h2>Advantages</h2></div><div class="locked">Universal Advantages <b>LOCKED</b></div><div class="locked" style="margin-top:8px">Tribe Advantages <b>LOCKED</b></div><div class="locked" style="margin-top:8px">Merge Advantages <b>LOCKED</b></div></div><button class="btn primary" data-go="relationships">Continue to relationships →</button>`;
}
function safeColor(c){if(/^#[0-9a-fA-F]{6}$/.test(c||""))return c;if(/^linear-gradient\([0-9a-zA-Z#.,%\s-]+\)$/.test(c||"")&&/#[0-9a-fA-F]{6}/.test(c))return c;return "#555555"}
const RELATIONSHIPS=[
 {name:"Ride or die",level:3,kind:"good",color:"#176b42",short:"RIDE"},
 {name:"Close friend",level:2,kind:"good",color:"#24834f",short:"CLOSE"},
 {name:"Friend",level:1,kind:"good",color:"#64a879",short:"FRIEND"},
 {name:"Trust",level:1,kind:"good",color:"#a0c6a8",short:"TRUST"},
 {name:"Neutral",level:0,kind:"neutral",color:"#555555",short:"—"},
 {name:"Distrust",level:1,kind:"bad",color:"#a65a5a",short:"DISTRUST"},
 {name:"Enemies",level:2,kind:"bad",color:"#812d2d",short:"ENEMIES"}
];
function relColor(value){const r=RELATIONSHIPS.find(x=>x.name===value);return r?r.color:"#242424"}
function renderRelationships(){
 const players=state.cast;
 return heading("05 / SOCIAL GAME","Relationships","Click any square to set the relationship between two castaways. Each relationship works both ways.")+
 `<div class="section"><div class="section-head"><div><h2>Relationship matrix</h2><p>One shared relationship per pair. Colour shows the type and strength.</p></div></div>
 <div class="relationship-legend"><span><i class="legend-dot" style="background:#176b42"></i>Strong positive</span><span><i class="legend-dot" style="background:#64a879"></i>Positive</span><span><i class="legend-dot" style="background:#555"></i>Neutral</span><span><i class="legend-dot" style="background:#a65a5a"></i>Negative</span><span><i class="legend-dot" style="background:#812d2d"></i>Strong negative</span></div>
 ${players.length<2?'<div class="empty-state">Add at least two castaways to create relationships.</div>':`<div class="table-wrap"><table class="relationship-table"><thead><tr><th>PLAYER</th>${players.map(p=>`<th title="${esc(displayName(p))}">${esc(displayName(p)||"?")}</th>`).join("")}</tr></thead><tbody>${players.map((p,i)=>`<tr><td>${esc(displayName(p)||"Castaway "+(i+1))}</td>${players.map((q,j)=>{if(i===j)return '<td>—</td>';const key=[p.id,q.id].sort().join("|");const value=state.relationships[key]||"";return `<td><button class="relationship-cell" style="background:${relColor(value)};color:${value==="Trust"?"#111":"#fff"}" data-open-rel="${esc(key)}" data-rel-a="${esc(p.id)}" data-rel-b="${esc(q.id)}" title="${esc(value||"Set relationship")}">${esc(RELATIONSHIPS.find(r=>r.name===value)?.short||"+")}</button></td>`}).join("")}</tr>`).join("")}</tbody></table></div>`}</div>
 <div class="section"><div class="section-head"><div><h2>Alliances</h2><p>Create alliances and rate each member's strength within the group.</p></div><button class="btn" data-add-alliance>+ Add alliance</button></div><div class="alliance-list">${state.alliances.map((a,i)=>`<article class="alliance-card"><div class="section-head"><h2>ALLIANCE ${String(i+1).padStart(2,"0")}</h2><button class="btn danger" data-remove-alliance="${i}">Remove</button></div><div class="field-grid"><div class="field"><label>Alliance name</label><input data-alliance="${i}" data-key="name" value="${esc(a.name)}" placeholder="Alliance name"></div><div class="field"><label>Members</label><select multiple size="3" data-alliance-members="${i}">${players.map(p=>`<option value="${p.id}" ${(a.members||[]).includes(p.id)?"selected":""}>${esc(displayName(p)||"Unnamed castaway")}</option>`).join("")}</select><span class="hint">Use Ctrl / Cmd to select multiple members.</span></div></div><div class="member-strengths">${(a.members||[]).map(id=>{const p=players.find(x=>x.id===id);return p?`<label>${esc(displayName(p)||"Unnamed")}<select data-strength-alliance="${i}" data-player-id="${id}">${["Weak","Moderate","Strong","Core"].map(v=>`<option ${(a.strengths||{})[id]===v?"selected":""}>${v}</option>`).join("")}</select></label>`:""}).join("")}</div></article>`).join("")||'<div class="empty-state">No alliances created yet.</div>'}</div></div>
 <div class="button-row"><button class="btn primary" data-go="teams">← Back to teams</button><button class="btn" data-go="setup">Season setup</button></div>`;
}
function openRelationshipMenu(key,a,b){
 document.querySelector(".rel-backdrop")?.remove();
 const pa=state.cast.find(p=>p.id===a),pb=state.cast.find(p=>p.id===b),current=state.relationships[key]||"";
 const backdrop=document.createElement("div");backdrop.className="rel-backdrop";backdrop.innerHTML=`<section class="rel-menu" role="dialog" aria-modal="true"><h3>${esc(displayName(pa)||"Castaway")} ↔ ${esc(displayName(pb)||"Castaway")}</h3><p>Choose one shared relationship for both players.</p><div class="rel-options">${RELATIONSHIPS.map(r=>`<button class="rel-choice ${current===r.name?"active":""}" data-set-rel="${esc(r.name)}" data-rel-key="${esc(key)}" style="border-left:4px solid ${r.color}">${r.name}<small>${r.kind==="good"?"Positive":r.kind==="bad"?"Negative":"Neither"} relationship</small></button>`).join("")}</div><button class="btn subtle rel-clear" data-clear-rel="${esc(key)}">Clear relationship</button></section>`;
 backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});document.body.appendChild(backdrop);
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-page]");if(nav){page=nav.dataset.page;render();return}
 const go=e.target.closest("[data-go]");if(go){page=go.dataset.go;render();return}
 const add=e.target.closest("[data-add-twist]");if(add){const i=+add.dataset.addTwist;const sel=document.querySelector(`[data-twist-select="${i}"]`);if(sel.value&&!state.timeline[i].twists.includes(sel.value))state.timeline[i].twists.push(sel.value);render();return}
 const toggle=e.target.closest("[data-toggle-twists]");if(toggle){const i=toggle.dataset.toggleTwists,p=document.getElementById("twist-picker-"+i),open=p.classList.toggle("hidden")===false;toggle.setAttribute("aria-expanded",String(open));toggle.textContent=(open?"−":"＋")+" Choose twists ("+state.timeline[+i].twists.length+")";return}
 const pick=e.target.closest("[data-episode-twist]");if(pick){const i=+pick.dataset.episodeTwist,name=pick.dataset.twistName,list=state.timeline[i].twists;state.timeline[i].twists=list.includes(name)?list.filter(x=>x!==name):[...list,name];render();const p=document.getElementById("twist-picker-"+i),b=document.querySelector(`[data-toggle-twists="${i}"]`);if(p&&b){p.classList.remove("hidden");b.setAttribute("aria-expanded","true");b.textContent="− Choose twists ("+state.timeline[i].twists.length+")"}return}
 const openRel=e.target.closest("[data-open-rel]");if(openRel){openRelationshipMenu(openRel.dataset.openRel,openRel.dataset.relA,openRel.dataset.relB);return}
 const setRel=e.target.closest("[data-set-rel]");if(setRel){state.relationships[setRel.dataset.relKey]=setRel.dataset.setRel;document.querySelector(".rel-backdrop")?.remove();render();return}
 const clearRel=e.target.closest("[data-clear-rel]");if(clearRel){delete state.relationships[clearRel.dataset.clearRel];document.querySelector(".rel-backdrop")?.remove();render();return}
 const ass=e.target.closest("[data-assignment]");if(ass){state.assignment=ass.dataset.assignment;render();return}
 if(e.target.closest("[data-randomize]")){randomizeTeams();render();return}
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
function randomizeTeams(){
 const tribeTeams=state.teams.slice(0,Number(state.settings.tribes));const shuffled=[...state.cast].sort(()=>Math.random()-.5);
 shuffled.forEach((p,i)=>p.team=tribeTeams[i%tribeTeams.length].id);
}
function init(){
 ensureData();
 if(!state.cast.some(p=>p.team)){randomizeTeams()}
 document.getElementById("navigation").addEventListener("click",()=>{});
 render();
}
init();