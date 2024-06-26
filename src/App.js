// src/App.js
import React, { useState } from 'react';
import unsplash from './api/unsplash';
import SearchBar from './components/SearchBar';
import WallpaperList from './components/WallpaperList';
import './App.css';

const App = () => {
  const [wallpapers, setWallpapers] = useState([]);

  const onSearchSubmit = async (term) => {
    try {
      const response = await unsplash.get('/search/photos', {
        params: { query: term },
      });
      setWallpapers(response.data.results);
    } catch (error) {
      console.error('Error fetching data from Unsplash:', error);
    }
  };

  return (
    <div className="ui container" style={{ marginTop: '10px' }}>
      <SearchBar onSearchSubmit={onSearchSubmit} />
      <WallpaperList wallpapers={wallpapers} />
    </div>
  );
};

export default App;