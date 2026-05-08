import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

/**
 * Real-time ISS speed chart showing the last 30 speed readings.
 *
 * @param {Array} speeds - Array of { time, speed, timestamp }
 */
function SpeedChart({ speeds }) {
  const hasData = speeds.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Speed History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last {speeds.length} readings (km/h)
          </p>
        </div>
      </div>

      {hasData ? (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={speeds} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(148,163,184,0.15)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  color: '#e2e8f0',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${value.toLocaleString()} km/h`, 'Speed']}
                labelStyle={{ color: '#94a3b8', fontSize: '11px' }}
              />
              <Area
                type="monotone"
                dataKey="speed"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#speedGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#6366f1',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-56 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          Collecting speed data... (updates every 15s)
        </div>
      )}
    </motion.div>
  );
}

export default SpeedChart;
