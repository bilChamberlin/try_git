// Artsy API client
// Get free credentials at: https://developers.artsy.net/

const ARTSY_CLIENT_ID = process.env.ARTSY_CLIENT_ID || 'YOUR_CLIENT_ID';
const ARTSY_CLIENT_SECRET = process.env.ARTSY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const BASE_URL = 'https://api.artsy.net/api';

let _token = null;
let _tokenExpiry = 0;

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token;

  const res = await fetch(`${BASE_URL}/tokens/xapp_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: ARTSY_CLIENT_ID,
      client_secret: ARTSY_CLIENT_SECRET,
    }),
  });

  if (!res.ok) throw new Error('Artsy auth failed — check your CLIENT_ID and CLIENT_SECRET');

  const data = await res.json();
  _token = data.token;
  _tokenExpiry = new Date(data.expires_at).getTime() - 60_000;
  return _token;
}

async function artsyFetch(path, params = {}) {
  const token = await getToken();
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'X-Xapp-Token': token },
  });

  if (!res.ok) throw new Error(`Artsy API error: ${res.status}`);
  return res.json();
}

/**
 * Fetch shows (exhibitions).
 * @param {Object} opts
 * @param {'current'|'upcoming'|'closed'} opts.status
 * @param {number} opts.page
 * @param {number} opts.size
 */
export async function fetchShows({ status = 'current', page = 1, size = 20 } = {}) {
  const data = await artsyFetch('/shows', { status, page, size, sort: '-start_at' });
  return data._embedded?.shows ?? [];
}

/**
 * Fetch a single show by ID.
 */
export async function fetchShow(id) {
  return artsyFetch(`/shows/${id}`);
}

/**
 * Search shows by name.
 */
export async function searchShows(query, size = 20) {
  const data = await artsyFetch('/search', {
    q: query,
    type: 'show',
    size,
  });
  return data._embedded?.results ?? [];
}

/**
 * Fetch artworks for a show.
 */
export async function fetchShowArtworks(showId, size = 10) {
  const data = await artsyFetch('/artworks', { show_id: showId, size });
  return data._embedded?.artworks ?? [];
}
