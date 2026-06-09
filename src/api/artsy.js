// Mock exhibit data — replace with a real API when ready
const MOCK_SHOWS = [
  {
    id: '1', name: 'Basquiat: The Irony of a Negro Policeman', status: 'current',
    start_at: '2025-02-01', end_at: '2025-08-31',
    partner: { name: 'Brooklyn Museum' },
    location: { city: 'New York', country: 'USA' },
    description: 'A major retrospective of Jean-Michel Basquiat\'s work, tracing his rise from street artist to international art world phenomenon. The exhibition features over 200 works spanning his entire career.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jean-Michel_Basquiat%2C_Untitled%2C_1982.jpg/800px-Jean-Michel_Basquiat%2C_Untitled%2C_1982.jpg' }, permalink: { href: 'https://www.brooklynmuseum.org' } }
  },
  {
    id: '2', name: 'Vermeer\'s Light: Paintings from the Rijksmuseum', status: 'current',
    start_at: '2025-03-15', end_at: '2025-09-15',
    partner: { name: 'National Gallery of Art' },
    location: { city: 'Washington D.C.', country: 'USA' },
    description: 'An intimate look at Vermeer\'s mastery of light and domestic interiors. This landmark exhibition brings together 25 of his surviving 34 paintings, many on loan from the Rijksmuseum in Amsterdam.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Vermeer-view-of-delft.jpg/800px-Vermeer-view-of-delft.jpg' }, permalink: { href: 'https://www.nga.gov' } }
  },
  {
    id: '3', name: 'Africa Fashion', status: 'current',
    start_at: '2025-04-01', end_at: '2025-10-01',
    partner: { name: 'Victoria and Albert Museum' },
    location: { city: 'London', country: 'UK' },
    description: 'A celebration of the richness and diversity of African fashion from the 1950s to today. Featuring over 250 objects including garments, textiles, photography, film, and music.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Colorful_African_fabric.jpg/800px-Colorful_African_fabric.jpg' }, permalink: { href: 'https://www.vam.ac.uk' } }
  },
  {
    id: '4', name: 'Monet and the Thames', status: 'current',
    start_at: '2025-01-20', end_at: '2025-07-20',
    partner: { name: 'Musée d\'Orsay' },
    location: { city: 'Paris', country: 'France' },
    description: 'Claude Monet\'s iconic series of the Thames River in London, brought together for the first time in decades. The exhibition explores his revolutionary approach to capturing light and atmosphere.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/800px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg' }, permalink: { href: 'https://www.musee-orsay.fr' } }
  },
  {
    id: '5', name: 'AI & the Future of Art', status: 'current',
    start_at: '2025-05-01', end_at: '2025-11-01',
    partner: { name: 'MoMA' },
    location: { city: 'New York', country: 'USA' },
    description: 'An exploration of how artificial intelligence is reshaping creative practice. Features works by artists using machine learning, generative systems, and human-AI collaboration.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/402px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg' }, permalink: { href: 'https://www.moma.org' } }
  },
  {
    id: '6', name: 'Yayoi Kusama: Infinity Rooms', status: 'current',
    start_at: '2025-03-01', end_at: '2025-09-30',
    partner: { name: 'Tate Modern' },
    location: { city: 'London', country: 'UK' },
    description: 'A major survey of Yayoi Kusama\'s immersive Infinity Mirror Rooms, spanning six decades of her practice. The largest presentation of her work ever staged in the UK.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Kusama_pumpkins.jpg/800px-Kusama_pumpkins.jpg' }, permalink: { href: 'https://www.tate.org.uk' } }
  },
  {
    id: '7', name: 'The Future of Architecture: 2025 Biennale', status: 'upcoming',
    start_at: '2025-09-01', end_at: '2026-03-01',
    partner: { name: 'Venice Architecture Biennale' },
    location: { city: 'Venice', country: 'Italy' },
    description: 'The world\'s most prestigious architecture exhibition returns with the theme "Intelligens: Natural. Artificial. Collective." Featuring over 60 national pavilions and hundreds of installations.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Venice_from_the_air.jpg/800px-Venice_from_the_air.jpg' }, permalink: { href: 'https://www.labiennale.org' } }
  },
  {
    id: '8', name: 'Frida Kahlo: Making Her Self Up', status: 'upcoming',
    start_at: '2025-10-15', end_at: '2026-02-15',
    partner: { name: 'Art Institute of Chicago' },
    location: { city: 'Chicago', country: 'USA' },
    description: 'An intimate portrait of Frida Kahlo through her personal belongings, photographs, and paintings. Objects locked away in the Blue House for 50 years after her death are presented for the first time.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg/402px-Frida_Kahlo%2C_by_Guillermo_Kahlo.jpg' }, permalink: { href: 'https://www.artic.edu' } }
  },
  {
    id: '9', name: 'Ancient Egypt: The Last Pharaohs', status: 'upcoming',
    start_at: '2025-11-01', end_at: '2026-04-30',
    partner: { name: 'British Museum' },
    location: { city: 'London', country: 'UK' },
    description: 'Exploring the final centuries of ancient Egyptian civilisation, when the country was ruled by Greeks and Romans yet continued to produce extraordinary art and architecture.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kha-em-waset_mummy_mask.jpg/400px-Kha-em-waset_mummy_mask.jpg' }, permalink: { href: 'https://www.britishmuseum.org' } }
  },
  {
    id: '10', name: 'Nordic Design: A Way of Living', status: 'upcoming',
    start_at: '2026-01-10', end_at: '2026-06-10',
    partner: { name: 'Cooper Hewitt Design Museum' },
    location: { city: 'New York', country: 'USA' },
    description: 'A sweeping survey of Scandinavian design philosophy and its global influence, from mid-century furniture to contemporary sustainable design.',
    _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Eames_chair.jpg/600px-Eames_chair.jpg' }, permalink: { href: 'https://www.cooperhewitt.org' } }
  },
];

