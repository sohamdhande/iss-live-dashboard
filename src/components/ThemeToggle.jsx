import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Animated dark/light theme toggle button.
 */
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      id="theme-toggle"
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white/50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-600/50 transition-all duration-300 shadow-sm"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-primary-600" />
        )}
      </motion.div>
    </motion.button>
  );
}

export default ThemeToggle;
