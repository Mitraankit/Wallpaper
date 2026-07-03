// src/components/FilterBar.js
import React from 'react';

const ORIENTATIONS = [
  { label: 'Any', value: '' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Square', value: 'squarish' },
];

const COLORS = [
  { label: 'Any', value: '' },
  { label: 'Black & white', value: 'black_and_white', swatch: 'linear-gradient(135deg,#000 50%,#fff 50%)' },
  { label: 'Black', value: 'black', swatch: '#111' },
  { label: 'White', value: 'white', swatch: '#fff' },
  { label: 'Yellow', value: 'yellow', swatch: '#f5d90a' },
  { label: 'Orange', value: 'orange', swatch: '#f5a623' },
  { label: 'Red', value: 'red', swatch: '#e5484d' },
  { label: 'Purple', value: 'purple', swatch: '#a855f7' },
  { label: 'Green', value: 'green', swatch: '#22c55e' },
  { label: 'Teal', value: 'teal', swatch: '#14b8a6' },
  { label: 'Blue', value: 'blue', swatch: '#3b82f6' },
];

const FilterBar = ({
  orientation,
  onOrientationChange,
  color,
  onColorChange,
  orderBy,
  onOrderByChange,
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group" role="group" aria-label="Orientation">
        {ORIENTATIONS.map((o) => (
          <button
            key={o.value || 'any-orientation'}
            type="button"
            className={`filter-pill ${orientation === o.value ? 'active' : ''}`}
            onClick={() => onOrientationChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="filter-group colors" role="group" aria-label="Color">
        {COLORS.map((c) => (
          <button
            key={c.value || 'any-color'}
            type="button"
            className={`color-swatch ${color === c.value ? 'active' : ''} ${!c.value ? 'any' : ''}`}
            style={c.swatch ? { background: c.swatch } : undefined}
            onClick={() => onColorChange(c.value)}
            aria-label={c.label}
            aria-pressed={color === c.value}
            title={c.label}
          />
        ))}
      </div>

      <div className="filter-group" role="group" aria-label="Sort">
        <button
          type="button"
          className={`filter-pill ${orderBy === 'relevant' ? 'active' : ''}`}
          onClick={() => onOrderByChange('relevant')}
        >
          Relevant
        </button>
        <button
          type="button"
          className={`filter-pill ${orderBy === 'latest' ? 'active' : ''}`}
          onClick={() => onOrderByChange('latest')}
        >
          Latest
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
