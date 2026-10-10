'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, Heart, Phone, Wheat, Droplets, House, MessageCircle, Quote } from 'lucide-react';
import { useShop } from './Storefront';

export function IndoreDrawing() {
  return <svg className="indore-drawing" viewBox="0 0 620 150" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 144h610M122 144V68h45V44h48V23h190v21h48v24h45v76M208 144V48h204v96M190 45h240M199 23h223M232 23V12h156v11M242 12l14-8h108l14 8M120 68h47M453 68h47" />
    {[145, 183, 232, 272, 312, 352, 392, 437, 475].map((x, i) => <path key={x} d={`M${x} 125v-22q9-13 18 0v22zM${x} ${i > 1 && i < 7 ? 77 : 88}v-12q9-12 18 0v12z`} />)}
    <path d="M292 144v-14q18-25 36 0v14M223 90h177M219 50h184M60 144v-40m0 21c-26-10-18-30 0-20 18-12 27 10 0 20M562 144v-38m0 20c-25-12-17-30 0-21 21-13 28 10 0 21M18 144v-12h24v12M580 144v-12h24v12" />
  </svg>;
}

export function SnackEditorial() {
  const { tx } = useShop();
  return <section className="section-width snack-editorial" data-reveal>
    <div className="editorial-copy"><span className="label-line">{tx('SMALL MOMENTS. FAMILIAR FLAVOURS.', 'छोटे पल। अपने स्वाद।')}</span><h2>{tx('A cup of chai.', 'एक कप चाय।')}<br /><em>{tx('A little more joy.', 'थोड़ी और खुशी।')}</em></h2><p>{tx('The biscuits beside your cup. The khakhra you reach for. The namkeen everyone gathers around. Find a little favourite for every day.', 'चाय के साथ बिस्किट। मनपसंद खाखरा। सबके साथ बाँटने के लिए नमकीन। रोज़ के छोटे पलों के लिए अपना स्वाद चुनें।')}</p><Link className="underline-link" href="/shop?category=bakery">{tx('Meet your chai companions', 'चाय के साथी चुनें')}<ArrowUpRight size={18} /></Link></div>
    <figure className="chai-editorial"><img src="/images/editorial/chai-table.webp" alt={tx('Illustrative chai-time spread with namkeen and atta biscuits', 'चाय, नमकीन और आटा बिस्किट का उदाहरण चित्र')} width="1440" height="960" loading="lazy" decoding="async" /><figcaption>{tx('Illustrative food artwork', 'उदाहरण के लिए खाद्य चित्र')}</figcaption><span className="editorial-sticker" aria-hidden="true">{tx('Chai. Crunch.', 'चाय। कुरकुराहट।')}<br /><em>{tx('Repeat.', 'फिर एक और।')}</em></span></figure>
    <figure className="crunch-editorial"><img src="/images/editorial/khakhra-stack.webp" alt={tx('Illustrative stack of khakhra beside banana chips', 'खाखरा और केला चिप्स का उदाहरण चित्र')} width="960" height="1440" loading="lazy" decoding="async" /><figcaption>{tx('Illustrative food artwork', 'उदाहरण के लिए खाद्य चित्र')}</figcaption><Link href="/shop?category=papad" className="editorial-image-link"><span>{tx('Layers of little joys.', 'खुशियों की छोटी परतें।')}</span><ArrowUpRight size={23} /><span className="sr-only">{tx('Explore papad and khakhra', 'पापड़ और खाखरा देखें')}</span></Link></figure>
  </section>;
}

const steps = [
  { Icon: Wheat, en: 'Start with care', hi: 'शुरुआत में ध्यान', title: ['The first ingredient matters.', 'पहली सामग्री से ध्यान।'], copy: ['Our attention begins with the ingredients, before preparation starts.', 'तैयारी शुरू होने से पहले ही सामग्री पर हमारा ध्यान रहता है।'] },
  { Icon: Droplets, en: 'Wash & dry', hi: 'धुलाई और सुखाना', title: ['Shuddh, from the start.', 'शुरू से शुद्ध।'], copy: ['Ingredients are washed and dried at the start. This care is part of our approach to preparation.', 'शुरुआत में सामग्री धोई और सुखाई जाती है। यह ध्यान हमारी तैयारी का हिस्सा है।'] },
  { Icon: House, en: 'Our own facility', hi: 'हमारी अपनी इकाई', title: ['Made here, in Indore.', 'इंदौर में, अपनी इकाई में।'], copy: ['Jain Shudh Snacks prepares its products in its own facility in Indore.', 'जैन शुद्ध स्नैक्स अपने उत्पाद इंदौर में अपनी इकाई में तैयार करता है।'] },
  { Icon: MessageCircle, en: 'Your niyams', hi: 'आपके अपने नियम', title: ['A conversation comes first.', 'पहले आपकी ज़रूरत समझें।'], copy: ['Tell Mayank about your niyams before ordering. Confirm ingredients, dairy and individual maryada for the items you choose.', 'ऑर्डर से पहले मयंक को अपने नियम बताएँ। चुने हुए उत्पादों की सामग्री, डेयरी और व्यक्तिगत मर्यादा की पुष्टि करें।'] },
];

