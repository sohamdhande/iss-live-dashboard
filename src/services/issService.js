import axios from 'axios';

const ISS_POSITION_URL = 'http://api.open-notify.org/iss-now.json';
const ISS_PEOPLE_URL = 'http://api.open-notify.org/astros.json';

/**
 * Fetches the current position of the ISS.
 * Returns { latitude, longitude, timestamp }.
 */
export async function fetchISSPosition() {
  const response = await axios.get(ISS_POSITION_URL);
  const { iss_position, timestamp } = response.data;
  return {
    latitude: parseFloat(iss_position.latitude),
    longitude: parseFloat(iss_position.longitude),
    timestamp,
  };
}

/**
 * Fetches the list of people currently in space.
 * Returns { number, people: [{ name, craft }] }.
 */
export async function fetchPeopleInSpace() {
  const response = await axios.get(ISS_PEOPLE_URL);
  return {
    number: response.data.number,
    people: response.data.people,
  };
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
