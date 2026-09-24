export const STATUSES = ["backlog","progress","review","done"];

export function uid(prefix="task") {
  return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2,7);
}
export function createTask(input) {
  const title = String(input.title || "").trim();
  if (!title) throw new Error("Task title is required");
  const status = STATUSES.includes(input.status) ? input.status : "backlog";
  const priority = ["low","medium","high","urgent"].includes(input.priority) ? input.priority : "medium";
  return { id: input.id || uid(), title, description:String(input.description||"").trim(), status, priority,
    assignee: String(input.assignee||"Unassigned"), due: input.due || "", tags:Array.isArray(input.tags)?input.tags:[],
    createdAt: input.createdAt || new Date().toISOString(), updatedAt:new Date().toISOString() };
}
export function moveTask(tasks,id,status) {
  if (!STATUSES.includes(status)) throw new Error("Invalid status");
  return tasks.map(t => t.id === id ? {...t,status,updatedAt:new Date().toISOString()} : t);
}
export function upsertTask(tasks,task) {
  const normalized=createTask(task);
  const i=tasks.findIndex(t=>t.id===normalized.id);
  if(i<0) return [...tasks,normalized];
  const copy=[...tasks]; copy[i]={...tasks[i],...normalized,createdAt:tasks[i].createdAt}; return copy;
}
export function deleteTask(tasks,id){ return tasks.filter(t=>t.id!==id); }
export function filterTasks(tasks,{query="",priority="all",assignee="all"}={}) {
  const q=query.trim().toLowerCase();
  return tasks.filter(t => (!q || [t.title,t.description,t.assignee,...t.tags].join(" ").toLowerCase().includes(q))
    && (priority==="all" || t.priority===priority) && (assignee==="all" || t.assignee===assignee));
}
export function metrics(tasks) {
  const total=tasks.length, done=tasks.filter(t=>t.status==="done").length;
  const overdue=tasks.filter(t=>t.due && t.status!=="done" && new Date(t.due)<new Date()).length;
  return {total,done,overdue,completion:total?Math.round(done/total*100):0};
}
