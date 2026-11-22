export function episodeCount(state){return Math.max(1,Number(state.settings.castSize)-(state.settings.finale==="Final 2"?2:3)+1)}
export function episodePhase(state,ep){return (Number(state.settings.castSize)-ep)>Number(state.settings.mergeAt)?"pre":"merge"} 
