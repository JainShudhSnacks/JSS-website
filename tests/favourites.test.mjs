import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFavourites, toggleFavourite, favouriteProducts } from '../src/lib/favourites.mjs';

test('saved picks recover safely from malformed browser data and retain order', () => {
  assert.deepEqual(parseFavourites('{broken'), []);
  assert.deepEqual(parseFavourites('{"id":"hand-sev"}'), []);
  const ids = parseFavourites('["hand-sev",null,"../invalid","hand-sev","plain-khakhra"]');
  assert.deepEqual(ids, ['hand-sev', 'plain-khakhra']);
  assert.deepEqual(parseFavourites(JSON.stringify(ids)), ids);
  assert.deepEqual(toggleFavourite(ids, 'hand-sev'), ['plain-khakhra']);
  assert.deepEqual(toggleFavourite(ids, 'new-snack'), [...ids, 'new-snack']);
});

test('shortlist uses current published products so removed items and stale prices do not appear', () => {
  const products = [{ id: 'hand-sev', status: 'published', packs: [{ price: 320 }] }, { id: 'hidden-snack', status: 'hidden' }];
  const saved = favouriteProducts(['hidden-snack', 'deleted-snack', 'hand-sev'], products);
  assert.deepEqual(saved, [products[0]]);
  assert.equal(saved[0].packs[0].price, 320);
});
