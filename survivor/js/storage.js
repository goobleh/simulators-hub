const STORE_KEY="survivor-simulator-season-v1";
// Season data is intentionally session-only: refreshing starts a fresh season.
try{localStorage.removeItem(STORE_KEY)}catch{}
export function loadState(defaultState){return defaultState()}
export function saveState(state){const el=document.getElementById("save-state");if(el)el.textContent="SESSION ONLY";const mini=document.getElementById("season-mini");if(mini)mini.textContent=(state.settings.title||"NEW SEASON").toUpperCase()}
