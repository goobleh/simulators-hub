import {RELATIONSHIPS} from "../data/relationships.js";
export function relColor(value){const relationship=RELATIONSHIPS.find(item=>item.name===value);return relationship?relationship.color:"#242424"}
export function openRelationshipMenu(state,key,a,b,esc,displayName,RELATIONSHIPS){key,a,b){
 document.querySelector(".rel-backdrop")?.remove();
 const pa=state.cast.find(p=>p.id===a),pb=state.cast.find(p=>p.id===b),current=state.relationships[key]||"";
 const backdrop=document.createElement("div");backdrop.className="rel-backdrop";backdrop.innerHTML=`<section class="rel-menu" role="dialog" aria-modal="true"><h3>${esc(displayName(pa)||"Castaway")} ↔ ${esc(displayName(pb)||"Castaway")}</h3><p>Choose one shared relationship for both players.</p><div class="rel-options">${RELATIONSHIPS.map(r=>`<button class="rel-choice ${current===r.name?"active":""}" data-set-rel="${esc(r.name)}" data-rel-key="${esc(key)}" style="border-left:4px solid ${r.color}">${r.name}<small>${r.kind==="good"?"Positive":r.kind==="bad"?"Negative":"Neither"} relationship</small></button>`).join("")}</div><button class="btn subtle rel-clear" data-clear-rel="${esc(key)}">Clear relationship</button></section>`;
 backdrop.addEventListener("click",e=>{if(e.target===backdrop)backdrop.remove()});document.body.appendChild(backdrop);
}
