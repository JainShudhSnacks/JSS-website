import Storefront from '@/components/Storefront';
import { publicSnapshot } from '@/lib/store.mjs';
import { notFound, redirect } from 'next/navigation';
import { isPublicSite } from '@/lib/site.mjs';

export const dynamic = 'force-dynamic';

function routeParts(query) {
  if (!query._jssPage) return [];
  if (typeof query._jssPage !== 'string') return ['invalid'];
  return [query._jssPage];
}

export async function generateMetadata({ searchParams }) {
  const requested = routeParts(await searchParams);
  const slug = requested[0] === 'product' ? ['shop'] : requested;
  const titles = { shop: 'Browse the range', practices: 'Our shuddh practices', about: 'Our story', contact: 'Call & visit', admin: 'Owner studio', policies: 'Customer information' };
  if(!slug.length)return {title:{absolute:'Jain Shudh Snacks — शुद्ध स्वाद, शुद्ध जीवन'},alternates:{canonical:'/'}};
  const privatePage=['admin','order','checkout'].includes(slug[0]);
  const title=titles[slug[0]];
  return {title:{absolute:`${title||'Page unavailable'} · Jain Shudh Snacks`},...(!privatePage?{alternates:{canonical:'/'+slug.join('/')}}:{}),...(!isPublicSite()||privatePage?{robots:{index:false,follow:false}}:{})};
}

export default async function Page({ searchParams }) {
  const slug = routeParts(await searchParams);
  if(slug[0]==='product')redirect('/shop');
  const data = await publicSnapshot();
  const root=slug[0];
  if(slug.length&&(!['shop','practices','about','contact','admin','policies'].includes(root)||slug.length!==1))notFound();
  return <Storefront initialData={data} path={slug.join('/')} />;
}
