import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Court, SortOption, SearchFilters } from '../types';
import { mockCourts, searchCourts, filterCourts, sortCourts } from '../data';

interface CourtsState {
  courts: Court[];
  filteredCourts: Court[];
  searchTerm: string;
  filters: SearchFilters;
  sortBy: SortOption;
  loading: boolean;
  error: string | null;
}

type CourtsAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<SearchFilters> }
  | { type: 'SET_SORT_BY'; payload: SortOption }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FILTERS' };

const initialState: CourtsState = {
  courts: mockCourts,
  filteredCourts: mockCourts,
  searchTerm: '',
  filters: {
    surface: 'all',
    minRating: 0,
    maxPrice: 100,
    lighting: null,
    amenities: []
  },
  sortBy: 'rating',
  loading: false,
  error: null
};

const courtsReducer = (state: CourtsState, action: CourtsAction): CourtsState => {
  switch (action.type) {
    case 'SET_SEARCH_TERM': {
      const searchTerm = action.payload;
      const searchResults = searchTerm ? searchCourts(searchTerm) : state.courts;
      const filtered = filterCourts(searchResults, {
        surface: state.filters.surface,
        minRating: state.filters.minRating,
        maxPrice: state.filters.maxPrice,
        lighting: state.filters.lighting || undefined,
        amenities: state.filters.amenities
      });
      const sorted = sortCourts(filtered, state.sortBy);
      
      return {
        ...state,
        searchTerm,
        filteredCourts: sorted
      };
    }
    
    case 'SET_FILTERS': {
      const newFilters = { ...state.filters, ...action.payload };
      const searchResults = state.searchTerm ? searchCourts(state.searchTerm) : state.courts;
      const filtered = filterCourts(searchResults, {
        surface: newFilters.surface,
        minRating: newFilters.minRating,
        maxPrice: newFilters.maxPrice,
        lighting: newFilters.lighting || undefined,
        amenities: newFilters.amenities
      });
      const sorted = sortCourts(filtered, state.sortBy);
      
      return {
        ...state,
        filters: newFilters,
        filteredCourts: sorted
      };
    }
    
    case 'SET_SORT_BY': {
      const sortBy = action.payload;
      const sorted = sortCourts(state.filteredCourts, sortBy);
      
      return {
        ...state,
        sortBy,
        filteredCourts: sorted
      };
    }
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'RESET_FILTERS': {
      const resetFilters = initialState.filters;
      const searchResults = state.searchTerm ? searchCourts(state.searchTerm) : state.courts;
      const filtered = filterCourts(searchResults, {
        surface: resetFilters.surface,
        minRating: resetFilters.minRating,
        maxPrice: resetFilters.maxPrice,
        lighting: resetFilters.lighting || undefined,
        amenities: resetFilters.amenities
      });
      const sorted = sortCourts(filtered, state.sortBy);
      
      return {
        ...state,
        filters: resetFilters,
        filteredCourts: sorted
      };
    }
    
    default:
      return state;
  }
};

interface CourtsContextType {
  state: CourtsState;
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setSortBy: (option: SortOption) => void;
  resetFilters: () => void;
  getCourtById: (id: string) => Court | undefined;
}

const CourtsContext = createContext<CourtsContextType | undefined>(undefined);

interface CourtsProviderProps {
  children: ReactNode;
}

export const CourtsProvider: React.FC<CourtsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(courtsReducer, initialState);

  const setSearchTerm = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const setFilters = (filters: Partial<SearchFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSortBy = (option: SortOption) => {
    dispatch({ type: 'SET_SORT_BY', payload: option });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const getCourtById = (id: string) => {
    return state.courts.find(court => court.id === id);
  };

  const value: CourtsContextType = {
    state,
    setSearchTerm,
    setFilters,
    setSortBy,
    resetFilters,
    getCourtById
  };

  return (
    <CourtsContext.Provider value={value}>
      {children}
    </CourtsContext.Provider>
  );
};

export const useCourts = () => {
  const context = useContext(CourtsContext);
  if (context === undefined) {
    throw new Error('useCourts must be used within a CourtsProvider');
  }
  return context;
};