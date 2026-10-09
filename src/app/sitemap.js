import { siteOrigin, isPublicSite } from '@/lib/site.mjs';
export const dynamic='force-dynamic';
export default async function sitemap(){
 if(!isPublicSite())return [];
 const origin=siteOrigin();
 return ['', '/shop','/practices','/about','/contact','/policies'].map(path=>({url:origin+path,changeFrequency:'monthly',priority:path===''?1:0.7}));
}
