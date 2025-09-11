import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SearchBar } from '../components/search/SearchBar';
import { CourtGrid } from '../components/courts/CourtGrid';
import { Button } from '../components/ui';
import { useCourts } from '../context';
import type { SortOption, SurfaceFilter } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface CourtListPageProps {
  onCourtClick: (courtId: string) => void;
}

export const CourtListPage: React.FC<CourtListPageProps> = ({
  onCourtClick
}) => {
  const { state, setSearchTerm, setFilters, setSortBy, resetFilters } = useCourts();
  const [showFilters, setShowFilters] = useState(false);

  const handleSortChange = (sortBy: SortOption) => {
    setSortBy(sortBy);
  };

  const handleSurfaceFilterChange = (surface: SurfaceFilter) => {
    setFilters({ surface });
  };

  const handlePriceFilterChange = (maxPrice: number) => {
    setFilters({ maxPrice });
  };

  const handleRatingFilterChange = (minRating: number) => {
    setFilters({ minRating });
  };

  const handleLightingFilterChange = (lighting: boolean | null) => {
    setFilters({ lighting });
  };

  const activeFiltersCount = [
    state.filters.surface !== 'all',
    state.filters.minRating > 0,
    state.filters.maxPrice < 100,
    state.filters.lighting !== null
  ].filter(Boolean).length;

  return (
    <Layout
      title="Tennis Courts"
      headerRightContent={
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <SearchBar
          value={state.searchTerm}
          onChange={setSearchTerm}
          placeholder="Search courts by name, location, or amenities..."
        />

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Surface Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface Type
                </label>
                <select
                  value={state.filters.surface}
                  onChange={(e) => handleSurfaceFilterChange(e.target.value as SurfaceFilter)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Surfaces</option>
                  <option value="Hard">Hard Court</option>
                  <option value="Clay">Clay Court</option>
                  <option value="Grass">Grass Court</option>
                  <option value="Indoor">Indoor Court</option>
                </select>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={state.filters.minRating}
                  onChange={(e) => handleRatingFilterChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              {/* Maximum Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price per Hour
                </label>
                <select
                  value={state.filters.maxPrice}
                  onChange={(e) => handlePriceFilterChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={100}>Any Price</option>
                  <option value={30}>Under $30</option>
                  <option value={50}>Under $50</option>
                  <option value={75}>Under $75</option>
                </select>
              </div>

              {/* Lighting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lighting
                </label>
                <select
                  value={state.filters.lighting === null ? 'any' : String(state.filters.lighting)}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleLightingFilterChange(
                      value === 'any' ? null : value === 'true'
                    );
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="any">Any</option>
                  <option value="true">Lighted</option>
                  <option value="false">Not Lighted</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {state.filteredCourts.length} court{state.filteredCourts.length !== 1 ? 's' : ''} found
            {state.searchTerm && ` for "${state.searchTerm}"`}
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={state.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">Highest Rating</option>
              <option value="price">Lowest Price</option>
              <option value="name">Name A-Z</option>
              <option value="reviewCount">Most Reviews</option>
            </select>
          </div>
        </div>

        {/* Courts Grid */}
        <CourtGrid
          courts={state.filteredCourts}
          onCourtClick={onCourtClick}
          loading={state.loading}
        />
      </div>
    </Layout>
  );
};