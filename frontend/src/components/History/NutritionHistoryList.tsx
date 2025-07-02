import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import { bg } from "date-fns/locale";
import { NutritionHistory } from "../../types/history.types";

interface NutritionHistoryListProps {
  nutrition: NutritionHistory[];
  loading: boolean;
}

export const NutritionHistoryList: React.FC<NutritionHistoryListProps> = ({
  nutrition,
  loading,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (nutrition.length === 0) {
    return (
      <Typography variant="body1" textAlign="center" p={3}>
        Няма намерени хранения
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {nutrition.map((day) => (
        <Grid size={{ xs: 12 }} key={day.id}>
          <Card>
            <CardHeader
              title={format(day.date, "dd MMMM yyyy", { locale: bg })}
              subheader={`Общо калории: ${day.totalCalories} ккал`}
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Хранителни стойности:
                  </Typography>
                  <Typography variant="body2">
                    Протеини: {day.macros.protein}г
                  </Typography>
                  <Typography variant="body2">
                    Въглехидрати: {day.macros.carbs}г
                  </Typography>
                  <Typography variant="body2">
                    Мазнини: {day.macros.fats}г
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Хранения:
                  </Typography>
                  {day.meals.map((meal, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {meal.name}:
                      </Typography>
                      {meal.foods.map((food, foodIndex) => (
                        <Typography
                          key={foodIndex}
                          variant="body2"
                          sx={{ ml: 2 }}
                        >
                          • {food.name} - {food.amount} ({food.calories} ккал)
                        </Typography>
                      ))}
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
