import React from 'react';
import { Link } from 'react-router-dom';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`h-5 w-5 ${
              index < numRating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">
          {restaurant.rating ? `${restaurant.rating} / 5` : 'No ratings yet'}
        </span>
      </div>
    );
  };

  const formatPhoneNumber = (phone?: number): string => {
    if (!phone) return 'N/A';
    const phoneStr = phone.toString();
    if (phoneStr.length === 10) {
      return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
    }
    return phoneStr;
  };

  const renderPriceRange = (priceRange: string): string => {
    switch (priceRange) {
      case 'LOW':
        return '$';
      case 'MEDIUM':
        return '$$';
      case 'HIGH':
        return '$$$';
      default:
        return 'N/A';
    }
  };

  const formatHours = (hoursString: string) => {
    const timeSlots = hoursString.split(',').map(slot => slot.trim());
    return (
      <div className="flex flex-col space-y-1">
        {timeSlots.map((slot, index) => {
          // Handle "Closed" cases
          if (slot.toLowerCase().includes('closed')) {
            return (
              <div key={index} className="flex items-center text-sm">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mr-2"></span>
                <span>{slot}</span>
              </div>
            );
          }
          return (
            <div key={index} className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
              <span>{slot}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="block w-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        {restaurant.photoUrl && (
          <div className="relative h-48 w-full flex-shrink-0">
            <img
              src={restaurant.photoUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {restaurant.name}
            </h3>
            <span className="text-gray-600 font-medium">
              {renderPriceRange(restaurant.priceRange)}
            </span>
          </div>

          <div className="mb-4">{renderStars(restaurant.rating || '0')}</div>

          {restaurant.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.categories.map(category => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="flex-grow">{restaurant.address}</span>
            </div>

            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-3 flex-shrink-0 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {formatPhoneNumber(restaurant.phone)}
            </div>

            <div className="flex items-start">
              <svg
                className="h-5 w-5 mr-3 mt-1 flex-shrink-0 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {restaurant.hours && formatHours(restaurant.hours)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;