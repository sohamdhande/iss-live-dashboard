import { motion } from 'framer-motion';
import { useISSData } from '../hooks/useISSData.js';
import { useNewsData } from '../hooks/useNewsData.js';
import ISSMap from '../components/ISSMap.jsx';
import ISSStats from '../components/ISSStats.jsx';
import ISSPeople from '../components/ISSPeople.jsx';
import SpeedChart from '../components/SpeedChart.jsx';
import NewsPieChart from '../components/NewsPieChart.jsx';
import NewsSection from '../components/NewsSection.jsx';
import Chatbot from '../components/Chatbot.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

/**
 * Main dashboard page assembling all widgets:
 * ISS stats, map, people in space, speed chart, news section, pie chart, and AI chatbot.
 */
function Dashboard() {
  const {
    currentPosition,
    positions,
    speeds,
    currentSpeed,
    location,
    people,
    peopleCount,
    loading: issLoading,
    error: issError,
    refresh: issRefresh,
  } = useISSData();

  const {
    articles,
    filteredArticles,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeCategory,
    setActiveCategory,
    loading: newsLoading,
    error: newsError,
    refreshNews,
    retry: newsRetry,
    getCategoryDistribution,
  } = useNewsData();

  // Build dashboard data object for the chatbot to use for grounded responses
  const chatbotData = {
    iss: currentPosition
      ? {
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          speed: currentSpeed,
          location,
          positionCount: positions.length,
        }
      : null,
    astronauts: people,
    news: articles,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center sm:text-left"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text mb-1">
          Mission Control Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Real-time ISS tracking • Space news • AI-powered insights
        </p>
      </motion.div>

      {/* ISS Section */}
      {issError && !currentPosition ? (
        <ErrorBox message={issError} onRetry={issRefresh} />
      ) : (
        <>
          {/* Row 1: Stats + People */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {issLoading && !currentPosition ? (
                <LoadingSkeleton variant="chart" />
              ) : (
                <ISSStats
                  currentPosition={currentPosition}
                  speed={currentSpeed}
                  location={location}
                  positionCount={positions.length}
                  onRefresh={issRefresh}
                />
              )}
            </div>
            <div>
              <ISSPeople people={people} count={peopleCount} />
            </div>
          </div>

          {/* Row 2: Map + Speed Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ISSMap
              currentPosition={currentPosition}
              positions={positions}
              speed={currentSpeed}
              location={location}
            />
            <SpeedChart speeds={speeds} />
          </div>
        </>
      )}

      {/* News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <NewsSection
            articles={filteredArticles}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            loading={newsLoading}
            error={newsError}
            onRefresh={refreshNews}
            onRetry={newsRetry}
          />
        </div>
        <div>
          <NewsPieChart
            data={getCategoryDistribution()}
            activeCategory={activeCategory}
            onCategoryClick={setActiveCategory}
          />
        </div>
      </div>

      {/* AI Chatbot — receives real dashboard data for grounded responses */}
      <Chatbot dashboardData={chatbotData} />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-6 text-xs text-slate-400 dark:text-slate-600"
      >
        <p>
          ISS Live Tracker & AI News Dashboard • Built with React, Vite & Tailwind CSS
        </p>
        <p className="mt-1">
          Data from{' '}
          <a
            href="http://api.open-notify.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-500 transition-colors"
          >
            Open Notify API
          </a>
          {' • AI powered by '}
          <a
            href="https://huggingface.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 hover:text-primary-500 transition-colors"
          >
            Hugging Face
          </a>
        </p>
      </motion.footer>
    </div>
  );
}

export default Dashboard;
