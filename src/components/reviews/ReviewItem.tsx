import React from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import type { Review } from '../../types';
import { StarRating } from '../ui';

interface ReviewItemProps {
  review: Review;
  className?: string;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  return (
    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex items-start justify-between mb-3 gap-2 flex-wrap">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {review.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center space-x-2 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate max-w-[60vw] sm:max-w-none">
                {review.author}
              </h4>
              {review.verified && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {formatDate(review.date)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 order-3 w-full sm:w-auto sm:order-2 mt-2 sm:mt-0">
          <StarRating rating={review.rating} size="sm" className="w-full justify-start sm:justify-end" />
        </div>
      </div>
      
      {review.title && (
        <h5 className="text-sm font-medium text-gray-900 mb-2">
          {review.title}
        </h5>
      )}
      
      <p className="text-sm text-gray-700 line-height-relaxed mb-3">
        {review.comment}
      </p>
      
      {review.helpful > 0 && (
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <ThumbsUp className="h-3 w-3" />
          <span>{review.helpful} found this helpful</span>
        </div>
      )}
    </div>
  );
};
