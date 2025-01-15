import api, { handleApiResponse } from '../interceptors/axios';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RestaurantRequest,
  RestaurantResponse,
  ReviewRequest,
  ReviewResponse,
  Category,
  SearchParams,

} from '../types';
import config from '../config/config';


export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return handleApiResponse(
      api.post<AuthResponse>(config.API_ENDPOINTS.AUTH.LOGIN, credentials)
    );
  },


  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return handleApiResponse(
      api.post<AuthResponse>(config.API_ENDPOINTS.AUTH.REGISTER, userData)
    );
  },


  validateToken: async (): Promise<AuthResponse> => {
    return handleApiResponse(
      api.get<AuthResponse>(config.API_ENDPOINTS.AUTH.VALIDATE)
    );
  },


  logout: async (): Promise<void> => {
    return handleApiResponse(
      api.post<void>(config.API_ENDPOINTS.AUTH.LOGOUT)
    );
  }
};


export const restaurantService = {
  searchRestaurants: async (params?: Record<string, string | string[]>): Promise<RestaurantResponse[]> => {
    return handleApiResponse(
      api.get<RestaurantResponse[]>(config.API_ENDPOINTS.RESTAURANTS.BASE, { 
        params,
        paramsSerializer: params => {
          const searchParams = new URLSearchParams();
          
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, value);
            }
          });
          
          return searchParams.toString();
        }
      })
    );
  },


  getRestaurant: async (id: number): Promise<RestaurantResponse> => {
    return handleApiResponse(
      api.get<RestaurantResponse>(config.API_ENDPOINTS.RESTAURANTS.GET_BY_ID(id))
    );
  },


  createRestaurant: async (data: RestaurantRequest): Promise<RestaurantResponse> => {
    return handleApiResponse(
      api.post<RestaurantResponse>(config.API_ENDPOINTS.RESTAURANTS.REGISTER, data)
    );
  },


  updateRestaurant: async (id: number, data: RestaurantRequest): Promise<RestaurantResponse> => {
    return handleApiResponse(
      api.put<RestaurantResponse>(config.API_ENDPOINTS.RESTAURANTS.UPDATE(id), data)
    );
  },


  getRestaurantReviews: async (id: number): Promise<ReviewResponse[]> => {
    return handleApiResponse(
      api.get<ReviewResponse[]>(config.API_ENDPOINTS.RESTAURANTS.GET_REVIEWS(id))
    );
  },

  getCategories: async (): Promise<Category[]> => {
    return handleApiResponse(
      api.get<Category[]>(config.API_ENDPOINTS.RESTAURANTS.GET_CATEGORIES)
    );
  },


  addReview: async (restaurantId: number, review: ReviewRequest): Promise<ReviewResponse> => {
    return handleApiResponse(
      api.post<ReviewResponse>(config.API_ENDPOINTS.RESTAURANTS.ADD_REVIEW(restaurantId), review)
    );
  }
};




export const storageService = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },


  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },


  removeToken: (): void => {
    localStorage.removeItem('token');
  },


  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) as AuthResponse : null;
  },


  setUser: (user: AuthResponse): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },


  removeUser: (): void => {
    localStorage.removeItem('user');
  },


  clearAll: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};




export const handleError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

