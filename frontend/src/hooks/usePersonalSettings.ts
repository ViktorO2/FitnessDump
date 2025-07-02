import { useState, useEffect, useCallback } from "react";
import personalService from "../services/personal-service.service";
import { PersonalSettings, CalorieCalculatorRequestDTO, CalorieCalculatorResponseDTO } from "../types/personal-settings.types";
import { User } from "../types/auth.types";

export const usePersonalSettings = (userId: number | undefined) => {
  const [settings, setSettings] = useState<PersonalSettings | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    loadSettings();
    loadUser();
  }, [userId]);

  const loadSettings = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await personalService.getPersonalSettings(userId);
      setSettings(response);
      setError(null);
    } catch (err) {
      setError("Грешка при зареждане на настройките");
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    if (!userId) return;
    
    try {
      const userData = await personalService.getUser(userId);
      setUser(userData);
      setError(null);
    } catch (err) {
      setError("Грешка при зареждане на потребителя");
    }
  };

  const save = useCallback(async (data: PersonalSettings) => {
    if (!userId) throw new Error('Потребителят не е автентикиран');
    
    try {
      setLoading(true);
      await personalService.savePersonalSettings(data);
      await loadSettings();
      setError(null);
    } catch (err) {
      setError("Грешка при запазване на настройките");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const calculateSettings = useCallback(async (data: CalorieCalculatorRequestDTO): Promise<CalorieCalculatorResponseDTO | null> => {
    if (!userId) throw new Error('Потребителят не е автентикиран');
    
    try {
      setCalculating(true);
      const result = await personalService.calculatePersonalSettings(data);
      setError(null);
      return result;
    } catch (err) {
      setError("Грешка при изчисляване на настройките");
      throw err;
    } finally {
      setCalculating(false);
    }
  }, [userId]);

  const checkSettings = useCallback(async (userId: number) => {
    try {
      const hasSettings = await personalService.checkPersonalSettings(userId);
      return hasSettings;
    } catch (err) {
      return false;
    }
  }, []);

  const getPersonalSettingsById = useCallback(async (settingsId: number): Promise<PersonalSettings> => {
    try {
      const settings = await personalService.getPersonalSettingsById(settingsId);
      return settings;
    } catch (err) {
      throw new Error("Грешка при зареждане на настройките");
    }
  }, []);

  const updatePersonalSettingsById = useCallback(async (settingsId: number, data: PersonalSettings): Promise<void> => {
    try {
      await personalService.updatePersonalSettingsById(settingsId, data);
    } catch (err) {
      throw new Error("Грешка при обновяване на настройките");
    }
  }, []);

  return {
    settings,
    user,
    setSettings,
    loading,
    calculating,
    error,
    save,
    calculateSettings,
    checkSettings,
    loadSettings,
    loadUser,
    getPersonalSettingsById,
    updatePersonalSettingsById,
  };
}; 