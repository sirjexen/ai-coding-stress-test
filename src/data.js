import { createTask } from "./store.js";
const future=(days)=>{const d=new Date();d.setDate(d.getDate()+days);return d.toISOString().slice(0,10)};
export const seed = [
 createTask({id:"t1",title:"Design onboarding flow",description:"Map empty states and first-run checklist.",status:"progress",priority:"high",assignee:"Maya",due:future(2),tags:["design","growth"]}),
 createTask({id:"t2",title:"Harden API rate limits",description:"Add per-user buckets and structured telemetry.",status:"review",priority:"urgent",assignee:"Rafi",due:future(1),tags:["backend","security"]}),
 createTask({id:"t3",title:"Ship analytics dashboard",description:"Conversion, activation and retention cards.",status:"backlog",priority:"medium",assignee:"Nadia",due:future(6),tags:["frontend"]}),
 createTask({id:"t4",title:"Mobile navigation QA",description:"Verify keyboard, touch and narrow viewport behavior.",status:"done",priority:"medium",assignee:"Maya",due:future(-1),tags:["qa","mobile"]}),
 createTask({id:"t5",title:"Database migration rehearsal",description:"Dry-run migration and rollback on staging snapshot.",status:"progress",priority:"urgent",assignee:"Rafi",due:future(3),tags:["database","ops"]}),
 createTask({id:"t6",title:"Customer feedback digest",description:"Cluster top support themes into product opportunities.",status:"backlog",priority:"low",assignee:"Nadia",due:future(8),tags:["research"]})
];
