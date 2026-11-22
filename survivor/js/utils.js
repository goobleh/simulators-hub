import {RELATIONSHIPS} from "./data/relationships.js";
export function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
export function heading(kicker,title,desc,action=""){return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`}
export function field(label,key,value,type="text",extra=""){return `<div class="field"><label for="${key}">${label}</label><input id="${key}" data-setting="${key}" type="${type}" value="${esc(value)}" ${extra}></div>`}
export function rangeField(label,key,value,min,max){return `<div class="field range-field"><label for="range-${key}">${label}</label><div class="range-line"><input id="range-${key}" type="range" min="${min}" max="${max}" value="${value}" data-range-setting="${key}"><output class="range-value" id="value-${key}">${value}</output></div></div>`}
export function displayName(p){if(p.nicknameOn&&p.nickname.trim())return p.nickname.trim();return (p.name||"").trim().split(/\s+/)[0]||""}
export function safeColor(c){if(/^#[0-9a-fA-F]{6}$/.test(c||""))return c;if(/^linear-gradient\([0-9a-zA-Z#.,%\s-]+\)$/.test(c||"")&&/#[0-9a-fA-F]{6}/.test(c))return c;return "#555555"}
export function relColor(value){const r=RELATIONSHIPS.find(x=>x.name===value);return r?r.color:"#242424"}
