import React, { useRef, useCallback } from 'react';
import type { Court } from '../types';
import { CourtCard } from './courts/CourtCard';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { EmptyState } from './ui/EmptyState';
import { useVirtualScroll } from '../hooks/useVirtualScroll';

interface CourtGridProps {
  courts: Court[];
  loading?: boolean;
  onCourtClick?: (court: Court) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const CourtGrid: React.FC<CourtGridProps> = ({
  courts,
  loading = false,
  onCourtClick,
  onLoadMore,
  hasMore = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { visibleItems, totalHeight, offsetY } = useVirtualScroll(
    courts,
    { itemHeight: 320, containerHeight: window.innerHeight }
  );

  const lastCardObserver = useRef<IntersectionObserver | null>(null);
  const lastCardRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (lastCardObserver.current) lastCardObserver.current.disconnect();
    
    lastCardObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });
    
    if (node) lastCardObserver.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  if (loading && courts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!loading && courts.length === 0) {
    return (
      <EmptyState
        title="No courts found"
        description="Try adjusting your search filters or check back later"
        action={{
          label: "Clear filters",
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        style={{ minHeight: totalHeight }}
      >
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => {
            const court = item.item as Court;
            return (
              <div
                key={court.id}
                ref={index === visibleItems.length - 1 ? lastCardRef : null}
                className="animate-fade-in"
              >
                <CourtCard
                  court={court}
                  onClick={() => onCourtClick?.(court)}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {loading && courts.length > 0 && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default React.memo(CourtGrid);