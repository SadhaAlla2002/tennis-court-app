export type { Court, TimeSlot, SortOption, SurfaceFilter } from './court';
export type { Review, NewReview, ReviewSortOption } from './review';

import type { SurfaceFilter } from './court';

export interface SearchFilters {
  surface: SurfaceFilter;
  minRating: number;
  maxPrice: number;
  lighting: boolean | null;
  amenities: string[];
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  hasMore: boolean;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}