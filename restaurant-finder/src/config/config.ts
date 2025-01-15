interface ApiEndpoints {
  readonly AUTH: {
    readonly LOGIN: string;
    readonly REGISTER: string;
    readonly VALIDATE: string;
    readonly LOGOUT: string;
  };
  readonly RESTAURANTS: {
    readonly BASE: string;
    readonly GET_BY_ID: (id: number) => string;
    readonly REGISTER: string;
    readonly UPDATE: (id: number) => string;
    readonly GET_REVIEWS: (id: number) => string;
    readonly ADD_REVIEW: (id: number) => string;
    readonly GET_CATEGORIES: string;
  };
}

interface Config {
  readonly API_BASE_URL: string;
  readonly API_ENDPOINTS: ApiEndpoints;
}

const config: Config = {
  API_BASE_URL: 'http://restaurant-finder-alb-522031075.us-east-2.elb.amazonaws.com',
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VALIDATE: '/auth/validate',
      LOGOUT: '/auth/logout'
    },
    RESTAURANTS: {
      BASE: '/api/v1/restaurants',
      GET_BY_ID: (id: number) => `/api/v1/restaurants/${id}`,
      REGISTER: '/api/v1/restaurants/register',
      UPDATE: (id: number) => `/api/v1/restaurants/update/${id}`,
      GET_REVIEWS: (id: number) => `/api/v1/restaurants/${id}/reviews`,
      ADD_REVIEW: (id: number) => `/api/v1/restaurants/${id}/reviews`,
      GET_CATEGORIES: '/api/v1/restaurants/categories'
    }
  }
} as const;

export default config;