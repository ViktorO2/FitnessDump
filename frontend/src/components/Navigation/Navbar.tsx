import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Chip,
  Badge,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Person,
  Logout,
  FitnessCenter,
  Restaurant,
  Dashboard,
  History,
  Settings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/auth.context";
import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Mobile drawer and collapses
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const [nutritionOpen, setNutritionOpen] = useState(false);

  // User menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setAnchorEl(null);
    setTrainingOpen(false);
    setNutritionOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{
              mr: 2,
              display: { md: "none" },
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{ display: "flex", alignItems: "center", flexGrow: 0, mr: 4 }}
          >
            <FitnessCenter sx={{ fontSize: 28, mr: 1 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1,
              }}
            >
              FitnessDump
            </Typography>
          </Box>

          {!isMobile && (
            <NavbarDesktop onNavigate={handleNavigation} isActive={isActive} />
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={user?.username}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.1)",
                color: "white",
                fontWeight: 600,
                display: { xs: "none", sm: "flex" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              color="inherit"
              sx={{
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#4caf50",
                      border: "2px solid white",
                    }}
                  />
                }
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <Person />
                </Avatar>
              </Badge>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(0,0,0,0.05)",
                },
              }}
            >
              <MenuItem
                onClick={() => handleNavigation("/dashboard")}
                sx={{
                  gap: 2,
                  "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                }}
              >
                <Dashboard fontSize="small" />
                Табло
              </MenuItem>
              <MenuItem
                onClick={() => handleNavigation("/profile")}
                sx={{
                  gap: 2,
                  "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                }}
              >
                <Person fontSize="small" />
                Профил
              </MenuItem>
              <MenuItem
                onClick={() => handleNavigation("/history")}
                sx={{
                  gap: 2,
                  "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                }}
              >
                <History fontSize="small" />
                История
              </MenuItem>
              <MenuItem
                onClick={() => handleNavigation("/settings")}
                sx={{
                  gap: 2,
                  "&:hover": { bgcolor: "rgba(102, 126, 234, 0.1)" },
                }}
              >
                <Settings fontSize="small" />
                Настройки
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  gap: 2,
                  color: "#f44336",
                  "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
                }}
              >
                <Logout fontSize="small" />
                Изход
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <NavbarMobile
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={handleNavigation}
        isActive={isActive}
        trainingOpen={trainingOpen}
        setTrainingOpen={setTrainingOpen}
        nutritionOpen={nutritionOpen}
        setNutritionOpen={setNutritionOpen}
      />
    </>
  );
};

export default Navbar;
