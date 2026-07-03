// src/components/SuggestedSearches.js
import React from 'react';

const TERMS = [
  'Nature',
  'Abstract',
  'Minimal',
  'Space',
  'Ocean',
  'Mountains',
  'City',
  'Dark',
  'Flowers',
  'Sunset',
  'Architecture',
  'Texture',
];

const SuggestedSearches = ({ onSelect, label }) => (
  <div className="suggested-searches">
    {label && <p className="suggested-label">{label}</p>}
    <div className="suggestion-chips">
      {TERMS.map((term) => (
        <button
          key={term}
          type="button"
          className="suggestion-chip"
          onClick={() => onSelect(term)}
        >
          {term}
        </button>
      ))}
    </div>
  </div>
);

export default SuggestedSearches;
