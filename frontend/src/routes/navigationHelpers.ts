import { NavigateFunction } from 'react-router-dom';

// Дефиниране на всички възможни пътища 
export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/login',
    REGISTER: '/register',
  },
  APP: {
    ROOT: '/app',
    DASHBOARD: '/app/home',
    WORKOUTS: '/app/workouts',
    NUTRITION: '/app/nutrition',
    PROFILE: '/app/profile',
    SETTINGS: '/app/settings',
    PERSONAL_SETTINGS: '/app/personal-settings',
    HISTORY: '/app/history',
  },
} as const;

// Типове за различните видове пътища
type PublicRouteKeys = keyof typeof ROUTES.PUBLIC;
type AppRouteKeys = keyof typeof ROUTES.APP;

// Помощни функции за навигация
export const navigateToPublicRoute = (
  navigate: NavigateFunction,
  route: PublicRouteKeys,
  options?: { replace?: boolean }
) => {
  navigate(ROUTES.PUBLIC[route], { replace: options?.replace });
};

export const navigateToAppRoute = (
  navigate: NavigateFunction,
  route: AppRouteKeys,
  options?: { 
    replace?: boolean;
    state?: any;
  }
) => {
  navigate(ROUTES.APP[route], { 
    replace: options?.replace,
    state: options?.state 
  });
};

export const isPublicRoute = (pathname: string): boolean => {
  return Object.values(ROUTES.PUBLIC).includes(pathname as any);
};

export const isAppRoute = (pathname: string): boolean => {
  return pathname.startsWith(ROUTES.APP.ROOT);
};

// Функция за извличане на предишния път
export const getPreviousRoute = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  segments.pop();
  return segments.length ? `/${segments.join('/')}` : '/';
};

// Помощна функция за създаване на URL с параметри
export const createUrlWithParams = (
  baseUrl: string,
  params: Record<string, string | number>
): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return `${baseUrl}?${searchParams.toString()}`;
};
