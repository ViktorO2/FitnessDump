import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  Timeline,
  PlayArrow,
  TrendingUp,
  CalendarToday,
  LocalFireDepartment,
  RestaurantMenu,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

const ACTIVITY_LEVELS = {
  SEDENTARY: {
    label: "Седящ начин на живот",
    description: "Малко или никакво движение, седяща работа",
    multiplier: 1.2,
    icon: "🛋️",
  },
  // ...
};

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Начало на тренировка",
      description: "Започнете нова тренировка",
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      color: "#667eea",
      path: "/workouts",
    },
    {
      title: "Дневник на храненето",
      description: "Запишете хранителните си",
      icon: <RestaurantMenu sx={{ fontSize: 40 }} />,
      color: "#f093fb",
      path: "/food-diary",
    },
    {
      title: "Прогрес",
      description: "Вижте вашите резултати",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#4facfe",
      path: "/progress",
    },
    {
      title: "Рецепти",
      description: "Открийте нови рецепти",
      icon: <Restaurant sx={{ fontSize: 40 }} />,
      color: "#43e97b",
      path: "/recipes",
    },
  ];

  const stats = [
    {
      label: "Тренировки този месец",
      value: "12",
      icon: <FitnessCenter />,
      color: "#667eea",
    },
    {
      label: "Калории днес",
      value: "1,850",
      icon: <LocalFireDepartment />,
      color: "#f093fb",
    },
    {
      label: "Дни активност",
      value: "8",
      icon: <CalendarToday />,
      color: "#4facfe",
    },
    { label: "Прогрес", value: "75%", icon: <Timeline />, color: "#43e97b" },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 4,
          p: { xs: 3, md: 6 },
          mb: 4,
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('/images/hero-bg.jpg') center/cover",
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Добре дошли, {user?.firstName}! 👋
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            Готови ли сте за днешната тренировка? Нека постигнем нови цели
            заедно!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={() => navigate("/workouts")}
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Започни тренировка
          </Button>
        </Box>
      </Box>

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 6, md: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ fontWeight: 700, mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "#2d3748",
        }}
      >
        Бързи действия
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    color: "white",
                  }}
                >
                  {action.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress Section */}
      <Card
        sx={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.3)",
          p: 3,
        }}
      >
        <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 600 }}>
          Дневен прогрес
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Калории</Typography>
                <Typography variant="body2" fontWeight={600}>
                  1,850 / 2,200
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={84}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Протеини</Typography>
                <Typography variant="body2" fontWeight={600}>
                  120g / 150g
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background:
                      "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)",
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Въглехидрати</Typography>
                <Typography variant="body2" fontWeight={600}>
                  200g / 250g
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={80}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background:
                      "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Мазнини</Typography>
                <Typography variant="body2" fontWeight={600}>
                  65g / 80g
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={81}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background:
                      "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default HomePage;
