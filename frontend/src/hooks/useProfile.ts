import { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../contexts/auth.context";
import personalService from "../services/personal-service.service";
import { User } from "../types/auth.types";

export const useProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await personalService.getUser(user.id);
      setProfileData(data);
      setError(null);
    } catch (err) {
      setError('Грешка при зареждане на профила');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const profileInfo = {
    firstName: profileData?.firstName || user?.firstName,
    lastName: profileData?.lastName || user?.lastName,
    email: profileData?.email || user?.email,
    username: profileData?.username || user?.username,
  };

  return {
    profileInfo,
    profileData,
    loading,
    error,
    fetchProfile,
  };
};