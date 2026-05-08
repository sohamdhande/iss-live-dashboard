import { motion } from 'framer-motion';

/**
 * Reusable skeleton loader component for loading states.
 * Supports different variants: card, text, circle, chart.
 */
function LoadingSkeleton({ variant = 'card', count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === 'text') {
    return (
      <div className="space-y-3">
        {skeletons.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2"
          >
            <div className="h-4 skeleton-shimmer rounded-lg w-3/4" />
            <div className="h-3 skeleton-shimmer rounded-lg w-1/2" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className="flex gap-3">
        {skeletons.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-12 h-12 skeleton-shimmer rounded-full"
          />
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-64 skeleton-shimmer rounded-2xl"
      />
    );
  }

  // Card variant (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletons.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-4 space-y-3"
        >
          <div className="h-40 skeleton-shimmer rounded-xl" />
          <div className="h-5 skeleton-shimmer rounded-lg w-3/4" />
          <div className="h-3 skeleton-shimmer rounded-lg w-1/2" />
          <div className="h-3 skeleton-shimmer rounded-lg w-2/3" />
        </motion.div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
