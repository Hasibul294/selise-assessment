"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SearchFilters } from '@/types/studio';
import { studiosData } from '@/data/studios';
import { getCurrentLocation, LocationError, UserLocation, formatDistance } from '@/utils/locationUtils';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    radius: 10,
    type: '',
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    useCurrentLocation: false,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState<string[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const areas = useMemo(() => {
    return Array.from(new Set(studiosData.Studios.map(studio => studio.Location.Area))).sort();
  }, []);
  
  
  const studioTypes = [
    'Recording Studio', 'Photography', 'Rehearsal Space', 'Art Studio'
  ];

  // Real-time search as user types
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const updatedFilters = { 
        ...filters, 
        location: searchInput.trim() 
      };
      
      onSearch(updatedFilters);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchInput]);

  // Handle other filter changes
  useEffect(() => {
    const updatedFilters = { 
      ...filters, 
      location: searchInput.trim() 
    };
    onSearch(updatedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.radius, filters.type, filters.minPrice, filters.maxPrice, filters.minRating]);

  // Filter areas based on search input
  useEffect(() => {
    if (searchInput) {
      const filtered = areas.filter(area => 
        area.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredAreas(filtered);
      setShowSuggestions(filtered.length > 0 && searchInput.length > 0);
    } else {
      setFilteredAreas([]);
      setShowSuggestions(false);
    }
  }, [searchInput, areas]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSuggestionClick = (area: string) => {
    setSearchInput(area);
    setShowSuggestions(false);
    // Disable location-based search when selecting area
    setFilters(prev => ({ ...prev, useCurrentLocation: false }));
    setLocationError('');
    // The useEffect will handle the search automatically when searchInput changes
  };

  const handleLocationToggle = async () => {
    if (filters.useCurrentLocation) {
      // Disable location-based search
      setFilters(prev => ({ 
        ...prev, 
        useCurrentLocation: false,
        userLocation: undefined 
      }));
      setUserLocation(null);
      setLocationError('');
      return;
    }

    // Enable location-based search
    setIsGettingLocation(true);
    setLocationError('');
    
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setFilters(prev => ({ 
        ...prev, 
        useCurrentLocation: true,
        userLocation: location 
      }));
      // Clear text search when using location
      setSearchInput('');
      setShowSuggestions(false);
    } catch (error) {
      const locationError = error as LocationError;
      setLocationError(locationError.message);
      setFilters(prev => ({ ...prev, useCurrentLocation: false }));
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleReset = () => {
    setFilters({
      location: '',
      radius: 10,
      type: '',
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      useCurrentLocation: false,
    });
    setSearchInput('');
    setShowSuggestions(false);
    setLocationError('');
    setUserLocation(null);
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Location Search with Auto-complete */}
        <div className="relative" ref={searchRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Location
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Type area name (e.g., Gulshan, Dhanmondi)"
              className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search location"
              onFocus={() => setShowSuggestions(filteredAreas.length > 0)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setShowSuggestions(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Auto-complete Suggestions */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredAreas.length > 0 ? (
                filteredAreas.map((area, index) => {
                  const studioCount = studiosData.Studios.filter(studio => studio.Location.Area === area).length;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(area)}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-900">{area}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {studioCount} studio{studioCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  No areas found matching "{searchInput}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current Location Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Location
          </label>
          <button
            type="button"
            onClick={handleLocationToggle}
            disabled={isGettingLocation}
            className={`w-full flex items-center justify-center px-3 py-2 text-sm border rounded-md transition-colors ${
              filters.useCurrentLocation
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } ${isGettingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGettingLocation ? (
              <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
            <span className="truncate">
              {isGettingLocation ? 'Getting...' : 
               filters.useCurrentLocation ? 'Active' : 'Current Location'}
            </span>
          </button>
        </div>

        {/* Radius */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radius (km)
          </label>
          <select
            value={filters.radius}
            onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select radius"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={20}>20 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        {/* Studio Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Studio Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select studio type"
          >
            <option value="">All Types</option>
            {studioTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">
            Reset
          </label>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            aria-label="Reset filters"
            title="Reset all filters"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Status Messages Row */}
      <div className="mb-4">
        {/* Location Status */}
        {filters.useCurrentLocation && userLocation && (
          <div className="text-xs text-green-600 flex items-center mb-2">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Location detected: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
          </div>
        )}
        
        {/* Location Error */}
        {locationError && (
          <div className="text-xs text-red-600 flex items-center mb-2">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {locationError}
          </div>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        <svg
          className={`w-4 h-4 inline ml-1 transform transition-transform ${
            showAdvanced ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range (৳/hour)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || 5000 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select minimum rating"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
