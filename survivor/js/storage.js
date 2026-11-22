const STORE_KEY="survivor-simulator-season-v1"; 
export function loadState(defaultState){try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORE_KEY)||"{}")}}catch{return defaultState()}}
export function saveState(state){localStorage.setItem(STORE_KEY,JSON.stringify(state));const el=document.getElementById("save-state");if(el)el.textContent="SAVED LOCALLY";const mini=document.getElementById("season-mini");if(mini)mini.textContent=(state.settings.title||"NEW SEASON").toUpperCase()}
