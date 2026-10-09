import Storefront from '@/components/Storefront';
import { publicSnapshot } from '@/lib/store.mjs';
import { notFound } from 'next/navigation';
import { isPublicSite } from '@/lib/site.mjs';

export const dynamic = 'force-dynamic';

function routeParts(query) {
  if (!query._jssPage) return [];
  if (typeof query._jssPage !== 'string') return ['invalid'];
  if (query._jssPage === 'product') return ['product', typeof query._jssProduct === 'string' ? query._jssProduct : ''];
  return [query._jssPage];
}

export async function generateMetadata({ searchParams }) {
  const slug = routeParts(await searchParams);
  const titles = { shop: 'Browse the range', practices: 'Our shuddh practices', about: 'Our story', contact: 'Call & visit', admin: 'Owner studio', policies: 'Customer information' };
  if(!slug.length)return {title:{absolute:'Jain Shudh Snacks — शुद्ध स्वाद, शुद्ध जीवन'},alternates:{canonical:'/'}};
  const privatePage=['admin','order','checkout'].includes(slug[0]);
  let title=titles[slug[0]],description;
  if(slug[0]==='product'){
    const {products}=await publicSnapshot();const p=products.find(p=>p.id===slug[1]);
    title=p?`${p.nameEn} · ${p.nameHi}`:'Product unavailable';
    if(p)description=p.descriptionEn||`Explore ${p.nameEn} from Jain Shudh Snacks, Indore. Check pack details and availability.`;
  }
  return {title:{absolute:`${title||'Page unavailable'} · Jain Shudh Snacks`},...(description?{description}:{}),...(!privatePage?{alternates:{canonical:'/'+slug.join('/')}}:{}),...(!isPublicSite()||privatePage?{robots:{index:false,follow:false}}:{})};
}

export default async function Page({ searchParams }) {
  const slug = routeParts(await searchParams);
  const data = await publicSnapshot();
  const root=slug[0];
  if(slug.length&&(!['shop','practices','about','contact','admin','policies','product'].includes(root)||(root==='product'?slug.length!==2:slug.length!==1)))notFound();
  if(root==='product'&&!data.products.some(p=>p.id===slug[1]))notFound();
  return <Storefront initialData={data} path={slug.join('/')} />;
}
