import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  PersonalSettings,
  ActivityLevel,
} from "../../types/personal-settings.types";
import { format } from "date-fns";
import { bg } from "date-fns/locale";

interface ProfileTabProps {
  settings: PersonalSettings | null;
  loading: boolean;
  onSave: (settings: PersonalSettings) => Promise<void>;
}

// Функция за превод на ниво на активност
const getActivityLevelLabel = (activityLevel: ActivityLevel): string => {
  const activityLevelMap: Record<ActivityLevel, string> = {
    SEDENTARY: "Заседнал начин на живот",
    LIGHTLY_ACTIVE: "Лека активност",
    MODERATELY_ACTIVE: "Умерена активност",
    VERY_ACTIVE: "Висока активност",
    EXTRA_ACTIVE: "Много висока активност",
  };

  return activityLevelMap[activityLevel] || activityLevel;
};

// Функция за превод на цели
const getGoalLabel = (goal: string): string => {
  const goalMap: Record<string, string> = {
    LOSE_WEIGHT: "Отслабване",
    GAIN_WEIGHT: "Качване на мускулна маса и тегло",
    MAINTAIN_WEIGHT: "Поддържане",
  };

  return goalMap[goal] || goal;
};

export const ProfileTab = ({ settings, loading, onSave }: ProfileTabProps) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">
          Няма налична информация за профила
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Лична информация
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Възраст
              </Typography>
              <Typography>{settings.age} години</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Височина
              </Typography>
              <Typography>{settings.height} см</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Пол
              </Typography>
              <Typography>
                {settings.gender === "MALE" ? "Мъж" : "Жена"}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Ниво на активност
              </Typography>
              <Typography>
                {getActivityLevelLabel(settings.activityLevel)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Цели и прогрес
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Текущо тегло
              </Typography>
              <Typography>{settings.currentWeight} кг</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Целево тегло
              </Typography>
              <Typography>{settings.targetWeight} кг</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Дневни калории
              </Typography>
              <Typography>{settings.dailyCalories} ккал</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Цел
              </Typography>
              <Typography>{getGoalLabel(settings.goal)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
