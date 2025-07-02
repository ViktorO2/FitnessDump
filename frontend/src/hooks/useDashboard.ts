import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth.context';
import dashboardService from '../services/dashboard.service';

export const useDashboard = (period: 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const [profile, stats, progress, activities, nutrition] = await Promise.all([
        dashboardService.getProfile(),
        dashboardService.getUserStats(user.id),
        dashboardService.getProgressData(user.id, period),
        dashboardService.getRecentActivities(user.id),
        dashboardService.getNutritionSummary(user.id, new Date().toISOString().split('T')[0])
      ]);

      setDashboardData({
        profile,
        stats,
        progress,
        activities,
        nutrition
      });
    } catch (error) {
      setError('Грешка при зареждане на данните');
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = async (newPeriod: 'week' | 'month' | 'year') => {
    if (!user?.id) return;
    
    try {
      const progress = await dashboardService.getProgressData(user.id, newPeriod);
      setDashboardData((prev: any) => prev ? { ...prev, progress } : { progress });
    } catch (error) {
      setError('Грешка при зареждане на прогреса');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id, period]);

  return {
    dashboardData,
    loading,
    error,
    refreshProgress
  };
};
