import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Add your slideshow images here
  const images = [
    "https://media02.stockfood.com/largepreviews/NDE3OTY1NDY3/13482757-Christmas-evening-table-with-festive-food-and-sparkling-wine-glasses.jpg",
    "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative min-h-screen">
      {/* Slideshow Section */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Find Your Perfect Dining Experience
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl">
          Discover the best restaurants in your area, read reviews, and make reservations in just a few clicks.
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-white hover:bg-gray-100 text-rose-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Create Account
          </button>
        </div>

        <div className="mt-12 text-white/80">
          <p className="text-sm">
            Join thousands of food lovers who discover new restaurants every day
          </p>
        </div>
      </div>

      {/* Optional: Feature Highlights */}
      <div className="relative z-10 bg-white/95 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Local Gems
              </h3>
              <p className="text-gray-600">
                Find hidden culinary treasures in your neighborhood
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Read Reviews
              </h3>
              <p className="text-gray-600">
                Make informed decisions with genuine customer reviews
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Reservations
              </h3>
              <p className="text-gray-600">
                Book your table with just a few clicks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;