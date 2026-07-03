// src/components/WallpaperList.js
import React from 'react';
import Wallpaper from './Wallpaper';

const WallpaperList = ({ wallpapers, isFavorite, onToggleFavorite }) => {
  return (
    <div className="wallpaper-list">
      {wallpapers.map((wallpaper) => (
        <Wallpaper
          key={wallpaper.id}
          wallpaper={wallpaper}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default WallpaperList;
