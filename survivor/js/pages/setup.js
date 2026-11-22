export function renderSetup({state,heading,field,esc,rangeField}){
 const s=state.settings;
 return heading("01 / FOUNDATION","Season setup","Set the format and identity of your season.",'<button class="btn danger" data-clear-all>Clear all</button>')+
 `<div class="setup-grid">
 <section class="setup-card"><div class="section-head"><h2>Season identity</h2></div><div class="field-grid">
 ${field("Season title","title",s.title)}
 <div class="field"><label>Season logo</label><div class="button-row"><button class="btn" data-url-modal="logo">Add / change image URL</button><span class="hint">${s.logo?"Image added":"Optional"}</span></div><div class="logo-preview" id="logo-preview">${s.logo?`<img src="${esc(s.logo)}" alt="Season logo">`:"NO LOGO"}</div></div>
 </div></section>
 <section class="setup-card"><div class="section-head"><h2>Game format</h2></div><div class="field-grid">
 ${rangeField("Cast size","castSize",s.castSize,8,40)}
 ${rangeField("Starting tribes","tribes",s.tribes,2,6)}
 ${rangeField("Merge at (players remaining)","mergeAt",s.mergeAt,2,Math.max(2,s.castSize-1))}
 <div class="field"><label for="finale">Finale format</label><select id="finale" data-setting="finale">${["Final 2","Final 3"].map(v=>`<option ${s.finale===v?"selected":""}>${v}</option>`).join("")}</select></div>
 </div><p class="hint">Episode count is generated automatically from cast size and finale format.</p></section>
 <section class="setup-card"><div class="section-head"><h2>Game events</h2></div><div class="check-list">
 ${["quits","expulsions","medical"].map((k,i)=>`<label class="check-row"><input type="checkbox" data-setting-check="${k}" ${s[k]?"checked":""}> ${["Allow quits","Allow expulsions","Allow medical evacuations"][i]}</label>`).join("")}
 </div></section></div>
 <div class="button-row"><button class="btn primary" data-go="timeline">Continue to timeline & twists →</button></div>`;
}