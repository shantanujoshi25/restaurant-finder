export interface User {
    id?: number;
    username: string;
    email?: string;
    role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_BUSINESS_OWNER';
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    username: string;
    role: string;
    message: string;
  }
  
 
  export interface Category {
    id: number;
    name: string;
  }
  
  export interface Restaurant {
    id: number;
    name: string;
    address: string;
    email?: string;
    phone?: number;
    description?: string;
    hours: string;
    priceRange: 'LOW' | 'MEDIUM' | 'HIGH';
    categories: Category[];
    rating?: string;
    photoUrl?: string;
  }
  
  export interface RestaurantRequest {
    name: string;
    address: string;
    email?: string;
    phone?: number;
    description?: string;
    hours: string;
    priceRange: string;
    categoryIds: number[];
  }

  export interface Category {
    id: number;
    name: string;
  }
  
  export interface RestaurantResponse extends Restaurant {
    reviews?: Review[];
  }
  

  export interface Review {
    id: number;
    restaurantId: number;
    rating: number;
    comment: string;
    createdAt: string;
  }

  export interface ErrorResponse {
    message: string;
    error: string;
    status: number;
    timestamp: string;
  }

  export interface ReviewRequest {
    rating: number;
    comment: string;
  }
  
  export interface ReviewResponse extends Review {}
  
  // API Response Types
  export interface ApiError {
  message: string;
  error: string;
  status: number;
  timestamp: string;
}
  
  // Search Types
  export interface SearchParams {
    name?: string;
    categories?: string[];
    priceRange?: string;
    rating?: string;
    params?: string;  // Add this line
    sortBy?: string;
  }