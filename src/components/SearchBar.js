// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearchSubmit }) => {
  const [term, setTerm] = useState('');

  const onFormSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(term);
  };

  return (
    <div className="ui segment">
      <form onSubmit={onFormSubmit} className="ui form">
        <div className="field">
          <label>Wallpaper Search</label>
          <div className="ui action input large">
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search for wallpapers..."
            />
            <button className="ui icon button" type="submit">
              <i className="search icon large"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;