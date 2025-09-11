import React, { useState } from 'react';
import type { Review } from '../types';
import { StarRating } from './ui/StarRating';
import { Button } from './ui/Button';
import { X } from 'lucide-react';

interface ReviewFormProps {
  courtId: string;
  onSubmit: (review: Partial<Review>) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ courtId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!userName.trim()) {
      newErrors.userName = 'Name is required';
    }
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Please write a review';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Review must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    const review: Partial<Review> = {
      courtId,
      rating,
      comment: comment.trim(),
      author: userName.trim(),
      date: new Date().toISOString(),
      helpful: 0
    };
    
    try {
      await onSubmit(review);
      setRating(0);
      setComment('');
      setUserName('');
      setErrors({});
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (errors.rating) {
      setErrors({ ...errors, rating: '' });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Write a Review</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close form"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (errors.userName) setErrors({ ...errors, userName: '' });
            }}
            className={`input ${errors.userName ? 'border-red-500' : ''}`}
            placeholder="Enter your name"
            disabled={isSubmitting}
          />
          {errors.userName && (
            <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
          )}
        </div>

        <div>
          <label className="label">Rating</label>
          <div className="flex items-center gap-4">
            <StarRating
              rating={rating}
              interactive
              onRatingChange={handleRatingClick}
              size="lg"
            />
            <span className="text-lg font-medium">
              {rating > 0 ? `${rating}/5` : 'Select rating'}
            </span>
          </div>
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        <div>
          <label className="label">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment) setErrors({ ...errors, comment: '' });
            }}
            className={`input min-h-[120px] resize-y ${errors.comment ? 'border-red-500' : ''}`}
            placeholder="Share your experience with this court..."
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between mt-1">
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {comment.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;