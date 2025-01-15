import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { Restaurant, Review, ReviewRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';


interface ReviewFormData extends ReviewRequest {
  rating: number;
  comment: string;
}

const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [restaurantData, reviewsData] = await Promise.all([
          restaurantService.getRestaurant(parseInt(id)),
          restaurantService.getRestaurantReviews(parseInt(id))
        ]);

        setRestaurant(restaurantData);
        setReviews(reviewsData);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to fetch restaurant details';
        toast.error(errorMessage);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id, navigate]);

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id || !isAuthenticated) return;

    try {
      setSubmittingReview(true);
      const newReview = await restaurantService.addReview(
        parseInt(id),
        reviewForm
      );

      setReviews(prevReviews => [...prevReviews, newReview]);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Restaurant not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
  onClick={() => navigate(-1)}
  className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-5 w-5 mr-2" 
    viewBox="0 0 20 20" 
    fill="currentColor"
  >
    <path 
      fillRule="evenodd" 
      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
      clipRule="evenodd" 
    />
  </svg>
  Back to Restaurants
</button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {restaurant.photoUrl && (
            <div className="h-64 w-full">
              <img
                src={restaurant.photoUrl}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`h-5 w-5 ${
                      index < (parseFloat(restaurant.rating || '0'))
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">
                  ({reviews.length} reviews)
                </span>
              </div>
              
              <div className="ml-6 flex items-center">
                <span className="text-gray-600">
                  {restaurant.priceRange === 'LOW' ? '$' : 
                   restaurant.priceRange === 'MEDIUM' ? '$$' : '$$$'}
                </span>
                <span className="mx-2">•</span>
                {restaurant.categories.map(cat => cat.name).join(', ')}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">{restaurant.description}</p>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-600">{restaurant.address}</p>
                {restaurant.phone && (
                  <p className="text-gray-600">{restaurant.phone}</p>
                )}
                {restaurant.email && (
                  <p className="text-gray-600">{restaurant.email}</p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Hours</h3>
                <p className="text-gray-600">{restaurant.hours}</p>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>


          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className={`p-1 ${
                        reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                    >
                      <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Share your experience..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  submittingReview
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
              <p className="text-gray-600">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-500"
                >
                  sign in
                </button>
                {' '}to leave a review.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-600 text-center py-6">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`h-5 w-5 ${
                            index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;