import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { seedProducts } from '../src/lib/catalogue.mjs';
import { productArtwork } from '../src/lib/product-artwork.mjs';

test('every supplied product has a portable, distinct illustration', async () => {
 const paths = new Set();
 for (const product of seedProducts) {
  const artwork = productArtwork(product);
  assert.equal(artwork.illustrative, true);
  const bytes = await fs.readFile(new URL(`../public${artwork.src}`, import.meta.url));
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  paths.add(artwork.src);
 }
 assert.equal(paths.size, 52);
});

test('owner photos take priority and new items retain the category fallback', () => {
 const photo = { ...seedProducts[0], image: '/api/images/owner-photo.webp', imageIllustrative: false };
 assert.deepEqual(productArtwork(photo), { src: photo.image, illustrative: false });
 assert.equal(photo.image, '/api/images/owner-photo.webp');
 assert.deepEqual(productArtwork({ id: 'new-favourite', image: '' }), { src: '', illustrative: true });
 // An unchecked flag on an empty record must not present generated art as a real photo.
 assert.equal(productArtwork({ ...seedProducts[0], imageIllustrative: false }).illustrative, true);
});
