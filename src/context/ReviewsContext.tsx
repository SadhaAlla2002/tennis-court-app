import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Review, NewReview, ReviewSortOption } from '../types';
import { mockReviews, sortReviews } from '../data';

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

type ReviewsAction =
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: ReviewsState = {
  reviews: mockReviews,
  loading: false,
  error: null
};

const reviewsReducer = (state: ReviewsState, action: ReviewsAction): ReviewsState => {
  switch (action.type) {
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.payload, ...state.reviews]
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
};

interface ReviewsContextType {
  state: ReviewsState;
  getCourtReviews: (courtId: string, sortBy?: ReviewSortOption) => Review[];
  addCourtReview: (newReview: NewReview) => Promise<Review>;
  getAverageRating: (courtId: string) => number;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

interface ReviewsProviderProps {
  children: ReactNode;
}

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reviewsReducer, initialState);

  const getCourtReviews = (courtId: string, sortBy: ReviewSortOption = 'date') => {
    const courtReviews = state.reviews.filter(review => review.courtId === courtId);
    return sortReviews(courtReviews, sortBy);
  };

  const addCourtReview = async (newReview: NewReview): Promise<Review> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const review: Review = {
        ...newReview,
        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        helpful: 0,
        verified: false
      };
      
      dispatch({ type: 'ADD_REVIEW', payload: review });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return review;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add review' });
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const getAverageRating = (courtId: string): number => {
    const courtReviews = getCourtReviews(courtId);
    if (courtReviews.length === 0) return 0;
    
    const sum = courtReviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / courtReviews.length).toFixed(1));
  };

  const value: ReviewsContextType = {
    state,
    getCourtReviews,
    addCourtReview,
    getAverageRating
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};