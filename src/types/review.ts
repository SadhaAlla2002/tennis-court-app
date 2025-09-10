export interface Review {
  id: string;
  courtId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

export interface NewReview {
  courtId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
}

export type ReviewSortOption = 'date' | 'rating' | 'helpful';