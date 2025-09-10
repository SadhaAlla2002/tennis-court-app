export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  price: number;
}

export interface Court {
  id: string;
  name: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  surface: 'Hard' | 'Clay' | 'Grass' | 'Indoor';
  lighting: boolean;
  hourlyRate: number;
  amenities: string[];
  description: string;
  coordinates: { lat: number; lng: number };
  availability: TimeSlot[];
  phoneNumber: string;
  website?: string;
  features: {
    parking: boolean;
    restrooms: boolean;
    proShop: boolean;
    lessons: boolean;
    ballMachine: boolean;
    courtRental: boolean;
  };
}

export type SortOption = 'rating' | 'price' | 'name' | 'reviewCount';
export type SurfaceFilter = 'all' | Court['surface'];