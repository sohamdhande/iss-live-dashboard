import axios from 'axios';

/**
 * NewsAPI free plan blocks direct browser requests (CORS).
 * We route through a public CORS proxy to make it work client-side.
 */
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Fetches top space/science news articles from NewsAPI via CORS proxy.
 *
 * @param {string} query - Search query (defaults to 'space OR NASA OR ISS')
 * @param {number} pageSize - Number of articles to fetch
 * @returns {Promise<Array>} Array of article objects
 */
export async function fetchSpaceNews(query = 'space OR NASA OR ISS', pageSize = 20) {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    console.warn('No VITE_NEWS_API_KEY found, using mock data.');
    return getMockNews();
  }

  try {
    // Build the full NewsAPI URL, then wrap it through the CORS proxy
    const params = new URLSearchParams({
      q: query,
      pageSize: String(pageSize),
      sortBy: 'publishedAt',
      language: 'en',
      apiKey,
    });

    const targetUrl = `https://newsapi.org/v2/everything?${params.toString()}`;
    const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(targetUrl)}`, {
      timeout: 15000,
    });

    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;

    if (data.status === 'ok' && data.articles?.length) {
      console.log(`Fetched ${data.articles.length} real articles from NewsAPI`);
      return data.articles.map(normalizeArticle);
    }

    // API returned ok but no articles
    console.warn('NewsAPI returned no articles, using mock data.');
    return getMockNews();
  } catch (error) {
    console.warn('NewsAPI fetch failed, using mock data:', error.message);
    return getMockNews();
  }
}

/**
 * Normalizes an article object to a consistent shape.
 */
function normalizeArticle(article) {
  return {
    id: article.url || crypto.randomUUID(),
    title: article.title || 'Untitled',
    description: article.description || 'No description available.',
    source: article.source?.name || 'Unknown Source',
    author: article.author || 'Unknown Author',
    url: article.url || '#',
    imageUrl: article.urlToImage || null,
    publishedAt: article.publishedAt || new Date().toISOString(),
    category: categorizeArticle(article.title || ''),
  };
}

/**
 * Simple keyword-based categorizer for news articles.
 */
function categorizeArticle(title) {
  const lower = title.toLowerCase();
  if (lower.includes('nasa')) return 'NASA';
  if (lower.includes('spacex') || lower.includes('rocket') || lower.includes('launch')) return 'Launch';
  if (lower.includes('mars') || lower.includes('moon') || lower.includes('planet')) return 'Exploration';
  if (lower.includes('satellite') || lower.includes('orbit')) return 'Satellite';
  if (lower.includes('astronaut') || lower.includes('iss') || lower.includes('station')) return 'ISS';
  if (lower.includes('telescope') || lower.includes('webb') || lower.includes('hubble')) return 'Astronomy';
  return 'General';
}

/**
 * Provides mock news data when no API key is configured.
 */
function getMockNews() {
  const mockArticles = [
    {
      title: 'NASA Artemis III Mission Update: Crew Selection Finalized',
      description: 'NASA has announced the final crew roster for the Artemis III mission, which will return humans to the lunar surface for the first time in over 50 years.',
      source: 'NASA',
      author: 'Sarah Mitchell',
      url: 'https://nasa.gov',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400',
      publishedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    },
    {
      title: 'SpaceX Successfully Launches 23 Starlink Satellites',
      description: 'SpaceX has successfully deployed another batch of Starlink satellites, expanding global broadband coverage. The Falcon 9 booster landed on the drone ship for its 15th flight.',
      source: 'SpaceX',
      author: 'James Carter',
      url: 'https://spacex.com',
      imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400',
      publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
    {
      title: 'James Webb Telescope Discovers New Exoplanet with Potential Atmosphere',
      description: 'The JWST has identified a rocky exoplanet in the habitable zone of a nearby star, with spectral signatures suggesting the presence of a thin atmosphere.',
      source: 'ESA',
      author: 'Dr. Elena Ross',
      url: 'https://esa.int',
      imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
      publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      title: 'ISS Crew Conducts Spacewalk to Repair Solar Array',
      description: 'Astronauts aboard the International Space Station performed a six-hour spacewalk to repair and upgrade one of the station\'s solar arrays.',
      source: 'NASA',
      author: 'Tom Reynolds',
      url: 'https://nasa.gov/iss',
      imageUrl: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400',
      publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    },
    {
      title: 'Blue Origin Announces New Glenn Rocket First Launch Date',
      description: 'Blue Origin has set the inaugural launch date for its New Glenn heavy-lift rocket, which will compete with SpaceX\'s Falcon Heavy for commercial satellite launches.',
      source: 'Blue Origin',
      author: 'David Kim',
      url: 'https://blueorigin.com',
      imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400',
      publishedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
    {
      title: 'Mars Rover Perseverance Finds New Evidence of Ancient Water',
      description: 'NASA\'s Perseverance rover has uncovered mineral formations in Jezero Crater that strongly suggest the presence of flowing water billions of years ago.',
      source: 'NASA JPL',
      author: 'Maria Lopez',
      url: 'https://mars.nasa.gov',
      imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400',
      publishedAt: new Date(Date.now() - 16 * 3600000).toISOString(),
    },
    {
      title: 'India\'s ISRO Plans Venus Orbiter Mission for 2028',
      description: 'The Indian Space Research Organisation has revealed plans for Shukrayaan, a Venus orbiter that will study the planet\'s atmosphere and surface geology.',
      source: 'ISRO',
      author: 'Raj Patel',
      url: 'https://isro.gov.in',
      imageUrl: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=400',
      publishedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      title: 'Hubble Telescope Captures Stunning Image of Carina Nebula',
      description: 'The Hubble Space Telescope has captured a breathtaking new image of the Carina Nebula, revealing intricate dust formations and newborn stars.',
      source: 'STScI',
      author: 'Dr. Anne Carter',
      url: 'https://hubblesite.org',
      imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=400',
      publishedAt: new Date(Date.now() - 30 * 3600000).toISOString(),
    },
    {
      title: 'ESA Announces New Crew for Next ISS Rotation',
      description: 'The European Space Agency has selected three astronauts for the upcoming crew rotation aboard the ISS, including the first astronaut from Portugal.',
      source: 'ESA',
      author: 'Sophie Bernard',
      url: 'https://esa.int',
      imageUrl: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=400',
      publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
    },
    {
      title: 'New Study Suggests Titan Could Harbor Microbial Life',
      description: 'Researchers have published findings indicating that Saturn\'s moon Titan has the chemical building blocks necessary to support simple microbial organisms.',
      source: 'Nature',
      author: 'Dr. Kevin Wu',
      url: 'https://nature.com',
      imageUrl: 'https://images.unsplash.com/photo-1545156521-77bd85671d30?w=400',
      publishedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
    {
      title: 'China Successfully Tests Reusable Rocket Technology',
      description: 'China\'s CASC has successfully conducted a vertical landing test of a reusable rocket prototype, marking a significant milestone in the country\'s space capabilities.',
      source: 'CASC',
      author: 'Li Wei',
      url: 'https://cnsa.gov.cn',
      imageUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400',
      publishedAt: new Date(Date.now() - 60 * 3600000).toISOString(),
    },
    {
      title: 'Private Space Station Plans Accelerate as ISS Retirement Nears',
      description: 'Multiple companies are racing to build commercial space stations as NASA prepares to deorbit the ISS by the end of the decade.',
      source: 'Space News',
      author: 'Rachel Green',
      url: 'https://spacenews.com',
      imageUrl: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=400',
      publishedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
    },
  ];

  return mockArticles.map(normalizeArticle);
}
