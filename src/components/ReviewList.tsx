import React, { useState } from 'react';
import type { Review } from '../types';
import { StarRating } from './ui/StarRating';
import { ThumbsUp, User, ChevronDown, ChevronUp } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  onHelpful?: (reviewId: string) => void;
}

type SortOption = 'recent' | 'rating-high' | 'rating-low' | 'helpful';

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onHelpful }) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [showAll, setShowAll] = useState(false);

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'rating-high':
        return b.rating - a.rating;
      case 'rating-low':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 5);

  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
              <StarRating rating={averageRating} size="sm" />
              <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
            </div>
            
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${((ratingCounts[rating] || 0) / reviews.length) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-10">
                    {ratingCounts[rating] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-3 ml-13">{review.comment}</p>
              
              <button
                onClick={() => onHelpful?.(review.id)}
                className="ml-13 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ThumbsUp size={16} />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to write one!
          </p>
        )}
      </div>

      {reviews.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp size={20} />
            </>
          ) : (
            <>
              Show All {reviews.length} Reviews <ChevronDown size={20} />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default React.memo(ReviewList);