const MOCK_ARTWORKS = [
  { id: 'a1', title: 'Untitled (1982)', artist_names: 'Jean-Michel Basquiat', _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jean-Michel_Basquiat%2C_Untitled%2C_1982.jpg/400px-Jean-Michel_Basquiat%2C_Untitled%2C_1982.jpg' } } },
  { id: 'a2', title: 'Girl with a Pearl Earring', artist_names: 'Johannes Vermeer', _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Meisje_met_de_parel.jpg/400px-Meisje_met_de_parel.jpg' } } },
  { id: 'a3', title: 'Water Lilies', artist_names: 'Claude Monet', _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson_%28Cropped%29.jpg/400px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson_%28Cropped%29.jpg' } } },
  { id: 'a4', title: 'Pumpkin', artist_names: 'Yayoi Kusama', _links: {} },
  { id: 'a5', title: 'Self Portrait with Thorn Necklace', artist_names: 'Frida Kahlo', _links: { thumbnail: { href: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Frida_Kahlo_%28self_portrait%29.jpg/400px-Frida_Kahlo_%28self_portrait%29.jpg' } } },
];

export async function fetchShows({ status = 'current' } = {}) {
  await new Promise(r => setTimeout(r, 600)); // simulate network delay
  return MOCK_SHOWS.filter(s => s.status === status);
}

export async function fetchShow(id) {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_SHOWS.find(s => s.id === id) ?? MOCK_SHOWS[0];
}

export async function searchShows(query) {
  await new Promise(r => setTimeout(r, 400));
  const q = query.toLowerCase();
  return MOCK_SHOWS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.partner?.name.toLowerCase().includes(q) ||
    s.location?.city.toLowerCase().includes(q)
  ).map(s => ({ title: s.name, description: `${s.partner?.name} · ${s.location?.city}`, _links: { self: { href: `/shows/${s.id}` } } }));
}

export async function fetchShowArtworks() {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_ARTWORKS;
}
