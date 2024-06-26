// src/components/WallpaperList.js
import React from 'react';
import Wallpaper from './Wallpaper';

const WallpaperList = ({ wallpapers }) => {
  const renderedList = wallpapers.map((wallpaper) => {
    return <Wallpaper key={wallpaper.id} wallpaper={wallpaper} />;
  });

  return (
    <div className="wallpaper-list">
      {renderedList}
    </div>
  );
};

export default WallpaperList;