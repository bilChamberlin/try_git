// Get free credentials at https://developers.artsy.net
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const BASE = 'https://api.artsy.net/api';

let token = null;
let tokenExpiry = 0;

async function getToken() {
  if (token && Date.now() < tokenExpiry) return token;
  const res = await fetch(`${BASE}/tokens/xapp_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });
  if (!res.ok) throw new Error('Artsy auth failed — check your CLIENT_ID and CLIENT_SECRET in src/api/artsy.js');
  const data = await res.json();
  token = data.token;
  tokenExpiry = new Date(data.expires_at).getTime() - 60000;
  return token;
}

async function get(path, params = {}) {
  const t = await getToken();
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: { 'X-Xapp-Token': t } });
  if (!res.ok) throw new Error(`Artsy error ${res.status}`);
  return res.json();
}

export async function fetchShows({ status = 'current', page = 1, size = 20 } = {}) {
  const data = await get('/shows', { status, page, size, sort: '-start_at' });
  return data._embedded?.shows ?? [];
}

export async function fetchShow(id) {
  return get(`/shows/${id}`);
}

export async function searchShows(query, size = 20) {
  const data = await get('/search', { q: query, type: 'show', size });
  return data._embedded?.results ?? [];
}

export async function fetchShowArtworks(showId, size = 10) {
  const data = await get('/artworks', { show_id: showId, size });
  return data._embedded?.artworks ?? [];
}
