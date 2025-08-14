import React, { useState } from 'react';

interface SearchFormProps {
  onSearch: (zipCode: string) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [searchZip, setSearchZip] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchZip.trim());
  };

  const handleClear = () => {
    setSearchZip('');
    onSearch(''); // Empty search shows all users
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits and limit to 5 characters
    if (/^\d{0,5}$/.test(value)) {
      setSearchZip(value);
    }
  };

  return (
    <div className="search-form">
      <h3>Search Users</h3>
      <form onSubmit={handleSubmit} className="search-form-container">
        <div className="search-input-group">
          <input
            type="text"
            value={searchZip}
            onChange={handleInputChange}
            placeholder="Enter zip code to search..."
            className="search-input"
            disabled={loading}
            maxLength={5}
          />
          <button
            type="submit"
            className="btn btn-search"
            disabled={loading || !searchZip.trim()}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-clear"
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
      {searchZip && (
        <p className="search-info">
          {loading ? 'Searching...' : `Searching for users in zip code: ${searchZip}`}
        </p>
      )}
    </div>
  );
};

export default SearchForm;
