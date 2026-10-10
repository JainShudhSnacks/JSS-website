'use client';

import Link from 'next/link';
import { Heart, Phone, ArrowUpRight, X } from 'lucide-react';
import { useShop, Modal, FoodArt } from './Storefront';
import { favouriteProducts } from '@/lib/favourites.mjs';
import { priceFor, money } from '@/lib/domain.mjs';
import { productArtwork } from '@/lib/product-artwork.mjs';

export function FavouriteButton({ product, compact = false }) {
  const { favourites, toggleSaved, tx } = useShop();
  const saved = favourites.includes(product.id);
  return <button type="button" className={`favourite-button ${compact ? 'compact' : 'with-label'}${saved ? ' saved' : ''}`} aria-pressed={saved}
    aria-label={saved ? tx(`Remove ${product.nameEn} from favourites`, `${product.nameHi} पसंदीदा से हटाएँ`) : tx(`Save ${product.nameEn} to favourites`, `${product.nameHi} पसंदीदा में सहेजें`)}
    onClick={() => toggleSaved(product)}><Heart size={18} fill={saved ? 'currentColor' : 'none'} />{!compact && <span>{saved ? tx('Saved to favourites', 'पसंदीदा में सहेजा') : tx('Save my favourite', 'पसंदीदा में सहेजें')}</span>}</button>;
}

export default function FavouritesDrawer({ onClose }) {
  const { data, favourites, toggleSaved, tx } = useShop();
  const products = favouriteProducts(favourites, data.products);
  return <Modal className="favourites-drawer" label={tx('My favourites', 'मेरे पसंदीदा')} onClose={onClose}>
    <div className="favourites-heading"><span className="label-line"><Heart size={15} />{tx('A LITTLE LIST, JUST FOR YOU', 'आपकी अपनी छोटी सूची')}</span><h2>{tx('My favourites.', 'मेरे पसंदीदा।')}<span>{products.length.toString().padStart(2, '0')}</span></h2><p>{tx('Keep your picks handy when you call Mayank. Saved on this browser.', 'मयंक को कॉल करते समय अपनी पसंद की सूची सामने रखें। इस ब्राउज़र में सहेजी गई।')}</p></div>
    {products.length ? <ul className="favourites-items">{products.map(p => {
      const pack = p.packs[0];
      return <li key={p.id}><div><FoodArt productId={p.id} category={p.category} image={p.image} alt={tx(p.nameEn, p.nameHi)} />{productArtwork(p).illustrative && <span className="favourites-art-label">{tx('Illustration', 'उदाहरण चित्र')}</span>}</div><div><h3>{tx(p.nameEn, p.nameHi)}</h3><p>{money(priceFor(pack))}<span>{p.priceUnitConfirmed ? ` / ${tx(pack.labelEn, pack.labelHi || pack.labelEn)}` : tx(' · confirm pack', ' · पैक पूछें')}</span></p><small className={p.available ? '' : 'unavailable'}>{p.available ? tx('Available · confirm on your call', 'उपलब्ध · कॉल पर पुष्टि करें') : tx('Ask about availability', 'उपलब्धता पूछें')}</small></div><button type="button" className="icon-button" aria-label={tx(`Remove ${p.nameEn} from favourites`, `${p.nameHi} पसंदीदा से हटाएँ`)} onClick={() => toggleSaved(p)}><X size={17} /></button></li>;
    })}</ul> : <div className="favourites-empty"><Heart size={45} /><h3>{tx('A favourite starts with a little heart.', 'एक दिल से शुरू होती है पसंद।')}</h3><p>{tx('Tap the heart beside a snack to keep it here for later.', 'किसी उत्पाद के दिल पर टैप करें और उसे यहाँ सहेजें।')}</p><Link className="button outline" href="/shop" onClick={onClose}>{tx('Explore the range', 'हमारी रेंज देखें')}<ArrowUpRight size={17} /></Link></div>}
    <div className="favourites-call"><a className="button primary" href={`tel:+91${data.settings.phone}`}><Phone size={18} />{tx('Call Mayank', 'मयंक को कॉल करें')}<ArrowUpRight size={17} /></a><p>{tx('Confirm quantities, packs, prices and delivery together on the call.', 'मात्रा, पैक, कीमत और डिलीवरी की पुष्टि कॉल पर करें।')}</p></div>
  </Modal>;
}
