import {loadState,saveState} from "./storage.js";
const defaultState=()=>({archetypeStats:{},settings:{title:"Untitled Season",logo:"",castSize:18,tribes:3,mergeAt:11,quits:true,expulsions:true,medical:true,finale:"Final 3"},cast:[],teams:[],assignment:"random",timeline:[],relationships:{},alliances:[]});
export let state=loadState(defaultState);
export function save(){saveState(state)}
export function ensureData(){
 const n=Number(state.settings.castSize)||18;
 while(state.cast.length<n)state.cast.push({id:crypto.randomUUID(),name:"",nicknameOn:false,nickname:"",image:"",gender:"",archetype:"",class:"",stats:[5,5,5,5,5,5,5],team:""});
 if(state.cast.length>n)state.cast=state.cast.slice(0,n);
 const t=Number(state.settings.tribes)||2;
 while(state.teams.length<t+1)state.teams.push({id:"team"+state.teams.length,name:state.teams.length===t?"Merge":"Team "+(state.teams.length+1),label:"",color:["#777777","#a5a5a5","#555555","#888888"][state.teams.length%4]});
 state.teams=state.teams.slice(0,t+1);
 state.teams[t].name=state.teams[t].name||"Merge";
}
