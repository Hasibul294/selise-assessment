"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { Studio, SearchFilters } from '@/types/studio';
import { studiosData } from '@/data/studios';
import StudioCard from './StudioCard';
import SearchBar from './SearchBar';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

const StudiosList: React.FC = () => {
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    location: '',
    radius: 10,
    type: '',
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    useCurrentLocation: false,
  });

  // Memoized filtered studios based on current filters
  const filteredStudios = useMemo(() => {
    let studios = studiosData.Studios.filter((studio) => {
      // Location-based radius search
      if (currentFilters.useCurrentLocation && currentFilters.userLocation) {
        const distance = calculateDistance(
          currentFilters.userLocation.latitude,
          currentFilters.userLocation.longitude,
          studio.Location.Coordinates.Latitude,
          studio.Location.Coordinates.Longitude
        );
        
        if (distance > currentFilters.radius) {
          return false;
        }
      }
      // Text-based filter for locaiton only on Area
      else if (currentFilters.location) {
        const searchTerm = currentFilters.location.toLowerCase();
        const areaMatch = studio.Location.Area.toLowerCase().includes(searchTerm);
        
        if (!areaMatch) {
          return false;
        }
      }

      // Type
      if (currentFilters.type && studio.Type !== currentFilters.type) {
        return false;
      }

      // Price
      if (studio.PricePerHour < currentFilters.minPrice || studio.PricePerHour > currentFilters.maxPrice) {
        return false;
      }

      // Rating
      if (currentFilters.minRating > 0 && studio.Rating < currentFilters.minRating) {
        return false;
      }

      return true;
    });

    // Sort by distance if using current location
    if (currentFilters.useCurrentLocation && currentFilters.userLocation) {
      studios = studios.sort((a, b) => {
        const distanceA = calculateDistance(
          currentFilters.userLocation!.latitude,
          currentFilters.userLocation!.longitude,
          a.Location.Coordinates.Latitude,
          a.Location.Coordinates.Longitude
        );
        const distanceB = calculateDistance(
          currentFilters.userLocation!.latitude,
          currentFilters.userLocation!.longitude,
          b.Location.Coordinates.Latitude,
          b.Location.Coordinates.Longitude
        );
        return distanceA - distanceB;
      });
    }

    return studios;
  }, [currentFilters]);

  const handleSearch = useCallback((filters: SearchFilters) => {
    setCurrentFilters(filters);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentFilters({
      location: '',
      radius: 10,
      type: '',
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
    });
  }, []);

  const sortedStudios = useMemo(() => {
    return [...filteredStudios].sort((a, b) => b.Rating - a.Rating);
  }, [filteredStudios]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Available Studios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and book professional studios for your creative projects
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} onReset={handleReset} />

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-gray-600">
              Showing <span className="font-semibold">{sortedStudios.length}</span> of{' '}
              <span className="font-semibold">{studiosData.Studios.length}</span> studios
            </p>
            {currentFilters.useCurrentLocation && currentFilters.userLocation ? (
              <p className="text-sm text-blue-600">
                Within {currentFilters.radius}km of your location
              </p>
            ) : currentFilters.location ? (
              <p className="text-sm text-blue-600">
                Filtered by location: {currentFilters.location}
              </p>
            ) : null}
            
            {/* No results message for radius search */}
            {currentFilters.useCurrentLocation && sortedStudios.length === 0 && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  No studios found within {currentFilters.radius}km of your location. 
                  Try increasing the search radius or search by area name instead.
                </p>
              </div>
            )}
          </div>
          
          {/* Quick stats */}
          <div className="hidden md:flex space-x-4 text-sm text-gray-500">
            <span>Recording Studios: {sortedStudios.filter(s => s.Type === 'Recording Studio').length}</span>
            <span>Photography: {sortedStudios.filter(s => s.Type === 'Photography').length}</span>
            <span>Rehearsal Spaces: {sortedStudios.filter(s => s.Type === 'Rehearsal Space').length}</span>
          </div>
        </div>

        {/* Studios Grid */}
        {sortedStudios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStudios.map((studio) => (
              <StudioCard 
                key={studio.Id} 
                studio={studio} 
                userLocation={currentFilters.useCurrentLocation ? currentFilters.userLocation : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No studios found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search filters to find more studios.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default StudiosList;
