'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, ArrowRight, Leaf, Wheat, Clock3, Phone, MapPin, Truck, Package, Sparkles, ChevronDown, Pause, Play } from 'lucide-react';
import { useShop, FoodArt, ProductCard, Faq } from './Storefront';

const categoryCopy = {
  namkeen: ['The crunch that feels like home.', 'घर जैसा अपना कुरकुरा स्वाद।'],
  chips: ['Golden little things. Big little joys.', 'सुनहरे चिप्स। छोटी-छोटी खुशियाँ।'],
  bakery: ['Your cup of chai has good company.', 'आपकी चाय के लिए अच्छा साथ।'],
  papad: ['A crisp little addition to your day.', 'आपके दिन में थोड़ी कुरकुराहट।'],
  other: ['A little more to munch, a lot to explore.', 'थोड़ा और चबाएँ, नए स्वाद अपनाएँ।'],
  pantry: ['Good beginnings for everyday cooking.', 'रोज़ के भोजन की अच्छी शुरुआत।'],
};

const moments = [
  { id: 'chai', en: 'Chai time', hi: 'चाय का समय', categories: ['bakery', 'namkeen'], copy: ['Pour a cup. Pick a favourite.', 'चाय बनाएँ। अपना पसंदीदा चुनें।'] },
  { id: 'crunch', en: 'Craving a crunch', hi: 'कुरकुरा खाने का मन', categories: ['chips', 'papad', 'other'], copy: ['For that just-one-more kind of moment.', 'जब मन कहे, बस एक और।'] },
  { id: 'home', en: 'Stock the pantry', hi: 'रसोई के लिए', categories: ['pantry'], copy: ['Everyday essentials, all in one place.', 'रोज़ की ज़रूरतें, एक जगह।'] },
  { id: 'away', en: 'A taste of Indore', hi: 'इंदौर का स्वाद', national: true, copy: ['Namkeen and biscuits that can travel to you.', 'नमकीन और बिस्किट, आपके शहर तक।'] },
];

function Star({ className = '' }) {
  return <svg className={`snack-star ${className}`} viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0 59 32 85 15 68 41 100 50 68 59 85 85 59 68 50 100 41 68 15 85 32 59 0 50 32 41 15 15 41 32Z" fill="currentColor" /></svg>;
}

function IndoreStamp() {
  return <div className="indore-stamp" aria-label="Made in Indore, since 2022"><svg viewBox="0 0 120 120" aria-hidden="true"><defs><path id="indore-stamp-circle" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs><text><textPath href="#indore-stamp-circle" textLength="267">MADE IN INDORE · SINCE 2022 · </textPath></text></svg><Leaf size={29} /></div>;
}

