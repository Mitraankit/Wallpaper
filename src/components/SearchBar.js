// src/components/SearchBar.js
import React, { useEffect, useRef } from 'react';

const DEBOUNCE_MS = 500;

const SearchBar = ({ term, onTermChange, onSearchSubmit, loading }) => {
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    clearTimeout(debounceRef.current);
    if (!term.trim()) return undefined;

    debounceRef.current = setTimeout(() => {
      onSearchSubmit(term.trim());
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const onFormSubmit = (event) => {
    event.preventDefault();
    clearTimeout(debounceRef.current);
    if (term.trim()) onSearchSubmit(term.trim());
  };

  const onClear = () => onTermChange('');

  return (
    <div className="search-bar">
      <form onSubmit={onFormSubmit} className="search-form">
        <div className="search-input-wrap">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.71 20.29 18 16.61A9 9 0 1 0 16.61 18l3.68 3.7a1 1 0 0 0 1.42-1.41ZM11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7Z"
            />
          </svg>
          <input
            type="text"
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            placeholder="Search wallpapers (e.g. mountains, space, minimal)…"
            aria-label="Search wallpapers"
          />
          {term && (
            <button
              type="button"
              className="clear-btn"
              onClick={onClear}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>
        <button className="search-btn" type="submit" disabled={loading || !term.trim()}>
          {loading ? <span className="btn-spinner" aria-hidden="true" /> : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
