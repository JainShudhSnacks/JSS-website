export function siteOrigin(){
 const value=process.env.SITE_URL|| (process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'http://localhost:3000');
 return new URL(value).origin;
}
export function isPublicSite(){
 return process.env.NODE_ENV==='production'&&(!process.env.VERCEL||process.env.VERCEL_ENV==='production')&&!siteOrigin().includes('localhost');
}
