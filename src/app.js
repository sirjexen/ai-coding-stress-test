import { seed } from "./data.js";
import { STATUSES,createTask,moveTask,upsertTask,deleteTask,filterTasks,metrics } from "./store.js";

const KEY="orbit-state-v1";
const labels={backlog:"Backlog",progress:"In progress",review:"Review",done:"Done"};
let state=load();
let dragged=null;
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function load(){try{const x=JSON.parse(localStorage.getItem(KEY));if(x?.tasks)return x}catch{} return {tasks:seed,activity:["Workspace initialized"],theme:"dark"}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function log(message){state.activity=[message,...state.activity].slice(0,20)}
function render(){
 document.documentElement.dataset.theme=state.theme;
 const query=$("#search").value, priority=$("#priority").value, assignee=$("#assignee").value;
 const visible=filterTasks(state.tasks,{query,priority,assignee});
 const m=metrics(state.tasks);
 $("#metrics").innerHTML=[
   ["Total tasks",m.total],["Completed",m.done],["Completion",m.completion+"%"],["Overdue",m.overdue]
 ].map(([k,v])=>`<article class="metric"><span>${k}</span><strong>${v}</strong></article>`).join("");
 $("#board").innerHTML=STATUSES.map(status=>{
   const cards=visible.filter(t=>t.status===status);
   return `<section class="column" data-status="${status}"><header><b>${labels[status]}</b><span>${cards.length}</span></header>
   <div class="dropzone">${cards.map(card).join("") || '<div class="empty">Drop tasks here</div>'}</div>
   <button class="add-inline" data-add="${status}">＋ Add task</button></section>`;
 }).join("");
 $("#activity").innerHTML=state.activity.map((x,i)=>`<li><span class="pulse"></span><div>${esc(x)}<small>${i?"Earlier":"Just now"}</small></div></li>`).join("");
 bindBoard();
 save();
}
function card(t){return `<article class="task" draggable="true" data-id="${t.id}">
 <div class="task-top"><span class="priority ${t.priority}">${t.priority}</span><button class="icon edit" aria-label="Edit task">•••</button></div>
 <h3>${esc(t.title)}</h3><p>${esc(t.description)}</p>
 <div class="tags">${t.tags.map(x=>`<span>#${esc(x)}</span>`).join("")}</div>
 <footer><span class="avatar">${esc(t.assignee.slice(0,1))}</span><span>${esc(t.assignee)}</span><time>${t.due||"No due date"}</time></footer>
 </article>`}
function bindBoard(){
 document.querySelectorAll(".task").forEach(el=>{
   el.ondragstart=()=>{dragged=el.dataset.id;el.classList.add("dragging")};
   el.ondragend=()=>{dragged=null;el.classList.remove("dragging")};
   el.querySelector(".edit").onclick=()=>openModal(state.tasks.find(t=>t.id===el.dataset.id));
 });
 document.querySelectorAll(".column").forEach(col=>{
   col.ondragover=e=>{e.preventDefault();col.classList.add("over")};
   col.ondragleave=()=>col.classList.remove("over");
   col.ondrop=e=>{e.preventDefault();col.classList.remove("over");if(!dragged)return;
     const t=state.tasks.find(x=>x.id===dragged); state.tasks=moveTask(state.tasks,dragged,col.dataset.status);
     log(`${t.title} moved to ${labels[col.dataset.status]}`); render();
   };
 });
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>openModal({status:b.dataset.add}));
}
function openModal(task={}){
 const f=$("#taskForm"); f.reset();
 f.elements.id.value=task.id||""; f.elements.title.value=task.title||""; f.elements.description.value=task.description||"";
 f.elements.status.value=task.status||"backlog"; f.elements.priority.value=task.priority||"medium";
 f.elements.assignee.value=task.assignee||"Maya"; f.elements.due.value=task.due||""; f.elements.tags.value=(task.tags||[]).join(", ");
 $("#deleteTask").hidden=!task.id; $("#modalTitle").textContent=task.id?"Edit task":"Create task"; $("#taskDialog").showModal();
}
$("#taskForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const old=state.tasks.find(t=>t.id===fd.get("id"));
 const task=createTask({id:fd.get("id")||undefined,title:fd.get("title"),description:fd.get("description"),status:fd.get("status"),priority:fd.get("priority"),assignee:fd.get("assignee"),due:fd.get("due"),tags:String(fd.get("tags")).split(",").map(x=>x.trim()).filter(Boolean),createdAt:old?.createdAt});
 state.tasks=upsertTask(state.tasks,task);log((old?"Updated ":"Created ")+task.title);$("#taskDialog").close();render()};
$("#deleteTask").onclick=()=>{const id=$("#taskForm").elements.id.value;const t=state.tasks.find(x=>x.id===id);state.tasks=deleteTask(state.tasks,id);log("Deleted "+t.title);$("#taskDialog").close();render()};
$("#cancel").onclick=()=>$("#taskDialog").close();
$("#newTask").onclick=()=>openModal();
$("#theme").onclick=()=>{state.theme=state.theme==="dark"?"light":"dark";render()};
["search","priority","assignee"].forEach(id=>$("#"+id).addEventListener(id==="search"?"input":"change",render));
$("#export").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download="orbit-workspace.json";a.click();URL.revokeObjectURL(a.href)};
$("#importFile").onchange=async e=>{try{const x=JSON.parse(await e.target.files[0].text());if(!Array.isArray(x.tasks))throw 0;state={...state,...x};log("Imported workspace snapshot");render()}catch{alert("Invalid workspace JSON")}};
$("#reset").onclick=()=>{if(confirm("Reset demo data?")){state={tasks:seed,activity:["Workspace reset"],theme:state.theme};render()}};
$("#command").onclick=()=>$("#palette").showModal();
$("#paletteInput").oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#commands button").forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q))};
$("#commands").onclick=e=>{const action=e.target.closest("button")?.dataset.action;if(!action)return;$("#palette").close();({new:()=>openModal(),theme:()=>$("#theme").click(),export:()=>$("#export").click(),reset:()=>$("#reset").click()})[action]?.()};
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#palette").showModal();setTimeout(()=>$("#paletteInput").focus(),0)}if(e.key==="n"&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();openModal()}});
render();
