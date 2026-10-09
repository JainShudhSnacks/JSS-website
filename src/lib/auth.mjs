import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { AppError } from './domain.mjs';
const localSecret=randomBytes(32).toString('hex');
const secret=()=>process.env.SESSION_SECRET||(process.env.NODE_ENV!=='production'?localSecret:'');
const equal=(a,b)=>{const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y);};
export function configured(){return !!(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD?.length>=12&&process.env.SESSION_SECRET?.length>=32);}
export function credentials(email,password){return configured()&&equal(email,process.env.ADMIN_EMAIL)&&equal(password,process.env.ADMIN_PASSWORD);}
export function cookieFor(email){
 if(!secret())throw new AppError('Configure the owner login before using the admin panel.',503);
 const payload=Buffer.from(JSON.stringify({email,exp:Date.now()+8*3600000})).toString('base64url');
 const sig=createHmac('sha256',secret()).update(payload).digest('base64url');
 return `jss_admin=${payload}.${sig}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${process.env.VERCEL?'; Secure':''}`;
}
export function session(req){
 if(!secret())return null;
 const value=(req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('jss_admin='))?.slice(10);
 if(!value)return null;
 const [payload,sig]=value.split('.');if(!payload||!sig)return null;
 const actual=createHmac('sha256',secret()).update(payload).digest('base64url');if(!equal(actual,sig))return null;
 try{const data=JSON.parse(Buffer.from(payload,'base64url'));return data.exp>Date.now()?{email:data.email}:null;}catch{return null;}
}
export function requireAdmin(req){const user=session(req);if(!user)throw new AppError('Sign in to the owner studio.',401);return user;}
export function requireOrigin(req){
 if(['GET','HEAD'].includes(req.method))return;
 const origin=req.headers.get('origin');
 const target=new URL(req.url);
 let incoming;try{incoming=new URL(origin);}catch{}
 // Next's local adapter can use localhost for a request made to 127.0.0.1.
 const loopback=h=>['localhost','127.0.0.1'].includes(h);
 const localAlias=process.env.NODE_ENV!=='production'&&!process.env.VERCEL&&incoming&&loopback(target.hostname)&&loopback(incoming.hostname)&&target.protocol===incoming.protocol&&target.port===incoming.port;
 const expected=new Set([target.origin]);if(process.env.SITE_URL)expected.add(new URL(process.env.SITE_URL).origin);
 if(!incoming||(!expected.has(origin)&&!localAlias))throw new AppError('This request must come from the website.',403);
}
const attempts=new Map();
export function throttle(key,limit=10,windowMs=60000){
 const now=Date.now(),old=attempts.get(key);const state=old&&now<old.until?old:{count:0,until:now+windowMs};state.count++;attempts.set(key,state);
 if(attempts.size>2000)for(const[k,v]of attempts)if(now>v.until)attempts.delete(k);
 if(state.count>limit)throw new AppError('Please wait a moment before trying again.',429);
}
