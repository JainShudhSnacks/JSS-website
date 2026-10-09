import test from 'node:test';
import assert from 'node:assert/strict';
import {priceFor,validateProduct} from '../src/lib/domain.mjs';
import {seedProducts} from '../src/lib/catalogue.mjs';

const now=Date.parse('2026-10-09T12:00:00Z');
test('offers start and expire at exact shared instants, including IST dates',()=>{
 const p={price:300,sale:{enabled:true,price:270,start:'2026-10-09T17:30:00+05:30',end:'2026-10-09T18:30:00+05:30'}};
 assert.equal(priceFor(p,now-1),300);assert.equal(priceFor(p,now),270);assert.equal(priceFor(p,now+3600000),300);assert.equal(priceFor({...p,sale:{...p.sale,enabled:false}},now),300);
});
test('invalid discounts cannot become displayed catalogue prices',()=>{
 assert.equal(priceFor({price:300,sale:{enabled:true,price:350}},now),300);
 assert.throws(()=>validateProduct({...seedProducts[0],packs:[{...seedProducts[0].packs[0],sale:{enabled:true,price:350}}]}),/lower/);
 assert.throws(()=>validateProduct({...seedProducts[0],packs:[{...seedProducts[0].packs[0],sale:{enabled:true,price:'',start:'',end:''}}]}),/lower/);
 assert.throws(()=>validateProduct({...seedProducts[0],packs:[{...seedProducts[0].packs[0],sale:{enabled:true,price:270,start:'2026-10-10',end:'2026-10-09'}}]}),/dates/);
 assert.equal(validateProduct({...seedProducts[0],packs:[{...seedProducts[0].packs[0],price:299.99}]}).packs[0].price,299.99);
});
