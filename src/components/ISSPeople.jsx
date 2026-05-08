import { motion } from 'framer-motion';
import { Users, Rocket } from 'lucide-react';

/**
 * Displays astronauts currently in space, grouped by spacecraft.
 *
 * @param {Array} people - Array of { name, craft }
 * @param {number} count - Total number of people in space
 */
function ISSPeople({ people, count }) {
  // Group astronauts by spacecraft
  const grouped = people.reduce((acc, person) => {
    if (!acc[person.craft]) acc[person.craft] = [];
    acc[person.craft].push(person.name);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            People in Space
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {count} astronaut{count !== 1 ? 's' : ''} currently in orbit
          </p>
        </div>
      </div>

      {/* Spacecraft groups */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([craft, names], groupIndex) => (
          <motion.div
            key={craft}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {craft}
              </span>
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full font-medium">
                {names.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {names.map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/50 dark:bg-slate-700/40 border border-slate-200/50 dark:border-slate-600/30 text-sm text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-600/40 transition-colors duration-200"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  {name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {people.length === 0 && (
        <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
          Loading astronaut data...
        </p>
      )}
    </motion.div>
  );
}

export default ISSPeople;
