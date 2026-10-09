import { publicSnapshot } from '@/lib/store.mjs';
import { siteOrigin, isPublicSite } from '@/lib/site.mjs';
export const dynamic='force-dynamic';
export default async function sitemap(){
 if(!isPublicSite())return [];
 const {products}=await publicSnapshot();const origin=siteOrigin();
 return ['', '/shop','/practices','/about','/contact','/policies',...products.map(p=>`/product/${p.id}`)].map(path=>({url:origin+path,changeFrequency:path.startsWith('/product/')?'weekly':'monthly',priority:path===''?1:0.7}));
}
