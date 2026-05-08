import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart as PieChartIcon, Filter, X } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  { fill: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
  { fill: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  { fill: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' },
  { fill: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { fill: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { fill: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
  { fill: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  { fill: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
];

/**
 * Custom tooltip for the pie chart with a polished glassmorphism look.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  const colorIndex = payload[0]?.payload?.index ?? 0;
  const color = COLORS[colorIndex % COLORS.length].fill;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="px-4 py-3 rounded-xl shadow-2xl border border-white/10"
      style={{
        background: 'rgba(15, 23, 42, 0.92)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span className="text-sm font-semibold text-white">{name}</span>
      </div>
      <p className="text-xs text-slate-400">
        {value} article{value !== 1 ? 's' : ''}
      </p>
    </motion.div>
  );
}

/**
 * Interactive doughnut chart showing news distribution by category.
 * Features animated hover states, a center summary, and clickable legend chips.
 */
function NewsPieChart({ data, activeCategory, onCategoryClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const hasData = data.length > 0;
  const totalArticles = data.reduce((sum, d) => sum + d.value, 0);

  // Add index to data for color mapping
  const indexedData = data.map((d, i) => ({ ...d, index: i }));

  const handleClick = (entry) => {
    if (activeCategory === entry.name) {
      onCategoryClick(null);
    } else {
      onCategoryClick(entry.name);
    }
  };

  const hoveredItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
            <PieChartIcon className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              News Distribution
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalArticles} articles across {data.length} categories
            </p>
          </div>
        </div>

        {activeCategory && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onCategoryClick(null)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-500/10 text-primary-500 text-xs font-medium hover:bg-primary-500/20 transition-colors"
          >
            <Filter className="w-3 h-3" />
            {activeCategory}
            <X className="w-3 h-3" />
          </motion.button>
        )}
      </div>

      {/* Chart with center label */}
      {hasData ? (
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={indexedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={hoveredIndex !== null ? 95 : 90}
                paddingAngle={4}
                dataKey="value"
                onClick={handleClick}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                cornerRadius={6}
                stroke="none"
              >
                {indexedData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length].fill}
                    opacity={
                      activeCategory && activeCategory !== entry.name
                        ? 0.25
                        : hoveredIndex !== null && hoveredIndex !== index
                        ? 0.5
                        : 1
                    }
                    style={{
                      filter:
                        hoveredIndex === index
                          ? `drop-shadow(0 0 8px ${COLORS[index % COLORS.length].glow})`
                          : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center summary */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredItem?.name || 'total'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <p className="text-2xl font-extrabold gradient-text">
                  {hoveredItem ? hoveredItem.value : totalArticles}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-[80px] leading-tight">
                  {hoveredItem ? hoveredItem.name : 'Total'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
          <div className="text-center">
            <PieChartIcon className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Loading category data...</p>
          </div>
        </div>
      )}

      {/* Legend chips */}
      {hasData && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/30">
          {data.map((entry, index) => {
            const color = COLORS[index % COLORS.length].fill;
            const isActive = activeCategory === entry.name;
            const isHovered = hoveredIndex === index;

            return (
              <motion.button
                key={entry.name}
                onClick={() => handleClick(entry)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 shadow-md'
                    : isHovered
                    ? 'shadow-sm'
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: `${color}${isActive ? '25' : '12'}`,
                  color: color,
                  ringColor: isActive ? color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: isActive || isHovered ? `0 0 6px ${color}` : 'none',
                  }}
                />
                {entry.name}
                <span
                  className="font-bold opacity-60"
                  style={{ fontSize: '10px' }}
                >
                  {entry.value}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default NewsPieChart;
