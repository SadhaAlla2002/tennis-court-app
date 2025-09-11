import { generateMockReviews } from './generators';
import { mockCourts } from './mockCourts';
import type { Review, NewReview } from '../types';

export let mockReviews = generateMockReviews(mockCourts);

export const getReviewsByCourtId = (courtId: string) => 
  mockReviews.filter(review => review.courtId === courtId);

export const addReview = (newReview: NewReview): Review => {
  const review: Review = {
    ...newReview,
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    helpful: 0,
    verified: false
  };
  
  mockReviews = [review, ...mockReviews];
  return review;
};

export const sortReviews = (reviews: Review[], sortBy: 'date' | 'rating' | 'helpful' = 'date') => {
  return [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });
};

export const getAverageRating = (courtId: string): number => {
  const courtReviews = getReviewsByCourtId(courtId);
  if (courtReviews.length === 0) return 0;
  
  const sum = courtReviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / courtReviews.length).toFixed(1));
};