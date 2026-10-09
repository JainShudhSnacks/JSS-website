import test from 'node:test';
import assert from 'node:assert/strict';
import {cookieFor,session,requireOrigin,requireAdmin} from '../src/lib/auth.mjs';
test('signed owner sessions reject tampering and unauthenticated access',()=>{
 const cookie=cookieFor('test-owner@example.com').split(';')[0];
 const req=new Request('http://localhost:3000/api/admin/data',{headers:{cookie}});
 assert.equal(session(req).email,'test-owner@example.com');
 const altered=new Request('http://localhost:3000/api/admin/data',{headers:{cookie:cookie+'tampered'}});
 assert.equal(session(altered),null);assert.throws(()=>requireAdmin(altered),/Sign in/);
});
test('mutations reject cross-origin and missing-origin requests',()=>{
 assert.throws(()=>requireOrigin(new Request('http://localhost:3000/api/admin/products',{method:'POST',headers:{origin:'https://wrong.example'}})),/website/);
 assert.throws(()=>requireOrigin(new Request('http://localhost:3000/api/admin/products',{method:'POST'})),/website/);
 assert.doesNotThrow(()=>requireOrigin(new Request('http://localhost:3000/api/admin/products',{method:'POST',headers:{origin:'http://localhost:3000'}})));
});
test('local preview allows the loopback alias on the same port only',()=>{
 const req=origin=>new Request('http://localhost:3000/api/admin/products',{method:'POST',headers:{origin}});
 assert.doesNotThrow(()=>requireOrigin(req('http://127.0.0.1:3000')));
 assert.throws(()=>requireOrigin(req('http://127.0.0.1:3001')),/website/);
 assert.throws(()=>requireOrigin(req('https://127.0.0.1:3000')),/website/);
});
test('production does not allow local preview origin aliases',()=>{
 const before=process.env.NODE_ENV;process.env.NODE_ENV='production';
 try{assert.throws(()=>requireOrigin(new Request('http://localhost:3000/api/admin/products',{method:'POST',headers:{origin:'http://127.0.0.1:3000'}})),/website/);}finally{if(before===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=before;}
});
