import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../assets/SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Tìm kiếm...' }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
      />
      {query && (
        <button className="clear-button" onClick={handleClear}>
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
