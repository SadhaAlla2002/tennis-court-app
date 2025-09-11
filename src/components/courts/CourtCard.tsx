import React, { useRef, memo } from 'react';
import { MapPin, Zap } from 'lucide-react';
import type { Court } from '../../types';
import { Card, StarRating, LoadingSkeleton } from '../ui';
import { useIntersectionObserver } from '../../hooks';

interface CourtCardProps {
  court: Court;
  onClick: (courtId: string) => void;
  className?: string;
}

const CourtCardComponent: React.FC<CourtCardProps> = ({
  court,
  onClick,
  className = ''
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imageRef, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  const handleClick = () => {
    onClick(court.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      hoverable
      className={`cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${court.name}`}
    >
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
          <img
            ref={imageRef}
            src={isVisible ? court.imageUrl : undefined}
            alt={court.name}
            className={`w-full h-48 object-cover transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
          {!isVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSkeleton className="w-full h-full" />
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1">
          <span className="text-sm font-semibold text-gray-900">
            ${court.hourlyRate}/hr
          </span>
        </div>
      </div>
      
      <div className="mt-4 px-1">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          {court.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={court.rating} size="sm" />
          <span className="text-sm text-gray-600">({court.rating.toFixed(1)})</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{court.location}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="inline-flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                court.surface === 'Hard' ? 'bg-blue-500' :
                court.surface === 'Clay' ? 'bg-orange-500' :
                court.surface === 'Grass' ? 'bg-green-500' :
                'bg-gray-500'
              }`} />
              {court.surface}
            </span>
            
            {court.lighting && (
              <span className="inline-flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                Lit
              </span>
            )}
          </div>
          
          <span className="text-sm text-gray-500">
            {court.reviewCount} reviews
          </span>
        </div>
        
        {court.amenities.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {court.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {court.amenities.length > 3 && (
                <span className="inline-block text-gray-500 text-xs px-2 py-1">
                  +{court.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const CourtCard = memo(CourtCardComponent);