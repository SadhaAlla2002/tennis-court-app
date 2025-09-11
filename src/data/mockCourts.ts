import { generateMockCourts } from './generators';

export const mockCourts = generateMockCourts();

export const getCourtById = (id: string) => 
  mockCourts.find(court => court.id === id);

export const searchCourts = (query: string) => 
  mockCourts.filter(court =>
    court.name.toLowerCase().includes(query.toLowerCase()) ||
    court.location.toLowerCase().includes(query.toLowerCase()) ||
    court.amenities.some(amenity => 
      amenity.toLowerCase().includes(query.toLowerCase())
    )
  );

export const filterCourts = (courts = mockCourts, filters: {
  surface?: string;
  minRating?: number;
  maxPrice?: number;
  lighting?: boolean;
  amenities?: string[];
}) => {
  return courts.filter(court => {
    if (filters.surface && filters.surface !== 'all' && court.surface !== filters.surface) {
      return false;
    }
    if (filters.minRating && court.rating < filters.minRating) {
      return false;
    }
    if (filters.maxPrice && court.hourlyRate > filters.maxPrice) {
      return false;
    }
    if (filters.lighting !== undefined && court.lighting !== filters.lighting) {
      return false;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        court.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }
    return true;
  });
};

export const sortCourts = (courts = mockCourts, sortBy: 'rating' | 'price' | 'name' | 'reviewCount' = 'rating') => {
  return [...courts].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price':
        return a.hourlyRate - b.hourlyRate;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'reviewCount':
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });
};