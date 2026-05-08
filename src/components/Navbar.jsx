import { motion } from 'framer-motion';
import { Satellite, Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

/**
 * Top navigation bar with animated logo, live indicator, and theme toggle.
 */
function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass-card-strong border-b border-white/10 dark:border-slate-700/30 rounded-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Satellite className="w-8 h-8 text-primary-500" />
            </motion.div>

            <div>
              <h1 className="text-lg sm:text-xl font-bold gradient-text leading-tight">
                ISS Live Tracker
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                AI News Dashboard
              </p>
            </div>
          </div>

          {/* Right: Live indicator + Theme Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40">
              <span className="live-indicator" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
                Live
              </span>
              <Activity className="w-3.5 h-3.5 text-green-500 animate-pulse" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
