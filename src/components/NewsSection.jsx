import { motion } from 'framer-motion';
import { Search, SortAsc, RefreshCw, Newspaper } from 'lucide-react';
import NewsCard from './NewsCard.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import ErrorBox from './ErrorBox.jsx';

/**
 * Complete news section with search, sort, refresh, and card grid.
 *
 * @param {Array} articles - Filtered array of article objects
 * @param {string} searchQuery - Current search string
 * @param {function} onSearchChange - Handler for search input changes
 * @param {string} sortBy - Current sort mode ('date' | 'source')
 * @param {function} onSortChange - Handler for sort mode changes
 * @param {boolean} loading - Whether news is loading
 * @param {string|null} error - Error message if fetch failed
 * @param {function} onRefresh - Handler to refresh news
 * @param {function} onRetry - Handler to retry after error
 */
function NewsSection({
  articles,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  loading,
  error,
  onRefresh,
  onRetry,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              Space News
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {articles.length} article{articles.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        <motion.button
          onClick={onRefresh}
          className="btn-secondary flex items-center gap-1.5 text-sm self-start sm:self-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="news-refresh-btn"
          disabled={loading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="news-search"
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all duration-200"
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            id="news-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl bg-white/50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <ErrorBox message={error} onRetry={onRetry} />
      ) : loading ? (
        <LoadingSkeleton variant="card" count={6} />
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No articles match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </div>
      )}
    </motion.section>
  );
}

export default NewsSection;
