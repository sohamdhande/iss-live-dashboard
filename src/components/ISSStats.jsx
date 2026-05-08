import { motion } from 'framer-motion';
import {
  MapPin,
  Gauge,
  Navigation,
  Clock,
  Hash,
  RefreshCw,
} from 'lucide-react';

/**
 * Displays ISS statistics in a glassmorphic card grid.
 *
 * @param {object} currentPosition - { latitude, longitude, timestamp }
 * @param {number} speed - Current speed in km/h
 * @param {string} location - Approximate location name
 * @param {number} positionCount - Number of tracked positions
 * @param {function} onRefresh - Manual refresh handler
 */
function ISSStats({ currentPosition, speed, location, positionCount, onRefresh }) {
  const stats = [
    {
      icon: MapPin,
      label: 'Latitude',
      value: currentPosition?.latitude?.toFixed(4) || '—',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Navigation,
      label: 'Longitude',
      value: currentPosition?.longitude?.toFixed(4) || '—',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      icon: Gauge,
      label: 'Speed',
      value: speed > 0 ? `${speed.toFixed(0)} km/h` : 'Calculating...',
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: location || 'Detecting...',
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Hash,
      label: 'Tracked',
      value: `${positionCount} pts`,
      color: 'text-pink-500',
      bg: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      icon: Clock,
      label: 'Last Update',
      value: currentPosition?.timestamp
        ? new Date(currentPosition.timestamp * 1000).toLocaleTimeString()
        : '—',
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span className="live-indicator" />
          ISS Live Stats
        </h2>
        <motion.button
          onClick={onRefresh}
          className="btn-secondary flex items-center gap-1.5 text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="iss-refresh-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </motion.button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="relative p-3.5 rounded-xl bg-white/40 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/20 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-all duration-300 group"
          >
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="stat-label">{stat.label}</p>
            <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-white truncate mt-0.5">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default ISSStats;
