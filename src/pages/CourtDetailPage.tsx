import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Globe, 
  Zap, 
  Car, 
  Users, 
  ShoppingBag,
  GraduationCap,
  Bot,
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageCircle
} from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { StarRating, Button, Card, EmptyState } from '../components/ui';
import { ReviewList } from '../components/reviews/ReviewList';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { useCourts, useReviews } from '../context';
import type { NewReview } from '../types';

interface CourtDetailPageProps {
  courtId: string;
  onBackClick: () => void;
}

export const CourtDetailPage: React.FC<CourtDetailPageProps> = ({
  courtId,
  onBackClick
}) => {
  const { getCourtById } = useCourts();
  const { getCourtReviews, addCourtReview, state: reviewState } = useReviews();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const court = getCourtById(courtId);
  const reviews = getCourtReviews(courtId);

  if (!court) {
    return (
      <Layout
        title="Court Not Found"
        showBackButton
        onBackClick={onBackClick}
      >
        <EmptyState
          title="Court not found"
          description="The court you're looking for doesn't exist or may have been removed."
          action={{
            label: "Back to Courts",
            onClick: onBackClick
          }}
        />
      </Layout>
    );
  }

  const handleReviewSubmit = async (newReview: NewReview) => {
    await addCourtReview(newReview);
    setShowReviewForm(false);
  };

  const featureIcons = {
    parking: <Car className="h-5 w-5" />,
    restrooms: <Users className="h-5 w-5" />,
    proShop: <ShoppingBag className="h-5 w-5" />,
    lessons: <GraduationCap className="h-5 w-5" />,
    ballMachine: <Bot className="h-5 w-5" />,
    courtRental: <Calendar className="h-5 w-5" />
  };

  const featureLabels = {
    parking: 'Parking Available',
    restrooms: 'Restrooms',
    proShop: 'Pro Shop',
    lessons: 'Lessons Available',
    ballMachine: 'Ball Machine',
    courtRental: 'Court Rental'
  };

  const surfaceColors = {
    Hard: 'bg-blue-100 text-blue-800',
    Clay: 'bg-orange-100 text-orange-800',
    Grass: 'bg-green-100 text-green-800',
    Indoor: 'bg-gray-100 text-gray-800'
  };

  const displayedAmenities = showAllAmenities 
    ? court.amenities 
    : court.amenities.slice(0, 6);

  return (
    <Layout
      title={court.name}
      showBackButton
      onBackClick={onBackClick}
    >
      <div className="space-y-6">
        {/* Hero Image */}
        <div className="relative">
          <img
            src={court.imageUrl}
            alt={court.name}
            className="w-full h-64 sm:h-80 object-cover rounded-lg"
          />
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-2">
            <span className="text-lg font-semibold text-gray-900">
              ${court.hourlyRate}/hr
            </span>
          </div>
        </div>

        {/* Court Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {court.name}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{court.address}</span>
                  </div>
                </div>
                <StarRating rating={court.rating} size="lg" />
              </div>

              <p className="text-gray-700 mb-6">
                {court.description}
              </p>

              {/* Court Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${surfaceColors[court.surface]}`}>
                    {court.surface} Court
                  </span>
                </div>
                
                {court.lighting && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Zap className="h-4 w-4 mr-2" />
                    <span>Lighted</span>
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  <span className="font-medium">{reviews.length}</span> reviews
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(court.features).map(([feature, available]) => {
                    if (!available) return null;
                    return (
                      <div key={feature} className="flex items-center text-sm text-gray-600">
                        {featureIcons[feature as keyof typeof featureIcons]}
                        <span className="ml-2">{featureLabels[feature as keyof typeof featureLabels]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Amenities */}
              {court.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {displayedAmenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {court.amenities.length > 6 && (
                      <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="inline-flex items-center text-blue-600 text-sm px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        {showAllAmenities ? (
                          <>
                            Show Less <ChevronUp className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            +{court.amenities.length - 6} More <ChevronDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Reviews Section */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  size="sm"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Share Your Experience
                  </h3>
                  <ReviewForm
                    courtId={court.id}
                    onSubmit={handleReviewSubmit}
                    loading={reviewState.loading}
                  />
                </div>
              )}

              {/* Reviews List */}
              <ReviewList reviews={reviews} />
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-4">
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <a
                    href={`tel:${court.phoneNumber}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {court.phoneNumber}
                  </a>
                </div>
                
                {court.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <a
                      href={court.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">
                    {court.address}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card padding="lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Court</h3>
              <Button fullWidth size="lg" className="mb-3">
                <Calendar className="h-5 w-5 mr-2" />
                Check Availability
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Booking functionality coming soon
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};