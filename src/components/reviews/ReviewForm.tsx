import React, { useState } from 'react';
import type { NewReview } from '../../types';
import { Button, Input, StarRating } from '../ui';

interface ReviewFormProps {
  courtId: string;
  onSubmit: (review: NewReview) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  courtId,
  onSubmit,
  loading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 0,
    title: '',
    comment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.author.trim()) {
      newErrors.author = 'Name is required';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newReview: NewReview = {
      courtId,
      author: formData.author.trim(),
      rating: formData.rating,
      title: formData.title.trim(),
      comment: formData.comment.trim()
    };

    try {
      await onSubmit(newReview);
      
      // Reset form on success
      setFormData({
        author: '',
        rating: 0,
        title: '',
        comment: ''
      });
      setErrors({});
    } catch (error) {
      // Error handling is managed by parent component
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <Input
          label="Your Name"
          value={formData.author}
          onChange={(e) => handleInputChange('author', e.target.value)}
          error={errors.author}
          placeholder="Enter your name"
          maxLength={50}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <StarRating
          rating={formData.rating}
          interactive
          onRatingChange={handleRatingChange}
          size="lg"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">
            {errors.rating}
          </p>
        )}
      </div>

      <div>
        <Input
          label="Review Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          error={errors.title}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          value={formData.comment}
          onChange={(e) => handleInputChange('comment', e.target.value)}
          className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
            errors.comment ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
          }`}
          rows={4}
          placeholder="Share your experience with this court..."
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.comment && (
            <p className="text-sm text-red-600">
              {errors.comment}
            </p>
          )}
          <p className="text-xs text-gray-500 ml-auto">
            {formData.comment.length}/500
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        fullWidth
        className="mt-6"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};