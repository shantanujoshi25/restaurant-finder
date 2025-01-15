import React, { useState, useCallback, useEffect } from 'react';
import { SearchParams, Category } from '../types';
import debounce from 'lodash/debounce';
import { restaurantService } from '../services/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  initialFilters?: SearchParams;
}

const PriceRangeOptions = [
  { value: '', label: 'Any Price' },
  { value: 'LOW', label: '$' },
  { value: 'MEDIUM', label: '$$' },
  { value: 'HIGH', label: '$$$' }
];

const RatingOptions = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' },
  { value: '2', label: '2+ Stars' }
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState<SearchParams>({
    name: '',
    categories: [],
    priceRange: '',
    rating: '',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await restaurantService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const debouncedSearch = useCallback(
    debounce((params: SearchParams) => {
      onSearch(params);
    }, 300),
    [onSearch]
);

const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  const newFilters = { ...filters, [name]: value };
  setFilters(newFilters);

  if (name === 'name') {
    debouncedSearch(newFilters);
  } else {
    onSearch(newFilters);
  }
};

// Replace handleCategoryChange with handleCategorySelect
const handleCategorySelect = (categoryName: string) => {
  const newCategories = [...(filters.categories || []), categoryName];
  const newFilters = { ...filters, categories: newCategories };
  setFilters(newFilters);
  onSearch(newFilters);
};

const handleRemoveFilter = (type: string, value?: string) => {
  let newFilters = { ...filters };

  switch (type) {
    case 'categories':
      if (value) {
        newFilters.categories = filters.categories?.filter(cat => cat !== value) || [];
      }
      break;
    case 'priceRange':
      newFilters.priceRange = '';
      break;
    case 'rating':
      newFilters.rating = '';
      break;
  }

  setFilters(newFilters);
  onSearch(newFilters);
};

const handleReset = () => {
  const resetFilters: SearchParams = {
    name: '',
    categories: [],
    priceRange: '',
    rating: ''
  };
  setFilters(resetFilters);
  onSearch(resetFilters);
};

const hasActiveFilters = filters.categories?.length || filters.priceRange || filters.rating;

const handleRemoveCategory = (categoryToRemove: string) => {
  const newCategories = filters.categories?.filter(cat => cat !== categoryToRemove) || [];
  const newFilters = { ...filters, categories: newCategories };
  setFilters(newFilters);
  onSearch(newFilters);
};

// Get available categories (not yet selected)
const availableCategories = categories.filter(
  category => !filters.categories?.includes(category.name)
);

return (
  <div className="bg-white rounded-lg shadow-md p-6">
    {/* Search Input */}
    <div className="relative mb-4">
      <input
        type="text"
        name="name"
        value={filters.name}
        onChange={handleInputChange}
        placeholder="Search restaurants..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    {/* Selected Categories Tags */}
    {filters.categories && filters.categories.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.categories.map(category => (
          <span
            key={category}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-rose-100 text-rose-800"
          >
            {category}
            <button
              onClick={() => handleRemoveCategory(category)}
              className="ml-2 text-rose-600 hover:text-rose-800"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    )}

    {/* Filters Section */}
    <div
  className={`flex flex-row items-start gap-4 transition-all duration-200 ${
    isExpanded ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
  }`}
>
  {/* Categories Dropdown */}
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Categories
    </label>
    <select
      name="categories"
      onChange={(e) => handleCategorySelect(e.target.value)}
      value=""
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
      disabled={loading || availableCategories.length === 0}
    >
      <option value="" disabled>
        {availableCategories.length === 0 
          ? "No more categories available" 
          : "Select a category"}
      </option>
      {availableCategories.map(category => (
        <option key={category.id} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  </div>

  {/* Price Range Dropdown */}
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Price Range
    </label>
    <select
      name="priceRange"
      value={filters.priceRange}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
    >
      {PriceRangeOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>

  {/* Rating Dropdown */}
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Rating
    </label>
    <select
      name="rating"
      value={filters.rating}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500"
    >
      {RatingOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
    </div>
  </div>
);
};

export default SearchBar;