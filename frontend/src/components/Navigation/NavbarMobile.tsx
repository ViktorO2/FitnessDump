import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
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
  RestaurantMenu,
  Calculate,
} from "@mui/icons-material";

interface NavbarMobileProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  isActive: (path: string) => boolean;
  trainingOpen: boolean;
  setTrainingOpen: (open: boolean) => void;
  nutritionOpen: boolean;
  setNutritionOpen: (open: boolean) => void;
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
  { text: "Храни", icon: <RestaurantMenu />, path: "/foods" },
  { text: "Калкулатор", icon: <Calculate />, path: "/calorie-calculator" },
];

const NavbarMobile: React.FC<NavbarMobileProps> = ({
  open,
  onClose,
  onNavigate,
  isActive,
  trainingOpen,
  setTrainingOpen,
  nutritionOpen,
  setNutritionOpen,
}) => {
  const isSectionActive = (items: typeof trainingItems) => {
    return items.some((item) => isActive(item.path));
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 280,
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRight: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ width: 280, mt: 2 }}>
        <List>
          {mainItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => onNavigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.15)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? "#667eea" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: isActive(item.path) ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 2, mx: 2 }} />

          {/* Training Section */}
          <ListItemButton
            onClick={() => setTrainingOpen(!trainingOpen)}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: isSectionActive(trainingItems)
                ? "rgba(102, 126, 234, 0.1)"
                : "transparent",
              color: isSectionActive(trainingItems) ? "#667eea" : "inherit",
              "&:hover": {
                backgroundColor: isSectionActive(trainingItems)
                  ? "rgba(102, 126, 234, 0.15)"
                  : "rgba(0,0,0,0.04)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <FitnessCenter />
            </ListItemIcon>
            <ListItemText
              primary="Тренировки"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: isSectionActive(trainingItems) ? 600 : 500,
                },
              }}
            />
            {trainingOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={trainingOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {trainingItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  onClick={() => onNavigate(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    pl: 5,
                    py: 1,
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                      color: "#667eea",
                      "&:hover": {
                        backgroundColor: "rgba(102, 126, 234, 0.15)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? "#667eea" : "text.secondary",
                      minWidth: 36,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "0.875rem",
                        fontWeight: isActive(item.path) ? 600 : 500,
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 2, mx: 2 }} />

          {/* Progress & History */}
          {progressItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => onNavigate(item.path)}
              selected={isActive(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                  "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.15)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? "#667eea" : "text.secondary",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: isActive(item.path) ? 600 : 500,
                  },
                }}
              />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 2, mx: 2 }} />

          {/* Nutrition Section */}
          <ListItemButton
            onClick={() => setNutritionOpen(!nutritionOpen)}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: isSectionActive(nutritionItems)
                ? "rgba(102, 126, 234, 0.1)"
                : "transparent",
              color: isSectionActive(nutritionItems) ? "#667eea" : "inherit",
              "&:hover": {
                backgroundColor: isSectionActive(nutritionItems)
                  ? "rgba(102, 126, 234, 0.15)"
                  : "rgba(0,0,0,0.04)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <Restaurant />
            </ListItemIcon>
            <ListItemText
              primary="Хранене"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: isSectionActive(nutritionItems) ? 600 : 500,
                },
              }}
            />
            {nutritionOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={nutritionOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {nutritionItems.map((item) => (
                <ListItemButton
                  key={item.text}
                  onClick={() => onNavigate(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    pl: 5,
                    py: 1,
                    mx: 1,
                    borderRadius: 2,
                    mb: 0.5,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(102, 126, 234, 0.1)",
                      color: "#667eea",
                      "&:hover": {
                        backgroundColor: "rgba(102, 126, 234, 0.15)",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? "#667eea" : "text.secondary",
                      minWidth: 36,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiListItemText-primary": {
                        fontSize: "0.875rem",
                        fontWeight: isActive(item.path) ? 600 : 500,
                      },
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default NavbarMobile;
