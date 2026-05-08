import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { fetchISSPosition, fetchPeopleInSpace, getApproximateLocation } from '../services/issService.js';
import { haversineDistance, calculateSpeed } from '../utils/haversine.js';

const MAX_POSITIONS = 15;
const MAX_SPEEDS = 30;
const POLL_INTERVAL = 15000; // 15 seconds

/**
 * Custom hook that manages ISS position tracking, speed calculation,
 * people in space data, and automatic polling.
 */
export function useISSData() {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [speeds, setSpeeds] = useState([]);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [location, setLocation] = useState('Calculating...');
  const [people, setPeople] = useState([]);
  const [peopleCount, setPeopleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevPositionRef = useRef(null);
  const prevTimestampRef = useRef(null);

  /**
   * Fetches ISS position and calculates speed from the previous data point.
   */
  const fetchPosition = useCallback(async () => {
    try {
      const data = await fetchISSPosition();
      const { latitude, longitude, timestamp } = data;

      // Calculate speed relative to the previous reading
      if (prevPositionRef.current && prevTimestampRef.current) {
        const dist = haversineDistance(
          prevPositionRef.current.latitude,
          prevPositionRef.current.longitude,
          latitude,
          longitude
        );
        const timeDelta = timestamp - prevTimestampRef.current;
        const speed = calculateSpeed(dist, timeDelta);

        // Sanity check: ISS speed is roughly 27,600 km/h; reject outliers
        if (speed > 0 && speed < 40000) {
          setCurrentSpeed(speed);
          setSpeeds((prev) => {
            const next = [
              ...prev,
              {
                time: new Date(timestamp * 1000).toLocaleTimeString(),
                speed: Math.round(speed),
                timestamp,
              },
            ];
            return next.slice(-MAX_SPEEDS);
          });
        }
      }

      const newPos = {
        latitude,
        longitude,
        timestamp,
        time: new Date(timestamp * 1000).toLocaleTimeString(),
      };

      setCurrentPosition(newPos);
      setPositions((prev) => [...prev, newPos].slice(-MAX_POSITIONS));
      setLocation(getApproximateLocation(latitude, longitude));

      prevPositionRef.current = { latitude, longitude };
      prevTimestampRef.current = timestamp;

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('ISS fetch error:', err);
      setError('Failed to fetch ISS data. Retrying...');
      setLoading(false);
      toast.error('Failed to fetch ISS position');
    }
  }, []);

  /**
   * Fetches astronaut data.
   */
  const fetchPeople = useCallback(async () => {
    try {
      const data = await fetchPeopleInSpace();
      setPeople(data.people);
      setPeopleCount(data.number);
    } catch (err) {
      console.error('People fetch error:', err);
      toast.error('Failed to fetch astronaut data');
    }
  }, []);

  /**
   * Manual refresh for ISS position.
   */
  const refresh = useCallback(() => {
    toast.promise(fetchPosition(), {
      loading: 'Refreshing ISS data...',
      success: 'ISS data updated!',
      error: 'Failed to refresh',
    });
  }, [fetchPosition]);

  // Initial fetch and polling
  useEffect(() => {
    fetchPosition();
    fetchPeople();

    const positionInterval = setInterval(fetchPosition, POLL_INTERVAL);
    const peopleInterval = setInterval(fetchPeople, 60000); // People data refreshes every 60s

    return () => {
      clearInterval(positionInterval);
      clearInterval(peopleInterval);
    };
  }, [fetchPosition, fetchPeople]);

  return {
    currentPosition,
    positions,
    speeds,
    currentSpeed,
    location,
    people,
    peopleCount,
    loading,
    error,
    refresh,
  };
}
