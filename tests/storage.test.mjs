import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {initialise,record,save,publicSnapshot} from '../src/lib/store.mjs';
test('catalogue edits persist in a real local database without reseeding',async()=>{
 const original=process.cwd(),dir=await fs.mkdtemp(path.join(os.tmpdir(),'jss-storage-test-'));process.chdir(dir);
 try{
  await initialise();const p=await record('products','hand-sev');await save('products',p.id,{...p,status:'archived'});
  const settings=await record('settings','business');await save('settings','business',{...settings,hours:'Owner-approved pickup hours'});
  await initialise();assert.equal((await record('products','hand-sev')).status,'archived');assert.equal((await publicSnapshot()).settings.hours,'Owner-approved pickup hours');
  assert.equal((await publicSnapshot()).products.some(p=>p.id==='hand-sev'),false);
  assert.ok((await fs.stat(path.join(dir,'.local','jss.sqlite'))).size>0);
 }finally{process.chdir(original);await fs.rm(dir,{recursive:true,force:true});}
});
