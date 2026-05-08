import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error display component with retry capability.
 *
 * @param {string} message - Error message to display
 * @param {function} onRetry - Callback for the retry button
 */
function ErrorBox({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 text-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Something went wrong
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {message || 'An unexpected error occurred.'}
          </p>
        </div>

        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default ErrorBox;
