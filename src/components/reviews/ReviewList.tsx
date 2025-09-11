import React, { useState } from 'react';
import type { Review, ReviewSortOption } from '../../types';
import { ReviewItem } from './ReviewItem';
import { Button, EmptyState } from '../ui';
import { MessageSquare, ChevronDown } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
  className?: string;
}

const REVIEWS_PER_PAGE = 5;

const sortOptions: { value: ReviewSortOption; label: string }[] = [
  { value: 'date', label: 'Most Recent' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'helpful', label: 'Most Helpful' }
];

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading = false,
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('date');
  const [visibleCount, setVisibleCount] = useState(REVIEWS_PER_PAGE);

  const sortReviews = (reviews: Review[], sortBy: ReviewSortOption): Review[] => {
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

  const sortedReviews = sortReviews(reviews, sortBy);
  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < sortedReviews.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + REVIEWS_PER_PAGE, sortedReviews.length));
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
            <div className="flex items-start space-x-3 mb-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare />}
        title="No reviews yet"
        description="Be the first to share your experience with this court!"
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Reviews ({reviews.length})
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="inline-flex items-center"
          >
            <span>Show More Reviews</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};