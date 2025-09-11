import React from 'react';
import type { Court } from '../../types';
import { CourtCard } from './CourtCard';
import { LoadingSkeleton, EmptyState } from '../ui';
import { Search } from 'lucide-react';

interface CourtGridProps {
  courts: Court[];
  onCourtClick: (courtId: string) => void;
  loading?: boolean;
  className?: string;
}

const SkeletonGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
        <LoadingSkeleton className="h-48 rounded-lg mb-4" />
        <LoadingSkeleton lines={3} />
      </div>
    ))}
  </div>
);

export const CourtGrid: React.FC<CourtGridProps> = ({
  courts,
  onCourtClick,
  loading = false,
  className = ''
}) => {
  if (loading) {
    return <SkeletonGrid />;
  }

  if (courts.length === 0) {
    return (
      <EmptyState
        icon={<Search />}
        title="No courts found"
        description="Try adjusting your search criteria or filters to find courts in your area."
        className={className}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {courts.map((court) => (
        <CourtCard
          key={court.id}
          court={court}
          onClick={onCourtClick}
        />
      ))}
    </div>
  );
};