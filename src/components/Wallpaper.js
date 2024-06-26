// src/components/Wallpaper.js
import React, { useState } from 'react';
// import './Wallpaper.css'; // Ensure this file is imported to apply styles

const Wallpaper = ({ wallpaper }) => {
  const [viewLarge, setViewLarge] = useState(false);

  const toggleViewLarge = () => {
    setViewLarge(!viewLarge);
  };

  return (
    <div className="wallpaper-item">
      <div
        className={`image-container ${viewLarge ? 'view-large' : ''}`}
        onClick={toggleViewLarge}
      >
        <img
          src={wallpaper.urls.small}
          alt={wallpaper.alt_description}
          className="wallpaper-image"
        />
        {viewLarge && (
          <div className="overlay" onClick={toggleViewLarge}>
            <img
              src={wallpaper.urls.full}
              alt={wallpaper.alt_description}
              className="full-image"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallpaper;