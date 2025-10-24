// Constants for the application

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  ORDERS: '/orders',
  PROFILE: '/profile',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};
