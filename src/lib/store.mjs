import fs from 'node:fs/promises';
import path from 'node:path';
import { seedProducts, seedSettings, categories } from './catalogue.mjs';
import { AppError } from './domain.mjs';

const remote=()=>!!(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY);
let dbPromise;
async function db(){
 if(!dbPromise) dbPromise=(async()=>{
   if(process.env.VERCEL) throw new AppError('Connect the production database before saving changes.',503);
   const {DatabaseSync}=await import('node:sqlite');
   const dir=path.join(process.cwd(),'.local');await fs.mkdir(dir,{recursive:true});
   const d=new DatabaseSync(path.join(dir,'jss.sqlite'));d.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS records(kind TEXT NOT NULL,id TEXT NOT NULL,payload TEXT NOT NULL,PRIMARY KEY(kind,id));');return d;
 })();return dbPromise;
}
async function rest(query,options={}){
 const r=await fetch(`${process.env.SUPABASE_URL}/rest/v1/jss_records?${query}`,{...options,headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json',...options.headers},cache:'no-store'});
 if(!r.ok)throw new AppError('The database could not complete this request. Try again shortly.',503);
 const text=await r.text();return text?JSON.parse(text):null;
}
export async function records(kind){
 if(remote())return (await rest(`kind=eq.${encodeURIComponent(kind)}&select=payload`)).map(r=>r.payload);
 if(process.env.VERCEL)return kind==='products'?structuredClone(seedProducts):kind==='settings'?[structuredClone(seedSettings)]:[];
 const d=await db();return d.prepare('SELECT payload FROM records WHERE kind=?').all(kind).map(r=>JSON.parse(r.payload));
}
export async function record(kind,id){
 if(remote())return (await rest(`kind=eq.${encodeURIComponent(kind)}&id=eq.${encodeURIComponent(id)}&select=payload`))[0]?.payload||null;
 if(process.env.VERCEL)return kind==='products'?seedProducts.find(p=>p.id===id)||null:kind==='settings'?seedSettings:null;
 const d=await db();const row=d.prepare('SELECT payload FROM records WHERE kind=? AND id=?').get(kind,id);return row?JSON.parse(row.payload):null;
}
export async function save(kind,id,payload){
 if(remote()){await rest('on_conflict=kind,id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({kind,id,payload,updated_at:new Date().toISOString()})});return payload;}
 const d=await db();d.prepare('INSERT INTO records(kind,id,payload) VALUES(?,?,?) ON CONFLICT(kind,id) DO UPDATE SET payload=excluded.payload').run(kind,id,JSON.stringify(payload));return payload;
}
let initPromise;
export async function initialise(){
 if(!initPromise)initPromise=(async()=>{
   if(process.env.VERCEL&&!remote())return;
   if(!(await record('settings','business')))await save('settings','business',seedSettings);
   // Idempotent seeding must never overwrite edits or resurrect archived items.
   if(!(await record('meta','catalogue-seeded'))){
     for(const p of seedProducts)if(!(await record('products',p.id)))await save('products',p.id,p);
     await save('meta','catalogue-seeded',{version:1});
   }
 })();try{await initPromise;}catch(e){initPromise=null;throw e;}
}
export async function publicSnapshot(){
 await initialise();const [products,settings]=await Promise.all([records('products'),record('settings','business')]);
 return {products:products.filter(p=>p.status==='published').sort((a,b)=>a.position-b.position),settings:settings||seedSettings,categories,
 localPreview:process.env.NODE_ENV!=='production'&&!process.env.VERCEL};
}
