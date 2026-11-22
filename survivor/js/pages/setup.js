export function renderSetup({state,heading,field,esc,rangeField}){
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