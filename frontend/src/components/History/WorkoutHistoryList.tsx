import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { WorkoutHistory } from "../../types/history.types";

interface WorkoutHistoryListProps {
  workouts: WorkoutHistory[];
  loading: boolean;
}

export const WorkoutHistoryList: React.FC<WorkoutHistoryListProps> = ({
  workouts,
  loading,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (workouts.length === 0) {
    return (
      <Typography variant="body1" textAlign="center" p={3}>
        Няма намерени тренировки
      </Typography>
    );
  }

  const getDifficultyColor = (rating: number) => {
    if (rating <= 3) return "success";
    if (rating <= 4) return "warning";
    return "error";
  };

  return (
    <Grid container spacing={3}>
      {workouts.map((workout) => (
        <Grid xs={12} key={workout.id}>
          <Card
            sx={{
              "&:hover": {
                boxShadow: 3,
                transition: "box-shadow 0.3s ease-in-out",
              },
            }}
          >
            <CardHeader
              title={format(
                new Date(workout.completedAt),
                "dd MMMM yyyy HH:mm",
                { locale: bg }
              )}
              subheader={
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    label={`Програма: ${workout.programName || "Няма"}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={`Трудност: ${workout.difficultyRating}/5`}
                    size="small"
                    color={getDifficultyColor(workout.difficultyRating)}
                  />
                  {workout.completed && (
                    <Chip label="Завършена" size="small" color="success" />
                  )}
                </Box>
              }
            />
            <Divider />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Изпълнени серии: {workout.completedSets}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Изпълнени повторения: {workout.completedReps}
                  </Typography>
                  {workout.weightUsed > 0 && (
                    <Typography variant="subtitle2" gutterBottom>
                      Използвана тежест: {workout.weightUsed} кг
                    </Typography>
                  )}
                </Box>

                {workout.notes && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Бележки:
                    </Typography>
                    <Typography variant="body2">{workout.notes}</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