export function PreparationJourney({ id = 'preparation' }) {
  const { tx, data } = useShop();
  const [active, setActive] = useState(0);
  const current = steps[active], Icon = current.Icon;
  const move = (event, i) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? steps.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + steps.length) % steps.length;
    setActive(next); document.getElementById(`${id}-step-${next}`)?.focus();
  };
  return <div className="preparation-journey">
    <div className="journey-tabs" role="tablist" aria-label={tx('Explore our approach', 'हमारी तैयारी जानें')}>{steps.map((step, i) => <button type="button" id={`${id}-step-${i}`} key={step.en} role="tab" aria-selected={active === i} aria-controls={`${id}-panel`} tabIndex={active === i ? 0 : -1} className={active === i ? 'selected' : ''} onClick={() => setActive(i)} onKeyDown={e => move(e, i)}><step.Icon size={21} /><span>{tx(step.en, step.hi)}</span></button>)}</div>
    <div className="journey-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-step-${active}`} tabIndex={0}><div className={`journey-illustration journey-${active}`} aria-hidden="true"><span className="journey-orbit" /><Icon size={74} strokeWidth={1.2} /><span className="journey-number">0{active + 1}</span><svg viewBox="0 0 100 100"><path d="M50 4l7 29 25-16-16 25 29 8-29 7 16 25-25-16-7 29-8-29-25 16 16-25L4 50l29-8-16-25 25 16z" fill="currentColor" /></svg></div><div className="journey-copy" key={active}><span className="label-line">0{active + 1} / 04</span><h3>{tx(...current.title)}</h3><p>{tx(...current.copy)}</p>{active === 3 ? <a className="underline-link" href={`tel:+91${data.settings.phone}`}><Phone size={16} />{tx('Talk about your niyams', 'अपने नियमों पर बात करें')}<ArrowUpRight size={16} /></a> : <button className="underline-link" type="button" onClick={() => { setActive(active + 1); document.getElementById(`${id}-step-${active + 1}`)?.focus(); }}>{tx('Next step', 'अगला कदम')}<ArrowRight size={17} /></button>}</div></div>
    <p className="journey-footnote">{tx('A simple overview of our approach. Discuss your individual requirements with us.', 'हमारी तैयारी की एक छोटी जानकारी। अपनी व्यक्तिगत आवश्यकताओं पर हमसे बात करें।')}</p>
  </div>;
}

export function FamilySection() {
  const { tx, data } = useShop(), s = data.settings;
  const founder = s.familyName || 'Savita Jain';
  const note = tx(s.familyNoteEn, s.familyNoteHi) || tx('Founded by Savita Jain in 2022, Jain Shudh Snacks is our family business in Indore. We prepare namkeen, bakery treats and everyday essentials in our own facility. Her son Mayank Jain is your contact for choosing products, discussing niyams and confirming orders.', 'सविता जैन ने 2022 में जैन शुद्ध स्नैक्स की शुरुआत की। इंदौर में हमारा पारिवारिक व्यवसाय अपनी इकाई में नमकीन, बेकरी और रोज़मर्रा के उत्पाद तैयार करता है। उनके बेटे मयंक जैन उत्पाद चुनने, आपके नियमों पर बात करने और ऑर्डर की पुष्टि में आपके संपर्क हैं।');
  const reviews = (s.customerReviews || []).filter(review => review.name && tx(review.quoteEn, review.quoteHi));
  return <><section className="section-width family-section" data-reveal>
    <div className={`family-portrait${s.familyPortrait ? ' has-portrait' : ''}`}>{s.familyPortrait ? <img src={s.familyPortrait} alt={s.familyName || tx('The person behind Jain Shudh Snacks', 'जैन शुद्ध स्नैक्स की अपनी पहचान')} width="640" height="760" loading="lazy" decoding="async" /> : <><span className="family-emblem">JSS<span>INDORE · 2022</span></span><IndoreDrawing /><span className="family-handwritten">शुद्ध स्वाद,<br />शुद्ध जीवन।</span></>}<span className="family-label">{tx('A FAMILY BUSINESS IN INDORE', 'इंदौर का अपना पारिवारिक व्यवसाय')}</span></div>
    <div className="family-copy"><span className="label-line"><Heart size={15} />{tx('FROM OUR FAMILY TO YOURS', 'हमारे परिवार से, आपके लिए')}</span><h2>{tx('Familiar flavours.', 'अपने स्वाद।')}<br /><em>{tx('A personal touch.', 'अपनेपन के साथ।')}</em></h2><p className="family-note">{note}</p><p className="family-signature">{founder}<span>{tx('Founder','\u0938\u0902\u0938\u094d\u0925\u093e\u092a\u0915')} · Jain Shudh Snacks</span></p><Link className="underline-link" href="/contact">{tx('Come say hello', 'हमसे मिलें, बात करें')}<ArrowUpRight size={18} /></Link></div>
  </section>{reviews.length > 0 && <section className="section-width customer-stories" data-reveal><div className="label-line">{tx('WORDS FROM OUR CUSTOMERS', 'हमारे ग्राहकों के शब्द')}</div><h2>{tx('A little love, shared.', 'अपनेपन की कुछ बातें।')}</h2><div className="customer-story-grid">{reviews.map((review, i) => <figure key={i}><Quote size={25} aria-hidden="true" /><blockquote>{tx(review.quoteEn, review.quoteHi)}</blockquote><figcaption>{review.name}</figcaption></figure>)}</div></section>}</>;
}
