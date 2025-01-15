import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/api';
import { Restaurant, SearchParams } from '../types';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchAttempted, setSearchAttempted] = useState<boolean>(false);
  const [searchCriteria, setSearchCriteria] = useState<string>('');
  const [showingBackupResults, setShowingBackupResults] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const fetchRestaurants = async (searchParams?: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      
      const queryParams: Record<string, string | string[]> = {};
      
      if (searchParams?.name) {
        queryParams.name = searchParams.name;
      }
      
      if (searchParams?.categories && searchParams.categories.length > 0) {
        queryParams.categories = searchParams.categories;
      }
      
      if (searchParams?.priceRange) {
        queryParams.priceRange = searchParams.priceRange;
      }
      
      if (searchParams?.rating) {
        queryParams.rating = searchParams.rating;
      }
      
      
      const data = await restaurantService.searchRestaurants(queryParams);
      setRestaurants(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch restaurants';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-rose-600 text-lg">
              {error}
            </p>
            <button
              onClick={() => fetchRestaurants()}
              className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-gradient-to-r from-rose-500/90 to-rose-400/90 py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Your Next Favorite Restaurant
            </h1>
            <p className="text-lg text-white/90">
              Discover the best restaurants in your area
            </p>
          </div>

          <div className="mt-8 bg-white/95 rounded-lg shadow-md p-4 max-w-3xl mx-auto">
            <SearchBar onSearch={fetchRestaurants} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
          </div>
        ) : (
          <>
            {searchAttempted && searchCriteria && showingBackupResults && (
              <div className="bg-white border-l-4 border-amber-400 p-4 mb-6 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      No results found for "{searchCriteria}". Showing all restaurants instead.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {restaurants.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 text-lg">
                  No restaurants found. Please try different search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;