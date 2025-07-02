import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookIcon from "@mui/icons-material/Book";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ListAltIcon from "@mui/icons-material/ListAlt";

const NutritionPage = () => {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Хранене
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate("/recipes")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <BookIcon sx={{ fontSize: 48, mb: 1 }} color="primary" />
                <Typography variant="h6">Рецепти</Typography>
                <Typography color="text.secondary" align="center">
                  Преглед, търсене и добавяне на рецепти с калории и макроси
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate("/meal-plans")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CalendarTodayIcon
                  sx={{ fontSize: 48, mb: 1 }}
                  color="primary"
                />
                <Typography variant="h6">Хранителни планове</Typography>
                <Typography color="text.secondary" align="center">
                  Създаване и управление на персонализирани хранителни планове
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardActionArea onClick={() => navigate("/food-diary")}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <ListAltIcon sx={{ fontSize: 48, mb: 1 }} color="primary" />
                <Typography variant="h6">Дневник на храненето</Typography>
                <Typography color="text.secondary" align="center">
                  Проследявай приетите храни и калории всеки ден
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NutritionPage;
