import { siteOrigin, isPublicSite } from '@/lib/site.mjs';
export default function robots(){
 return isPublicSite()?{rules:{userAgent:'*',allow:'/',disallow:['/admin','/api/','/checkout','/order/']},sitemap:`${siteOrigin()}/sitemap.xml`}:{rules:{userAgent:'*',disallow:'/'}};
}
