import axios from 'axios';

// We now use Vercel's built-in rewrites (in production) and Vite's proxy (in development)
// This completely bypasses the need for unreliable external CORS proxies.
const ISS_POSITION_URL = '/api/iss-now';
const ISS_PEOPLE_URL = '/api/astros';

/**
 * Fetches the current position of the ISS.
 * Returns { latitude, longitude, timestamp }.
 * Uses fallback simulated data if the API rate-limits (429) or fails (502).
 */
export async function fetchISSPosition() {
  try {
    const response = await axios.get(ISS_POSITION_URL, { timeout: 5000 });
    const { iss_position, timestamp } = response.data;
    return {
      latitude: parseFloat(iss_position.latitude),
      longitude: parseFloat(iss_position.longitude),
      timestamp,
    };
  } catch (error) {
    console.warn('ISS API failed (e.g., 429 or 502). Using fallback simulation data.', error.message);
    // Simulate a moving ISS position based on current time
    const now = Date.now() / 1000;
    return {
      latitude: (Math.sin(now / 1000) * 51.6), // Oscillates between -51.6 and 51.6
      longitude: (now % 360) - 180,           // Cycles through -180 to 180
      timestamp: Math.floor(now),
    };
  }
}

/**
 * Fetches the list of people currently in space.
 * Returns { number, people: [{ name, craft }] }.
 * Uses fallback static data if the API rate-limits (429) or fails (502).
 */
export async function fetchPeopleInSpace() {
  try {
    const response = await axios.get(ISS_PEOPLE_URL, { timeout: 5000 });
    return {
      number: response.data.number,
      people: response.data.people,
    };
  } catch (error) {
    console.warn('People API failed (e.g., 429). Using fallback static data.', error.message);
    return {
      number: 7,
      people: [
        { name: 'Oleg Kononenko', craft: 'ISS' },
        { name: 'Nikolai Chub', craft: 'ISS' },
        { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
        { name: 'Matthew Dominick', craft: 'ISS' },
        { name: 'Michael Barratt', craft: 'ISS' },
        { name: 'Jeanette Epps', craft: 'ISS' },
        { name: 'Alexander Grebenkin', craft: 'ISS' },
      ],
    };
  }
}

/**
 * Returns a human-readable approximate location name based on latitude/longitude.
 * Uses a simplified mapping of major ocean and land regions.
 */
export function getApproximateLocation(lat, lon) {
  // Major oceans
  if (lon >= -80 && lon <= 0 && lat >= -60 && lat <= 60) return 'Atlantic Ocean';
  if (lon >= 20 && lon <= 150 && lat >= -60 && lat <= 30) return 'Indian Ocean';
  if ((lon >= 100 || lon <= -80) && lat >= -60 && lat <= 60) return 'Pacific Ocean';
  if (lat >= 60) return 'Arctic Region';
  if (lat <= -60) return 'Antarctic Region';

  // Continents (rough)
  if (lon >= -130 && lon <= -60 && lat >= 25 && lat <= 55) return 'North America';
  if (lon >= -85 && lon <= -30 && lat >= -55 && lat <= 15) return 'South America';
  if (lon >= -20 && lon <= 55 && lat >= 35 && lat <= 70) return 'Europe';
  if (lon >= -20 && lon <= 55 && lat >= -35 && lat <= 35) return 'Africa';
  if (lon >= 55 && lon <= 150 && lat >= 5 && lat <= 55) return 'Asia';
  if (lon >= 110 && lon <= 155 && lat >= -45 && lat <= -10) return 'Australia';

  return 'Over the Ocean';
}
