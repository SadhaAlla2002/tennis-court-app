import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  const starSize = sizes[size];
  
  const handleStarClick = (selectedRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  // When not interactive, ensure star UI doesn't eat taps/clicks
  // so parent containers (e.g., cards) can receive onClick.
  const wrapperClasses = `flex items-center ${!interactive ? 'pointer-events-none' : ''} ${className}`;

  return (
    <div className={wrapperClasses}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        const isHalfFilled = starNumber - 0.5 === rating;
        
        return (
          <button
            key={index}
            type="button"
            className={`flex items-center justify-center ${interactive ? 'hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded min-h-[44px] min-w-[44px]' : ''}`}
            onClick={() => handleStarClick(starNumber)}
            disabled={!interactive}
            aria-label={`Rate ${starNumber} star${starNumber !== 1 ? 's' : ''}`}
          >
            <Star
              className={`${starSize} ${
                isFilled || isHalfFilled
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-sm text-gray-600 hidden sm:inline">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};
