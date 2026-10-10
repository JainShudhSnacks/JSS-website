export class AppError extends Error { constructor(message,status=400) { super(message); this.status=status; } }
export const money = n => `₹${Number(n).toLocaleString('en-IN',{maximumFractionDigits:2})}`;
export function priceFor(pack,now=Date.now()) {
  const sale=pack.sale;
  if (!sale?.enabled || !(sale.price >= 0 && sale.price < pack.price)) return pack.price;
  if (sale.start && now < Date.parse(sale.start)) return pack.price;
  if (sale.end && now >= Date.parse(sale.end)) return pack.price;
  return sale.price;
}
const clean=(v,max=2000)=>String(v??'').trim().slice(0,max);
const amount=n=>n!==''&&n!==null&&n!==undefined&&Number.isFinite(Number(n)) && Number(n)>=0 && Number(n)<=100000 && Math.abs(Math.round(Number(n)*100)-Number(n)*100)<0.00001;
export function validateProduct(input) {
  if (!input || !clean(input.nameEn,120) || !clean(input.nameHi,120)) throw new AppError('Add both English and Hindi product names.');
  if (!['namkeen','chips','bakery','papad','other','pantry'].includes(input.category)) throw new AppError('Choose a valid category.');
  if (!Array.isArray(input.packs) || input.packs.length<1 || input.packs.length>12) throw new AppError('Add between 1 and 12 pack options.');
  const packs=input.packs.map((p,i)=>{
    if (!amount(p.price)) throw new AppError('Pack prices must be valid amounts with at most two decimal places.');
    if (!clean(p.labelEn,80)) throw new AppError('Give every pack an English label.');
    if (input.priceUnitConfirmed && !['kg','packet','dozen','piece','pack'].includes(p.unit)) throw new AppError('Confirm the unit for each pack.');
    let sale=null;
    if(p.sale?.enabled){
      if (!amount(p.sale.price) || Number(p.sale.price)>=Number(p.price)) throw new AppError('The sale price must be lower than the regular price.');
      const start=clean(p.sale.start,40),end=clean(p.sale.end,40);
      if ((start&&!Number.isFinite(Date.parse(start)))||(end&&!Number.isFinite(Date.parse(end)))||(start&&end&&Date.parse(end)<=Date.parse(start))) throw new AppError('Check the offer start and end dates.');
      sale={enabled:true,price:Number(p.sale.price),start,end};
    }
    return {id:clean(p.id,60)||`pack-${i+1}`,labelEn:clean(p.labelEn,80),labelHi:clean(p.labelHi,80),unit:clean(p.unit,20),price:Number(p.price),sale};
  });
  if (new Set(packs.map(p=>p.id)).size!==packs.length) throw new AppError('Pack identifiers must be unique.');
  if (input.ingredientsVerified&&!clean(input.ingredients)) throw new AppError('Add the ingredients before marking them confirmed.');
  const image=clean(input.image,600);
  if (image&&!/^\/images\/|^\/api\/image\/|^https:\/\//.test(image)) throw new AppError('Use an uploaded image or an HTTPS image URL.');
  return {
    id:clean(input.id,100),nameEn:clean(input.nameEn,120),nameHi:clean(input.nameHi,120),category:input.category,
    descriptionEn:clean(input.descriptionEn),descriptionHi:clean(input.descriptionHi),image,imageIllustrative:input.imageIllustrative!==false,
    status:['draft','published','hidden','archived'].includes(input.status)?input.status:'draft',available:!!input.available,featured:!!input.featured,national:!!input.national,
    ingredients:clean(input.ingredients),ingredientsVerified:!!input.ingredientsVerified,dairy:['yes','no','unconfirmed'].includes(input.dairy)?input.dairy:'unconfirmed',
    shelfLife:clean(input.shelfLife,300),storage:clean(input.storage,500),seasonal:!!input.seasonal,priceUnitConfirmed:!!input.priceUnitConfirmed,packs,position:Number(input.position)||0,
  };
}

export function validateSettings(input, previous) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new AppError('Check the website settings.');
  const updated = { ...previous };
  const lengths = { phone: 20, address: 500, hours: 500, fssai: 500, gst: 500, announcementEn: 500, announcementHi: 500, orderIssuePolicy: 3000, familyName: 150, familyNoteEn: 2000, familyNoteHi: 2000 };
  for (const [key, max] of Object.entries(lengths)) if (key in input) updated[key] = clean(input[key], max);
  if (!/^\d{10}$/.test(updated.phone)) throw new AppError('Use a ten-digit Indian contact number.');
  if ('familyPortrait' in input) {
    const image = clean(input.familyPortrait, 600);
    let allowed = !image || /^\/(images|api\/image)\/[a-zA-Z0-9/_ .-]+$/.test(image) && !image.includes('..');
    if (image.startsWith('https://')) {
      try { const url = new URL(image); allowed = url.protocol === 'https:' && !url.username && !url.password; } catch { allowed = false; }
    }
    if (!allowed) throw new AppError('Use an uploaded portrait or a valid HTTPS image URL.');
    updated.familyPortrait = image;
  }
  if ('customerReviews' in input) {
    if (!Array.isArray(input.customerReviews) || input.customerReviews.length > 3) throw new AppError('Add up to three customer comments.');
    updated.customerReviews = input.customerReviews.map(review => {
      if (!review || typeof review !== 'object' || Array.isArray(review)) throw new AppError('Check the customer comment.');
      return { name: clean(review.name, 100), quoteEn: clean(review.quoteEn, 800), quoteHi: clean(review.quoteHi, 800) };
    }).filter(review => review.name || review.quoteEn || review.quoteHi);
    if (updated.customerReviews.some(review => !review.name || !(review.quoteEn || review.quoteHi))) throw new AppError('Add a customer name and their comment, or leave the whole comment blank.');
  }
  return updated;
}
