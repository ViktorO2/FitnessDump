export type PublicRoutes = '/' | '/login' | '/register';
export type ProtectedRoutes = '/app' | '/app/workouts' | '/app/nutrition' | '/app/profile';
export type AppRoutes = PublicRoutes | ProtectedRoutes;