export const FAVOURITES_KEY = 'jss-favourites-v1';
const validId = id => typeof id === 'string' && /^[a-z0-9-]{1,100}$/.test(id);

export function parseFavourites(raw) {
  try {
    const values = JSON.parse(raw);
    return Array.isArray(values) ? [...new Set(values.filter(validId))].slice(0, 200) : [];
  } catch { return []; }
}

export function toggleFavourite(ids, id) {
  if (!validId(id)) return ids;
  return ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id].slice(-200);
}

export function favouriteProducts(ids, products) {
  const current = new Map(products.filter(p => !p.status || p.status === 'published').map(p => [p.id, p]));
  return ids.map(id => current.get(id)).filter(Boolean);
}
