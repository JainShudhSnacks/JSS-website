import { NextResponse } from 'next/server';
import { randomBytes, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { initialise, records, record, save, publicSnapshot } from '@/lib/store.mjs';
import { AppError, validateProduct, validateSettings } from '@/lib/domain.mjs';
import { credentials, configured, cookieFor, session, requireAdmin, requireOrigin, throttle } from '@/lib/auth.mjs';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function body(req){const text=await req.text();if(text.length>150000)throw new AppError('This request is too large.',413);try{return JSON.parse(text);}catch{throw new AppError('Check the submitted information.');}}
async function audit(user,action,id){await save('audit',randomUUID(),{who:user.email,action,id,at:new Date().toISOString()});}
async function handler(req){
 try{
  const requestUrl=new URL(req.url);
  const route=requestUrl.pathname.startsWith('/api/')?requestUrl.pathname.slice(5):requestUrl.searchParams.getAll('endpoint').join('/');const parts=route.split('/');
  if(['payments','order','orders'].includes(parts[0])||route==='admin/orders')throw new AppError('Orders are taken by phone. Please call Jain Shudh Snacks.',404);
  requireOrigin(req);
  await initialise();
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'local';

  if(route==='catalogue'&&req.method==='GET')return json(await publicSnapshot());
  if(route==='admin/session'&&req.method==='GET')return json({user:session(req),configured:configured()});
  if(route==='admin/login'&&req.method==='POST'){
   throttle('login:'+ip,6,15*60000);const input=await body(req);
   if(!configured())throw new AppError('Set the owner email, password and session secret before production sign-in.',503);
   if(!credentials(input.email,input.password))throw new AppError('The email or password is incorrect.',401);
   const res=json({user:{email:process.env.ADMIN_EMAIL}});res.headers.set('Set-Cookie',cookieFor(process.env.ADMIN_EMAIL));return res;
  }
  if(route==='admin/preview-login'&&req.method==='POST'){
   const url=new URL(req.url);if(process.env.NODE_ENV==='production'||process.env.VERCEL||!['localhost','127.0.0.1'].includes(url.hostname))throw new AppError('Preview access is only available on the local development server.',403);
   const res=json({user:{email:'Local owner preview'}});res.headers.set('Set-Cookie',cookieFor('Local owner preview'));return res;
  }
  if(route==='admin/logout'&&req.method==='POST'){const res=json({ok:true});res.headers.set('Set-Cookie','jss_admin=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');return res;}

  if(route.startsWith('admin/')){
   const user=requireAdmin(req);
   if(route==='admin/data'&&req.method==='GET')return json({products:await records('products'),settings:await record('settings','business')});
   if(route==='admin/products'&&req.method==='POST'){
    const p=validateProduct(await body(req));p.id=p.id||`${p.nameEn.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)}-${randomBytes(3).toString('hex')}`;
    if(!/^[a-z0-9-]{1,100}$/.test(p.id))throw new AppError('Use a valid product identifier.');
    p.updatedAt=new Date().toISOString();await save('products',p.id,p);await audit(user,'save-product',p.id);return json({product:p});
   }
   if(route==='admin/settings'&&req.method==='POST'){
    const input=await body(req),previous=await record('settings','business'),updated=validateSettings(input,previous);
    await save('settings','business',updated);await audit(user,'save-settings','business');return json({settings:updated});
   }
   if(route==='admin/upload'&&req.method==='POST'){
    const form=await req.formData(),file=form.get('image');if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw new AppError('Choose a JPG, PNG or WebP image under 5 MB.');
    const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type],id=`${randomUUID()}.${ext}`,bytes=Buffer.from(await file.arrayBuffer());let url;
    if(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY){
      const r=await fetch(`${process.env.SUPABASE_URL}/storage/v1/object/product-images/${id}`,{method:'POST',headers:{Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,'Content-Type':file.type},body:bytes});if(!r.ok)throw new AppError('The image could not be uploaded.',502);url=`${process.env.SUPABASE_URL}/storage/v1/object/public/product-images/${id}`;
    }else{
      if(process.env.VERCEL)throw new AppError('Connect production image storage first.',503);
      const dir=path.join(process.cwd(),'.local','images');await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,id),bytes);url=`/api/image/${id}`;
    }await audit(user,'upload-image',id);return json({url});
   }
   throw new AppError('Admin action not found.',404);
  }

  if(parts[0]==='image'&&req.method==='GET'){
   if(!/^[a-f0-9-]+\.(png|jpg|webp)$/.test(parts[1]||''))throw new AppError('Image not found.',404);
   try{const bytes=await fs.readFile(path.join(process.cwd(),'.local','images',parts[1]));const ext=parts[1].split('.').pop();return new NextResponse(bytes,{headers:{'Content-Type':ext==='jpg'?'image/jpeg':`image/${ext}`,'Cache-Control':'public, max-age=31536000, immutable'}});}catch{throw new AppError('Image not found.',404);}
  }
  throw new AppError('Page not found.',404);
 }catch(error){
  if(!(error instanceof AppError))console.error('JSS request failed:',error.message);
  return json({error:error instanceof AppError?error.message:'This action could not be completed. Please try again.'},error.status||500);
 }
}
export const GET=handler;export const POST=handler;
