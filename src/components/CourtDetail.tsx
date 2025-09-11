import React, { useState } from 'react';
import type { Court, Review, TimeSlot } from '../types';
import { StarRating } from './ui/StarRating';
import { Button } from './ui/Button';
import { MapPin, Clock, DollarSign, Users, Phone, Globe } from 'lucide-react';

interface CourtDetailProps {
  court: Court;
  reviews: Review[];
  onBooking?: (timeSlot: TimeSlot) => void;
}

const CourtDetail: React.FC<CourtDetailProps> = ({
  court,
  reviews,
  onBooking
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const availableSlots = court.availability || [];

  const amenityIcons: Record<string, string> = {
    'Lights': '💡',
    'Parking': '🚗',
    'Restrooms': '🚻',
    'Pro Shop': '🏪',
    'Water Fountain': '💧',
    'Seating': '🪑',
    'Locker Rooms': '🔒',
    'Wheelchair Access': '♿'
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 sm:h-96">
          <img
            src={court.imageUrl}
            alt={court.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{court.name}</h1>
            <div className="flex items-center gap-4">
              <StarRating rating={court.rating} size="md" />
              <span className="text-sm opacity-90">{reviews.length} reviews</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About this Court</h2>
                <p className="text-gray-600 mb-4">{court.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={20} />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{court.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-blue-600" size={20} />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-sm text-gray-600">${court.hourlyRate}/hour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={20} />
                    <div>
                      <p className="font-medium">Surface</p>
                      <p className="text-sm text-gray-600">{court.surface}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-600" size={20} />
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-sm text-gray-600">
                        {court.surface} Court
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {court.amenities.map(amenity => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
                    >
                      <span>{amenityIcons[amenity] || '✓'}</span>
                      <span className="text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {court.phoneNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="text-gray-400" size={18} />
                      <a href={`tel:${court.phoneNumber}`} className="text-blue-600 hover:underline">
                        {court.phoneNumber}
                      </a>
                    </div>
                  )}
                  {court.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="text-gray-400" size={18} />
                      <a
                        href={court.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Book a Court</h3>
                  
                  <div className="mb-4">
                    <label className="label">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableSlots.length > 0 ? (
                      availableSlots.slice(0, 8).map((slot) => (
                        <div
                          key={`${slot.start}-${slot.end}`}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                        >
                          <div>
                            <p className="font-medium">
                              {slot.start} - {slot.end}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${slot.price}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => onBooking?.(slot)}
                          >
                            Book
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No available slots for this date
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Court Fee</span>
                      <span className="font-medium">${court.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Booking Fee</span>
                      <span className="font-medium">$2.50</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-xl">
                        ${(court.hourlyRate + 2.50).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CourtDetail);