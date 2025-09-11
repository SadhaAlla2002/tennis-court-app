import type { Court, Review, TimeSlot } from '../types';
// Local tennis court images
import court01 from '../assets/tennis-courts/court-01.jpg';
import court02 from '../assets/tennis-courts/court-02.jpg';
import court03 from '../assets/tennis-courts/court-03.jpg';
import court04 from '../assets/tennis-courts/court-04.jpg';
import court05 from '../assets/tennis-courts/court-05.jpg';
import court06 from '../assets/tennis-courts/court-06.jpg';
import court07 from '../assets/tennis-courts/court-07.jpg';
import court08 from '../assets/tennis-courts/court-08.jpg';

const courtImages = [
  court01,
  court02,
  court03,
  court04,
  court05,
  court06,
  court07,
  court08,
];

const nyBoroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
const courtTypes = ['Tennis Club', 'Sports Center', 'Recreation Center', 'Country Club', 'Community Center'];
const surfaces = ['Hard', 'Clay', 'Grass', 'Indoor'] as const;
const amenities = [
  'Pro Shop', 'Lessons Available', 'Equipment Rental', 'Parking', 'Restrooms', 
  'Cafe', 'Locker Rooms', 'Ball Machine', 'Court Lighting', 'Seating Area'
];

const firstNames = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Cameron',
  'Drew', 'Sage', 'Reese', 'Blake', 'Quinn', 'Skyler', 'Emery', 'Phoenix'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
];

function generateNYCCoordinates() {
  // NYC bounding box coordinates
  const minLat = 40.4774;
  const maxLat = 40.9176;
  const minLng = -74.2591;
  const maxLng = -73.7004;
  
  return {
    lat: Number((minLat + Math.random() * (maxLat - minLat)).toFixed(6)),
    lng: Number((minLng + Math.random() * (maxLng - minLng)).toFixed(6))
  };
}

function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const hours = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  hours.forEach(hour => {
    const [hourNum] = hour.split(':');
    const endHour = String(Number(hourNum) + 1).padStart(2, '0');
    
    slots.push({
      start: hour,
      end: `${endHour}:00`,
      available: Math.random() > 0.3,
      price: Math.floor(Math.random() * 30) + 40
    });
  });
  
  return slots;
}

function generateCourtDescription(surface: typeof surfaces[number], borough: string): string {
  const descriptions = {
    Hard: `Professional hard court facility located in ${borough}. Well-maintained surface perfect for competitive play and training.`,
    Clay: `Traditional clay court offering authentic tennis experience. Located in scenic ${borough} with excellent drainage system.`,
    Grass: `Premium grass courts providing classic tennis atmosphere. Beautifully maintained facility in ${borough}.`,
    Indoor: `Climate-controlled indoor facility in ${borough}. Perfect for year-round play regardless of weather conditions.`
  };
  
  return descriptions[surface];
}

export function generateMockCourts(): Court[] {
  return Array.from({ length: 76 }, (_, i) => {
    const borough = nyBoroughs[i % nyBoroughs.length];
    const courtType = courtTypes[Math.floor(Math.random() * courtTypes.length)];
    const surface = surfaces[i % surfaces.length];
    const selectedAmenities = amenities
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 3);
    
    return {
      id: `court-${String(i + 1).padStart(3, '0')}`,
      name: `${borough} ${courtType} ${i + 1}`,
      location: borough,
      address: `${100 + i} Tennis Avenue, ${borough}, NY ${10001 + i}`,
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 300) + 10,
      imageUrl: courtImages[i % courtImages.length],
      surface,
      lighting: Math.random() > 0.2,
      hourlyRate: Math.floor(Math.random() * 60) + 25,
      amenities: selectedAmenities,
      description: generateCourtDescription(surface, borough),
      coordinates: generateNYCCoordinates(),
      availability: generateTimeSlots(),
      phoneNumber: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: Math.random() > 0.3 ? `https://${borough.toLowerCase()}tennis${i}.com` : undefined,
      features: {
        parking: Math.random() > 0.2,
        restrooms: Math.random() > 0.1,
        proShop: Math.random() > 0.4,
        lessons: Math.random() > 0.3,
        ballMachine: Math.random() > 0.6,
        courtRental: Math.random() > 0.1
      }
    };
  });
}

export function generateMockReviews(courts: Court[]): Review[] {
  const reviews: Review[] = [];
  const reviewTitles = [
    'Great court experience!',
    'Well-maintained facility',
    'Perfect for weekend play',
    'Excellent surface quality',
    'Good value for money',
    'Professional facility',
    'Clean and organized',
    'Friendly staff',
    'Could use some improvements',
    'Solid choice for tennis'
  ];
  
  const reviewComments = [
    'Really enjoyed playing here. The surface was in excellent condition and the facilities were clean.',
    'Great court with good lighting. Staff was helpful and the booking process was smooth.',
    'The court surface could use some work, but overall a decent place to play tennis.',
    'Excellent facilities with all the amenities you need. Will definitely come back!',
    'Good location and easy to get to. The court was well-maintained and ready for play.',
    'Professional setup with quality equipment. The hourly rate is reasonable for the area.',
    'Nice facility but can get crowded during peak hours. Book in advance!',
    'Clean courts and good customer service. The amenities are a nice bonus.',
    'Solid tennis facility. Nothing fancy but gets the job done well.',
    'Great place for both casual and competitive play. Highly recommend!'
  ];
  
  courts.forEach(court => {
    const numReviews = Math.floor(Math.random() * 8) + 2; // 2-10 reviews per court
    
    for (let i = 0; i < numReviews; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const daysAgo = Math.floor(Math.random() * 365) + 1;
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - daysAgo);
      
      reviews.push({
        id: `review-${court.id}-${i}`,
        courtId: court.id,
        author: `${firstName} ${lastName[0]}.`,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 star reviews mostly
        title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
        comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
        date: reviewDate.toISOString(),
        helpful: Math.floor(Math.random() * 15),
        verified: Math.random() > 0.2
      });
    }
  });
  
  return reviews;
}
