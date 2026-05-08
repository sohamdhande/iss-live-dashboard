import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchSpaceNews } from '../services/newsService.js';
import { saveWithExpiry, loadWithExpiry, removeFromStorage } from '../utils/localStorage.js';

const CACHE_KEY = 'iss-tracker-news-cache';
const CACHE_TTL = 15; // 15 minutes

/**
 * Custom hook for fetching, caching, searching, sorting, and filtering news articles.
 */
export function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads news from cache or fetches from the API.
   */
  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = loadWithExpiry(CACHE_KEY);
      if (cached) {
        setArticles(cached);
        setFilteredArticles(cached);
        setLoading(false);
        return;
      }

      const data = await fetchSpaceNews();
      setArticles(data);
      setFilteredArticles(data);
      saveWithExpiry(CACHE_KEY, data, CACHE_TTL);
    } catch (err) {
      console.error('News fetch error:', err);
      setError('Failed to load news. Please try again.');
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Forces a fresh news fetch, bypassing cache.
   */
  const refreshNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    removeFromStorage(CACHE_KEY); // Clear stale cache

    try {
      const data = await fetchSpaceNews();
      setArticles(data);
      saveWithExpiry(CACHE_KEY, data, CACHE_TTL);
      toast.success('News refreshed!');
    } catch (err) {
      console.error('News refresh error:', err);
      setError('Failed to refresh news.');
      toast.error('Failed to refresh news');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Retries loading news after an error.
   */
  const retry = useCallback(() => {
    loadNews();
  }, [loadNews]);

  // Filter and sort whenever articles, search, sort, or category changes
  useEffect(() => {
    let result = [...articles];

    // Category filter
    if (activeCategory) {
      result = result.filter((a) => a.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'source') {
      result.sort((a, b) => a.source.localeCompare(b.source));
    }

    setFilteredArticles(result);
  }, [articles, searchQuery, sortBy, activeCategory]);

  // Initial load
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  /**
   * Get category distribution for the pie chart.
   */
  const getCategoryDistribution = useCallback(() => {
    const counts = {};
    articles.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [articles]);

  return {
    articles,
    filteredArticles,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeCategory,
    setActiveCategory,
    loading,
    error,
    refreshNews,
    retry,
    getCategoryDistribution,
  };
}
