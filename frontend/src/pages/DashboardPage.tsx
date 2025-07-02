import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  Timeline,
  TrendingUp,
  Person,
  History,
} from "@mui/icons-material";
import { useAuth } from "../contexts/auth.context";
import { usePersonalSettings } from "../hooks/usePersonalSettings";
import { useWorkoutProgress } from "../hooks/useWorkoutProgress";
import { useNutritionHistory } from "../hooks/useNutritionHistory";
import { TabPanel } from "../components/TabPanel";
import { ProgressTab } from "../components/Dashboard/ProgressTab";
import { ProfileTab } from "../components/Dashboard/ProfileTab";
import { PersonalSettings } from "../types/personal-settings.types";
import { WorkoutHistory } from "../types/history.types";
import { NutritionHistory } from "../types/history.types";
import { format } from "date-fns";
import { bg } from "date-fns/locale";

const DashboardPage = () => {
  const { user } = useAuth();
  const { settings, loading, error, save } = usePersonalSettings(user?.id || 0);
  const { progress, loading: loadingProgress } = useWorkoutProgress();
  const { foodHistory, loading: loadingNutrition } = useNutritionHistory();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveSettings = async (updatedSettings: PersonalSettings) => {
    if (user?.id) {
      await save(updatedSettings);
    }
  };

  if (loading || loadingProgress || loadingNutrition) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Вземи последните 5 тренировки и хранения
  const recentWorkouts = [...progress]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 5);
  const recentNutrition = [...foodHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Табло
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="dashboard tabs"
        >
          <Tab
            icon={<Person />}
            label="Профил"
            id="tab-0"
            aria-controls="tabpanel-0"
          />
          <Tab
            icon={<TrendingUp />}
            label="Прогрес"
            id="tab-1"
            aria-controls="tabpanel-1"
          />
          <Tab
            icon={<History />}
            label="История"
            id="tab-2"
            aria-controls="tabpanel-2"
          />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <ProfileTab
          settings={settings}
          loading={loading}
          onSave={handleSaveSettings}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <ProgressTab
          progress={{
            weightHistory: [],
            caloriesHistory: [],
            workoutsHistory: progress.reduce((acc, curr) => {
              const date = curr.completedAt.split("T")[0];
              const found = acc.find((item) => item.date === date);
              if (found) {
                found.count += 1;
              } else {
                acc.push({ date, count: 1 });
              }
              return acc;
            }, [] as { date: string; count: number }[]),
          }}
          loading={loadingProgress}
          onPeriodChange={() => {}}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <FitnessCenter sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Последни тренировки</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {recentWorkouts.map((workout) => (
                  <Box key={workout.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {workout.programId
                        ? `Програма #${workout.programId}`
                        : "Тренировка"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(workout.completedAt), "dd MMMM yyyy", {
                        locale: bg,
                      })}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} component="div">
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Restaurant sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">Хранителен дневник</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {recentNutrition.map((entry) => (
                  <Box key={entry.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {entry.foodIds.length} храни
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(entry.date), "dd MMMM yyyy", {
                        locale: bg,
                      })}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default DashboardPage;
