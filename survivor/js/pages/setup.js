export function renderSetup({state,heading,field,esc,rangeField}){
 const s=state.settings;
 const events=[
  {key:"quits",number:"01",title:"Player quits",description:"Allow a castaway to leave the game voluntarily.",detail:"VOLUNTARY EXIT"},
  {key:"expulsions",number:"02",title:"Expulsions",description:"Allow players to be removed from the game for rule violations.",detail:"RULE VIOLATION"},
  {key:"medical",number:"03",title:"Medical evacuations",description:"Allow a castaway to leave the game for medical reasons.",detail:"MEDICAL EXIT"}
 ];
 return heading("01 / FOUNDATION","Season setup","Set the format and identity of your season.",'<button class="btn danger" data-clear-all>Clear all</button>')+
 `<div class="setup-grid">
 <section class="setup-card setup-identity"><div class="section-head"><div><span class="setup-kicker">THE SEASON</span><h2>Season identity</h2><p>Give this season its name and visual identity.</p></div><span class="setup-index">01</span></div><div class="field-grid setup-identity-fields">
 ${field("Season title","title",s.title)}
 <div class="field setup-logo-field"><label>Season logo</label><div class="button-row"><button class="btn" data-url-modal="logo">Add / change image URL</button><span class="hint">${s.logo?"Image added":"Optional"}</span></div><div class="logo-preview" id="logo-preview">${s.logo?`<img src="${esc(s.logo)}" alt="Season logo">`:"NO LOGO"}</div></div>
 </div></section>
 <section class="setup-card setup-format"><div class="section-head"><div><span class="setup-kicker">THE GAME</span><h2>Game format</h2><p>Set the size and structure of the season.</p></div><span class="setup-index">02</span></div><div class="field-grid setup-format-fields">
 ${rangeField("Cast size","castSize",s.castSize,8,40)}
 ${rangeField("Starting tribes","tribes",s.tribes,2,6)}
 ${rangeField("Merge at (players remaining)","mergeAt",s.mergeAt,2,Math.max(2,s.castSize-1))}
 <div class="field"><label for="finale">Finale format</label><select id="finale" data-setting="finale">${["Final 2","Final 3"].map(v=>`<option ${s.finale===v?"selected":""}>${v}</option>`).join("")}</select></div>
 </div><p class="hint setup-format-note">Episode count is generated automatically from cast size and finale format.</p></section>
 <section class="setup-card setup-events"><div class="section-head"><div><span class="setup-kicker">UNEXPECTED MOMENTS</span><h2>Game events</h2><p>Choose which special exits can happen during the season.</p></div><span class="setup-index">03</span></div><div class="event-options">
 ${events.map(e=>`<label class="event-option" data-event-option="${e.key}"><input type="checkbox" data-setting-check="${e.key}" ${s[e.key]?"checked":""}><span class="event-option-main"><span class="event-option-number">${e.number}</span><span class="event-option-copy"><strong>${e.title}</strong><small>${e.description}</small></span></span><span class="event-option-meta"><span>${e.detail}</span><i aria-hidden="true"></i></span></label>`).join("")}
 </div></section></div>
 <div class="button-row setup-continue"><button class="btn primary" data-go="timeline">Continue to timeline & twists →</button></div>`;
}