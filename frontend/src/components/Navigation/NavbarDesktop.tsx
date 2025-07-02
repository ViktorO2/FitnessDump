import React, { useRef, useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import {
  FitnessCenter,
  Restaurant,
  Home,
  Dashboard,
  DirectionsRun,
  Timeline,
  History,
  Category,
  Star,
  Book,
  CalendarToday,
  ListAlt,
  ExpandLess,
  ExpandMore,
  PlayArrow,
} from "@mui/icons-material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import CalculateIcon from "@mui/icons-material/Calculate";

interface NavbarDesktopProps {
  onNavigate: (path: string) => void;
  isActive: (path: string) => boolean;
}

const mainItems = [
  { text: "Начало", icon: <Home />, path: "/home" },
  { text: "Табло", icon: <Dashboard />, path: "/dashboard" },
];

const trainingItems = [
  { text: "Активни тренировки", icon: <PlayArrow />, path: "/workouts" },
  { text: "Упражнения", icon: <DirectionsRun />, path: "/exercises" },
  { text: "Категории", icon: <Category />, path: "/categories" },
  { text: "Мои програми", icon: <FitnessCenter />, path: "/programs" },
  { text: "Готови програми", icon: <Star />, path: "/predefined-programs" },
];

const progressItems = [
  { text: "Прогрес", icon: <Timeline />, path: "/progress" },
  { text: "История", icon: <History />, path: "/history" },
];

const nutritionItems = [
  { text: "Рецепти", icon: <Book />, path: "/recipes" },
  {
    text: "Съставки на рецепти",
    icon: <Restaurant />,
    path: "/recipe-ingredients",
  },
  { text: "Хранителни планове", icon: <CalendarToday />, path: "/meal-plans" },
  { text: "Дневни планове", icon: <CalendarToday />, path: "/daily-plans" },
  { text: "Дневник на храненето", icon: <ListAlt />, path: "/food-diary" },
  { text: "Храни", icon: <RestaurantMenuIcon />, path: "/foods" },
  { text: "Калкулатор", icon: <CalculateIcon />, path: "/calorie-calculator" },
];

const NavbarDesktop: React.FC<NavbarDesktopProps> = ({
  onNavigate,
  isActive,
}) => {
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const trainingAnchorRef = useRef<HTMLButtonElement>(null);
  const nutritionAnchorRef = useRef<HTMLButtonElement>(null);

  const isSectionActive = (items: typeof trainingItems) => {
    return items.some((item) => isActive(item.path));
  };

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      {mainItems.map((item) => (
        <Button
          key={item.text}
          color="inherit"
          startIcon={item.icon}
          onClick={() => onNavigate(item.path)}
          sx={{
            mr: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: isActive(item.path)
              ? "rgba(255,255,255,0.15)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
            fontWeight: isActive(item.path) ? 600 : 500,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
        >
          {item.text}
        </Button>
      ))}

      {/* Training Dropdown */}
      <Box sx={{ position: "relative" }}>
        <Button
          ref={trainingAnchorRef}
          color="inherit"
          startIcon={<FitnessCenter />}
          endIcon={trainingOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setTrainingOpen((open) => !open)}
          sx={{
            mr: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: isSectionActive(trainingItems)
              ? "rgba(255,255,255,0.15)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
            fontWeight: isSectionActive(trainingItems) ? 600 : 500,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
        >
          Тренировки
        </Button>
        <Menu
          open={trainingOpen}
          anchorEl={trainingAnchorRef.current}
          onClose={() => setTrainingOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              minWidth: 200,
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: "1px solid rgba(0,0,0,0.05)",
              overflow: "hidden",
            },
          }}
        >
          {trainingItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => {
                setTrainingOpen(false);
                onNavigate(item.path);
              }}
              sx={{
                px: 3,
                py: 1.5,
                backgroundColor: isActive(item.path)
                  ? "rgba(102, 126, 234, 0.1)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.05)",
                },
                fontSize: "0.875rem",
                fontWeight: isActive(item.path) ? 600 : 500,
                transition: "all 0.2s ease",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {item.icon}
                {item.text}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {progressItems.map((item) => (
        <Button
          key={item.text}
          color="inherit"
          startIcon={item.icon}
          onClick={() => onNavigate(item.path)}
          sx={{
            mr: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: isActive(item.path)
              ? "rgba(255,255,255,0.15)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
            fontWeight: isActive(item.path) ? 600 : 500,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
        >
          {item.text}
        </Button>
      ))}

      {/* Nutrition Dropdown */}
      <Box sx={{ position: "relative" }}>
        <Button
          ref={nutritionAnchorRef}
          color="inherit"
          startIcon={<Restaurant />}
          endIcon={nutritionOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setNutritionOpen((open) => !open)}
          sx={{
            mr: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: isSectionActive(nutritionItems)
              ? "rgba(255,255,255,0.15)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
            fontWeight: isSectionActive(nutritionItems) ? 600 : 500,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
        >
          Хранене
        </Button>
        <Menu
          open={nutritionOpen}
          anchorEl={nutritionAnchorRef.current}
          onClose={() => setNutritionOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              minWidth: 180,
              mt: 1,
              boxShadow: 3,
            },
          }}
        >
          {nutritionItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => {
                setNutritionOpen(false);
                onNavigate(item.path);
              }}
              sx={{
                px: 2,
                py: 1,
                backgroundColor: isActive(item.path)
                  ? "primary.light"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
                fontSize: "0.875rem",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {item.icon}
                {item.text}
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default NavbarDesktop;