export default function ModernHome() {
  const { data, tx, lang } = useShop();
  const [category, setCategory] = useState('namkeen');
  const [moment, setMoment] = useState('chai');
  const [motionPaused, setMotionPaused] = useState(false);
  const pageRef = useRef(null), stageRef = useRef(null);
  const selected = data.categories.find(c => c.id === category) || data.categories[0];
  const categoryProducts = data.products.filter(p => p.category === selected.id);
  const categoryPicks = [...categoryProducts].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 2);
  const currentMoment = moments.find(m => m.id === moment);
  const momentProducts = data.products.filter(p => currentMoment.national ? p.national : currentMoment.categories.includes(p.category));
  const momentPicks = [...momentProducts].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 4);

  useEffect(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    root.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    root.classList.add('motion-ready');
    return () => { observer.disconnect(); root.classList.remove('motion-ready'); };
  }, []);

  const tilt = event => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    stageRef.current.style.setProperty('--tilt-x', `${((event.clientX - box.left) / box.width - .5) * 12}px`);
    stageRef.current.style.setProperty('--tilt-y', `${((event.clientY - box.top) / box.height - .5) * 10}px`);
  };
  const resetTilt = () => { stageRef.current.style.setProperty('--tilt-x', '0px'); stageRef.current.style.setProperty('--tilt-y', '0px'); };

  return <div className={`modern-home${motionPaused ? ' motion-paused' : ''}`} ref={pageRef}>
    <section className="snack-hero">
      <div className="section-width snack-hero-grid">
        <div className="snack-hero-copy">
          <div className="label-line"><span className="little-dot" />{tx('FROM OUR FAMILY, IN INDORE', 'इंदौर में, हमारे परिवार की ओर से')}</div>
          <h1>{tx('Big on', 'भरपूर')}<br /><span className="crunch-word">{tx('crunch.', 'कुरकुराहट।')}<svg viewBox="0 0 450 22" preserveAspectRatio="none" aria-hidden="true"><path d="M3 15Q112-2 222 12T447 5" /></svg></span><br /><span className="hero-care-line">{tx('Made with care.', 'देखभाल के साथ।')}</span></h1>
          <p className="snack-hero-description">{tx('Familiar flavours. Thoughtful preparation. Your everyday favourites, made in our own facility.', 'अपने स्वाद। तैयारी में पूरा ध्यान। आपके रोज़ के पसंदीदा उत्पाद, हमारी अपनी इकाई में तैयार।')}</p>
          <Link className="button primary hero-explore" href="/shop">{tx('Find your favourite', 'अपना पसंदीदा चुनें')}<span><ArrowUpRight size={21} /></span></Link>
          <a href="#snack-shelf" className="hero-scroll"><ArrowDown size={15} />{tx('Take a little look around', 'हमारी रेंज से मिलिए')}</a>
        </div>
        <div className="snack-stage" ref={stageRef} onPointerMove={tilt} onPointerLeave={resetTilt}>
          <div className="snack-stage-arch"><span aria-hidden="true">शुद्ध</span></div>
          <Star className="hero-star-one" /><Star className="hero-star-two" />
          <img className="snack-stage-food" src="/images/hero-cutout.webp" width="1536" height="1024" fetchPriority="high" alt={tx('Illustrative snack arrangement with namkeen, banana chips, khakhra and biscuits', 'नमकीन, केला चिप्स, खाखरा और बिस्किट का चित्रात्मक संयोजन')} />
          <IndoreStamp />
          <span className="hero-note">{tx('A little crunch,', 'थोड़ी कुरकुराहट,')}<br />{tx('a lot of happiness.', 'ढेर सारी खुशी।')}<svg viewBox="0 0 90 60" aria-hidden="true"><path d="M6 8Q60 2 64 41M51 33l14 12 11-15" /></svg></span>
          <span className="hero-tagline">शुद्ध स्वाद, शुद्ध जीवन</span>
          <p className="art-note">{tx('Illustrative food artwork', 'उदाहरण के लिए खाद्य चित्र')}</p>
        </div>
      </div>
      <div className="section-width hero-footline"><span><Wheat size={16} />{tx('Care from the first ingredient', 'पहली सामग्री से ध्यान')}</span><Link href="/practices">{tx('Discover our shuddh practices', 'हमारी शुद्ध प्रक्रिया जानें')}<ArrowUpRight size={15} /></Link></div>
    </section>

    <div className="snack-marquee" aria-label={tx('Shuddh from the start. Made in Indore. Everyday favourites.', 'शुरू से शुद्ध। इंदौर में तैयार। रोज़ के पसंदीदा स्वाद।')}><div className="marquee-track" aria-hidden="true">{[0, 1].map(n => <div className="marquee-set" key={n}><span>{tx('Shuddh from the start', 'शुरू से शुद्ध')}</span><Star /><span>{tx('Made in Indore', 'इंदौर में तैयार')}</span><Star /><span>{tx('Everyday favourites', 'रोज़ के पसंदीदा स्वाद')}</span><Star /></div>)}</div><button className="motion-toggle" onClick={() => setMotionPaused(p => !p)} aria-pressed={motionPaused} aria-label={motionPaused ? tx('Resume animations', 'एनिमेशन फिर चलाएँ') : tx('Pause animations', 'एनिमेशन रोकें')}>{motionPaused ? <Play size={16} /> : <Pause size={16} />}</button></div>

    <section className="section-width snack-shelf" id="snack-shelf" data-reveal>
      <div className="modern-section-heading"><div><div className="label-line">{tx('THE SNACK SHELF', 'हमारी स्वाद की रेंज')}</div><h2>{tx('So many ways to', 'स्वाद के इतने तरीके,')}<br /><em>{tx('snack happy.', 'हर दिन की खुशी।')}</em></h2></div><p>{tx('From your first cup of chai to the last little bite. There’s a favourite waiting for you.', 'सुबह की पहली चाय से आख़िरी कौर तक। यहाँ आपका पसंदीदा स्वाद आपका इंतज़ार कर रहा है।')}</p></div>
      <div className="shelf-tabs" role="tablist" aria-label={tx('Explore snack categories', 'रेंज चुनें')}>{data.categories.map(c => <button key={c.id} id={`shelf-tab-${c.id}`} role="tab" aria-selected={selected.id === c.id} aria-controls="shelf-panel" tabIndex={selected.id === c.id ? 0 : -1} className={selected.id === c.id ? 'selected' : ''} onClick={() => setCategory(c.id)} onKeyDown={e => {
        if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault(); const i = data.categories.findIndex(x => x.id === c.id); const next = e.key === 'Home' ? 0 : e.key === 'End' ? data.categories.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + data.categories.length) % data.categories.length;
        setCategory(data.categories[next].id); document.getElementById(`shelf-tab-${data.categories[next].id}`)?.focus();
      }}>{tx(c.short, c.hi)}<ArrowUpRight size={14} /></button>)}</div>
      <div className={`shelf-panel category-${selected.id}`} id="shelf-panel" role="tabpanel" aria-labelledby={`shelf-tab-${selected.id}`} tabIndex={0}>
        <div className="shelf-feature" key={`${selected.id}-${lang}`}><div className="shelf-feature-top"><span>{String(selected.index + 1).padStart(2, '0')} / 06</span><span>{categoryProducts.length} {tx('favourites', 'उत्पाद')}</span></div><FoodArt index={selected.index} alt={tx(selected.en, selected.hi)} /><div className="shelf-feature-copy"><h3>{tx(selected.en, selected.hi)}</h3><p>{tx(...(categoryCopy[selected.id] || [selected.note, selected.hi]))}</p><Link href={`/shop?category=${selected.id}`} className="round-arrow" aria-label={tx(`Explore ${selected.en}`, `${selected.hi} देखें`)}><ArrowUpRight size={25} /></Link></div><span className="shelf-art-note">{tx('Category illustration', 'रेंज का चित्र')}</span></div>
        <div className="shelf-picks"><div className="shelf-picks-heading"><span>{tx('A little taste of the range', 'रेंज की एक छोटी झलक')}</span><Link href={`/shop?category=${selected.id}`}>{tx('View all', 'सभी देखें')}<ArrowRight size={15} /></Link></div><div className="product-grid">{categoryPicks.map(p => <ProductCard key={p.id} product={p} />)}</div></div>
      </div>
    </section>

    <section className="snack-finder" data-reveal><div className="section-width">
      <div className="modern-section-heading"><div><div className="label-line"><Sparkles size={14} />{tx('PICK YOUR MOMENT', 'अपने पल के लिए चुनें')}</div><h2>{tx('What’s your', 'आज किस स्वाद का')}<br /><em>{tx('snack mood?', 'मन है?')}</em></h2></div><div className="finder-aside"><span className="handwritten">{tx('Go on. Pick one.', 'मनपसंद चुनिए।')}</span><p>{tx('A few ideas for wherever your day takes you.', 'आपके दिन के अलग-अलग पलों के लिए कुछ सुझाव।')}</p></div></div>
      <div className="moment-buttons" aria-label={tx('Choose a snack moment', 'अपने पल के लिए स्वाद चुनें')}>{moments.map(m => <button key={m.id} aria-pressed={moment === m.id} className={moment === m.id ? 'selected' : ''} onClick={() => setMoment(m.id)}>{tx(m.en, m.hi)}{moment === m.id ? <ArrowDown size={17} /> : <PlusMark />}</button>)}</div>
      <p className="moment-description" role="status">{tx(...currentMoment.copy)}</p>
      <div className="product-grid mood-grid" key={moment}>{momentPicks.map(p => <ProductCard key={p.id} product={p} />)}</div>
      <Link className="button outline finder-all" href={currentMoment.national ? '/shop?national=1' : `/shop?category=${currentMoment.categories[0]}`}>{tx('Explore more of this mood', 'इस पसंद के और स्वाद देखें')}<ArrowUpRight size={18} /></Link>
    </div></section>

    <section className="modern-care" data-reveal><div className="section-width care-grid"><div className="care-title"><div className="label-line"><Leaf size={15} />{tx('OUR NAME. OUR APPROACH.', 'हमारा नाम। हमारी सोच।')}</div><h2>{tx('Shuddh,', 'शुद्ध,')}<br />{tx('from the', 'पहले कदम')}<br /><em>{tx('very start.', 'से ही।')}</em></h2><p>{tx('It starts before the first bite. With attention to ingredients, preparation and the niyams that matter to you.', 'शुद्धता पहले कौर से पहले ही शुरू होती है। सामग्री, तैयारी और आपके नियमों पर ध्यान के साथ।')}</p><Link className="button care-button" href="/practices">{tx('Get to know our practices', 'हमारी प्रक्रिया जानें')}<ArrowUpRight size={18} /></Link><Star className="care-star" /></div><div className="care-accordion">{[
        [Wheat, 'The first ingredient matters.', 'पहली सामग्री से ध्यान।', 'Ingredients are checked, washed and dried before preparation.', 'तैयारी से पहले सामग्री की जाँच, धुलाई और सुखाना।'],
        [Leaf, 'Our facility. Our attention.', 'अपनी इकाई। अपना ध्यान।', 'We prepare in our own facility, using filtered water and dedicated utensils.', 'हम अपनी इकाई में छने हुए पानी और अलग बर्तनों के साथ तैयारी करते हैं।'],
        [Clock3, 'Care, throughout the day.', 'दिन के समय, पूरी देखभाल।', 'Preparation takes place after sunrise and before sunset. Discuss your individual niyams with us before ordering.', 'तैयारी सूर्योदय के बाद और सूर्यास्त से पहले होती है। अपने व्यक्तिगत नियमों की पुष्टि ऑर्डर से पहले करें।'],
      ].map(([Icon, en, hi, copy, copyHi], i) => <details key={en} open={i === 0}><summary><span className="care-number">0{i + 1}</span><Icon size={23} /><h3>{tx(en, hi)}</h3><ChevronDown size={20} /></summary><p>{tx(copy, copyHi)}</p></details>)}<div className="niyam-note"><span>शुद्ध स्वाद,<br />शुद्ध जीवन।</span><p>{tx('Your niyams are personal. Let’s talk about what suits you.', 'आपके नियम व्यक्तिगत हैं। आपकी ज़रूरत पर हमसे बात करें।')}</p></div></div></div></section>

    <section className="section-width modern-delivery" data-reveal><div className="modern-section-heading"><div><div className="label-line">{tx('FROM INDORE, TO YOUR EVERYDAY', 'इंदौर से, आपके हर दिन के लिए')}</div><h2>{tx('Good food.', 'अच्छा स्वाद।')}<br /><em>{tx('Just a call away.', 'बस एक कॉल दूर।')}</em></h2></div><p>{tx('Choose your favourites. Call Mayank. We’ll confirm packs, availability and the best way to get them to you.', 'अपने पसंदीदा स्वाद चुनें और मयंक को कॉल करें। पैक, उपलब्धता और डिलीवरी की जानकारी साथ में तय करेंगे।')}</p></div><div className="delivery-paths">{[
        [MapPin, '01', 'Come say hello.', 'पिकअप के लिए आइए।', 'Pickup at Anjani Nagar, Indore.', 'अंजनी नगर, इंदौर से पिकअप।'],
        [Truck, '02', 'Keep it local.', 'स्थानीय डिलीवरी।', 'Porter, booked by you or by us.', 'पोर्टर आप या हम बुक कर सकते हैं।'],
        [Package, '03', 'Send a little Indore.', 'इंदौर का स्वाद भेजें।', 'Namkeen & biscuits, across India.', 'नमकीन और बिस्किट, पूरे भारत में।'],
      ].map(([Icon, num, en, hi, copy, copyHi]) => <Link key={num} href="/contact"><div className="delivery-path-top"><Icon size={26} /><span>{num}</span></div><h3>{tx(en, hi)}</h3><p>{tx(copy, copyHi)}</p><ArrowUpRight size={22} className="delivery-arrow" /></Link>)}</div></section>

    <section className="snack-call-banner" data-reveal><div className="section-width"><Star /><div><p>{tx('Found your favourite?', 'अपना पसंदीदा मिल गया?')}</p><h2>{tx('Let’s talk snacks.', 'आइए स्वाद की बात करें।')}</h2></div><a href={`tel:+91${data.settings.phone}`} className="button"><Phone size={21} />{tx('Call Mayank', 'मयंक को कॉल करें')}<ArrowUpRight size={20} /></a></div></section>
    <Faq compact />
  </div>;
}

function PlusMark() { return <span className="moment-plus" aria-hidden="true">+</span>; }
