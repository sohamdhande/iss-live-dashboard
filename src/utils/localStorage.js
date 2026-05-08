/**
 * Saves a value to localStorage with JSON serialization.
 *
 * @param {string} key - Storage key
 * @param {*} value - Value to store (will be JSON-serialized)
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage [${key}]:`, error);
  }
}

/**
 * Loads a value from localStorage with JSON parsing.
 *
 * @param {string} key - Storage key
 * @returns {*} Parsed value, or null if not found or parse fails
 */
export function loadFromStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.warn(`Failed to load from localStorage [${key}]:`, error);
    return null;
  }
}

/**
 * Removes a value from localStorage.
 *
 * @param {string} key - Storage key to remove
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove from localStorage [${key}]:`, error);
  }
}

/**
 * Saves data with an expiration timestamp.
 *
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {number} ttlMinutes - Time-to-live in minutes
 */
export function saveWithExpiry(key, value, ttlMinutes) {
  const item = {
    value,
    expiry: Date.now() + ttlMinutes * 60 * 1000,
  };
  saveToStorage(key, item);
}

/**
 * Loads data from localStorage only if not expired.
 *
 * @param {string} key - Storage key
 * @returns {*} Stored value if not expired, otherwise null
 */
export function loadWithExpiry(key) {
  const item = loadFromStorage(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    removeFromStorage(key);
    return null;
  }
  return item.value;
}
