import Storefront from '@/components/Storefront';
import { publicSnapshot } from '@/lib/store.mjs';
export default async function NotFound(){
 return <Storefront initialData={await publicSnapshot()} path="unlisted"/>;
}
