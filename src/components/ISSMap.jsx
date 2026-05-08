import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Satellite emoji marker
const issIcon = new L.DivIcon({
  className: '',
  html: `<div style="font-size:36px;line-height:1;cursor:pointer;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3));">🛰️</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  tooltipAnchor: [20, 0],
});

/**
 * Sub-component that pans the map to follow the ISS position smoothly.
 */
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.latitude, position.longitude], map.getZoom(), {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position, map]);

  return null;
}

/**
 * Interactive Leaflet map showing the ISS position with a satellite emoji marker.
 * Hovering the marker displays ISS details in a tooltip.
 * Draws a trajectory polyline from the last 15 positions.
 *
 * @param {object} currentPosition - { latitude, longitude, timestamp }
 * @param {Array} positions - Array of position objects for the trajectory path
 * @param {number} speed - Current speed in km/h
 * @param {string} location - Approximate location name
 */
function ISSMap({ currentPosition, positions, speed, location }) {
  const center = currentPosition
    ? [currentPosition.latitude, currentPosition.longitude]
    : [0, 0];

  // Build polyline coordinates from position history
  const trajectoryPath = useMemo(
    () => positions.map((p) => [p.latitude, p.longitude]),
    [positions]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden"
    >
      {/* Map header */}
      <div className="px-5 py-3 border-b border-white/10 dark:border-slate-700/30 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          🗺️ Live ISS Map
        </h2>
        <div className="flex items-center gap-2">
          <span className="live-indicator" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Real-time tracking
          </span>
        </div>
      </div>

      {/* Map container */}
      <div className="h-[350px] sm:h-[420px] w-full">
        <MapContainer
          center={center}
          zoom={3}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          style={{ borderRadius: '0 0 1rem 1rem', background: '#ffffff' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <MapUpdater position={currentPosition} />

          {/* ISS trajectory path using last 15 positions */}
          {trajectoryPath.length > 1 && (
            <Polyline
              positions={trajectoryPath}
              pathOptions={{
                color: '#6366f1',
                weight: 3,
                opacity: 0.6,
                dashArray: '8, 6',
                lineCap: 'round',
              }}
            />
          )}

          {/* ISS satellite emoji marker with hover tooltip */}
          {currentPosition && (
            <Marker
              position={[currentPosition.latitude, currentPosition.longitude]}
              icon={issIcon}
            >
              <Tooltip
                direction="right"
                offset={[10, 0]}
                opacity={1}
                permanent={false}
              >
                <div style={{ minWidth: '160px', padding: '4px 2px' }}>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>🛰️ ISS</p>
                  <p style={{ fontSize: '13px', margin: '2px 0' }}>
                    Lat: {currentPosition.latitude.toFixed(4)}
                  </p>
                  <p style={{ fontSize: '13px', margin: '2px 0' }}>
                    Lon: {currentPosition.longitude.toFixed(4)}
                  </p>
                  <p style={{ fontSize: '13px', margin: '2px 0' }}>
                    Speed: {speed > 0 ? `${speed.toFixed(0)} km/h` : 'Calculating...'}
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: 600, marginTop: '6px' }}>
                    📍 {location}
                  </p>
                </div>
              </Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>
    </motion.div>
  );
}

export default ISSMap;
