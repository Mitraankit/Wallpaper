// src/hooks/useFavorites.js
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'wallpaperx:favorites';

const readStoredFavorites = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const useFavorites = () => {
  const [favorites, setFavorites] = useState(readStoredFavorites);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((fav) => fav.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((wallpaper) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === wallpaper.id)
        ? prev.filter((fav) => fav.id !== wallpaper.id)
        : [wallpaper, ...prev]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
};

export default useFavorites;
