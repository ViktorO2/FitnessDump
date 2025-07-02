import {
  Box,
  Button,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TimelineIcon from "@mui/icons-material/Timeline";
import Footer from "../../components/Footer/Footer";

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const features = [
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: "Персонализирани тренировки",
      description: "Създайте своя перфектен тренировъчен план",
      image: "/images/workout.jpg",
      gradient: theme.palette.background.gradient.primary,
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: "Хранителен режим",
      description: "Проследявайте своя хранителен режим",
      image: "/images/nutrition.jpg",
      gradient: theme.palette.background.gradient.secondary,
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: "Проследяване на прогрес",
      description: "Следете своето развитие във времето",
      image: "/images/progress.jpg",
      gradient: theme.palette.background.gradient.mixed,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: isMobile ? "80vh" : "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Hero Background Image */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: 'url("/images/hero-bg.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
        {/* Dark Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(20,20,40,0.7) 60%, rgba(20,20,40,0.95) 100%)",
            zIndex: 1,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: isMobile ? "80vh" : "90vh",
          }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: "100%" }}
          >
            <Box
              sx={{
                textAlign: "center",
                color: "white",
                width: "100%",
                px: isMobile ? 2 : 0,
              }}
            >
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  sx={{
                    mb: isMobile ? 1 : 2,
                    fontSize: isMobile ? "2.2rem" : "4rem",
                    fontWeight: "bold",
                    textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  }}
                >
                  Fitness Dump
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h2"
                  sx={{
                    mb: isMobile ? 3 : 5,
                    fontSize: isMobile ? "1.1rem" : "2rem",
                    opacity: 0.95,
                    textShadow: "1px 1px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  Вашият личен фитнес асистент
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/register")}
                    sx={{
                      px: isMobile ? 3 : 6,
                      py: isMobile ? 1.5 : 2,
                      fontSize: isMobile ? "1rem" : "1.2rem",
                      backgroundColor: theme.palette.secondary.main,
                      "&:hover": {
                        backgroundColor: theme.palette.secondary.dark,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                      borderRadius: 3,
                    }}
                  >
                    Започнете сега
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      px: isMobile ? 3 : 6,
                      py: isMobile ? 1.5 : 2,
                      fontSize: isMobile ? "1rem" : "1.2rem",
                      borderColor: "white",
                      color: "white",
                      "&:hover": {
                        borderColor: "white",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                      borderRadius: 3,
                    }}
                  >
                    Вход
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <motion.div variants={itemVariants} whileHover={{ y: -10 }}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 3,
                        "&:hover": {
                          boxShadow: 6,
                          "& .MuiCardMedia-root": {
                            transform: "scale(1.05)",
                          },
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={feature.image}
                        alt={feature.title}
                        sx={{
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          textAlign: "center",
                          background: feature.gradient,
                          color: "white",
                        }}
                      >
                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{
                            mb: 1,
                            fontWeight: "bold",
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography>{feature.description}</Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/workout.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)",
          },
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              mb: 4,
              fontSize: isMobile ? "2rem" : "3rem",
              fontWeight: "bold",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            Готови ли сте да промените живота си?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              backgroundColor: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Започнете безплатно
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
