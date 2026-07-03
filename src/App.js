// src/App.js
import React, { useCallback, useState } from 'react';
import unsplash from './api/unsplash';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import SuggestedSearches from './components/SuggestedSearches';
import WallpaperList from './components/WallpaperList';
import useFavorites from './hooks/useFavorites';
import './App.css';

const PER_PAGE = 24;
const SPARSE_RESULTS_THRESHOLD = 6;

const App = () => {
  const [term, setTerm] = useState('');
  const [wallpapers, setWallpapers] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const [orientation, setOrientation] = useState('');
  const [color, setColor] = useState('');
  const [orderBy, setOrderBy] = useState('relevant');

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const fetchWallpapers = useCallback(async (searchTerm, pageNum, append, filters) => {
    if (!searchTerm) return;

    append ? setLoadingMore(true) : setLoading(true);
    setError(null);

    try {
      const params = {
        query: searchTerm,
        page: pageNum,
        per_page: PER_PAGE,
        order_by: filters.orderBy,
      };
      if (filters.orientation) params.orientation = filters.orientation;
      if (filters.color) params.color = filters.color;

      const response = await unsplash.get('/search/photos', { params });
      const { results, total_pages, total } = response.data;
      setWallpapers((prev) => (append ? [...prev, ...results] : results));
      setTotalPages(total_pages);
      setTotalResults(total);
    } catch (err) {
      setError('Something went wrong while fetching wallpapers. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const onSearchSubmit = (searchTerm) => {
    setShowFavorites(false);
    setTerm(searchTerm);
    setQuery(searchTerm);
    setPage(1);
    setHasSearched(true);
    fetchWallpapers(searchTerm, 1, false, { orientation, color, orderBy });
  };

  const onLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchWallpapers(query, nextPage, true, { orientation, color, orderBy });
  };

  const rerunWithFilters = (nextFilters) => {
    if (!query) return;
    setPage(1);
    fetchWallpapers(query, 1, false, nextFilters);
  };

  const onOrientationChange = (value) => {
    setOrientation(value);
    rerunWithFilters({ orientation: value, color, orderBy });
  };

  const onColorChange = (value) => {
    setColor(value);
    rerunWithFilters({ orientation, color: value, orderBy });
  };

  const onOrderByChange = (value) => {
    setOrderBy(value);
    rerunWithFilters({ orientation, color, orderBy: value });
  };

  const hasMore = page < totalPages;
  const isSparse =
    hasSearched && !loading && wallpapers.length > 0 && totalResults < SPARSE_RESULTS_THRESHOLD;

  return (
    <div className="app">
      <header className="app-header">
        <h1>WallpaperX</h1>
      </header>

      <div className="toolbar">
        <SearchBar
          term={term}
          onTermChange={setTerm}
          onSearchSubmit={onSearchSubmit}
          loading={loading}
        />
        <button
          type="button"
          className={`favorites-toggle ${showFavorites ? 'active' : ''}`}
          onClick={() => setShowFavorites((v) => !v)}
          aria-pressed={showFavorites}
        >
          &#9825; Favorites{favorites.length > 0 ? ` (${favorites.length})` : ''}
        </button>
      </div>

      {!showFavorites && hasSearched && (
        <FilterBar
          orientation={orientation}
          onOrientationChange={onOrientationChange}
          color={color}
          onColorChange={onColorChange}
          orderBy={orderBy}
          onOrderByChange={onOrderByChange}
        />
      )}

      <main className="app-main">
        {showFavorites ? (
          favorites.length === 0 ? (
            <div className="empty-state">
              <p>No favorites yet. Tap the heart on any wallpaper to save it here.</p>
            </div>
          ) : (
            <WallpaperList
              wallpapers={favorites}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          )
        ) : (
          <>
            {error && <div className="error-banner">{error}</div>}

            {!hasSearched && !loading && (
              <div className="empty-state">
                <p>Search for a place, mood, or object to get started — Unsplash is a stock photo library, so it's best for things like scenery, textures, and abstract art rather than specific people.</p>
                <SuggestedSearches onSelect={onSearchSubmit} label="Try one of these:" />
              </div>
            )}

            {hasSearched && !loading && wallpapers.length === 0 && !error && (
              <div className="empty-state">
                <p>
                  No wallpapers found for &ldquo;{query}&rdquo;. Unsplash is a stock photo
                  library, so it won't have results for specific people, brands, or events —
                  try a broader, more visual term instead.
                </p>
                <SuggestedSearches onSelect={onSearchSubmit} label="Try one of these:" />
              </div>
            )}

            {isSparse && (
              <div className="hint-banner">
                Only {totalResults} loosely related result{totalResults === 1 ? '' : 's'} for
                &ldquo;{query}&rdquo;. Unsplash may not have great matches for this term — try
                a broader search below.
                <SuggestedSearches onSelect={onSearchSubmit} />
              </div>
            )}

            {loading && (
              <div className="loading-indicator">
                <span className="spinner" />
                <span>Loading wallpapers…</span>
              </div>
            )}

            {!loading && wallpapers.length > 0 && (
              <>
                <WallpaperList
                  wallpapers={wallpapers}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />

                {hasMore && (
                  <div className="load-more-wrap">
                    <button
                      className="load-more-btn"
                      onClick={onLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? 'Loading…' : 'Load more wallpapers'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Photos provided by{' '}
          <a
            href="https://unsplash.com/?utm_source=wallpaperx&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
