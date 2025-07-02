import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  FitnessCenter,
  ArrowUpward,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const socialLinks = [
    {
      icon: <Facebook />,
      url: "https://facebook.com",
      name: "Facebook",
      color: "#1877f2",
    },
    {
      icon: <Instagram />,
      url: "https://instagram.com",
      name: "Instagram",
      color: "#e4405f",
    },
    {
      icon: <Twitter />,
      url: "https://twitter.com",
      name: "Twitter",
      color: "#1da1f2",
    },
    {
      icon: <LinkedIn />,
      url: "https://linkedin.com",
      name: "LinkedIn",
      color: "#0077b5",
    },
  ];

  const quickLinks = [
    { text: "Начало", path: "/", icon: "🏠" },
    { text: "Табло", path: "/dashboard", icon: "📊" },
    { text: "Тренировки", path: "/workouts", icon: "💪" },
    { text: "Хранене", path: "/nutrition", icon: "🥗" },
    { text: "Прогрес", path: "/progress", icon: "📈" },
  ];

  const legalLinks = [
    { text: "Условия за ползване", path: "/terms" },
    { text: "Поверителност", path: "/privacy" },
    { text: "Бисквитки", path: "/cookies" },
    { text: "Помощ", path: "/help" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
        color: "white",
        py: 6,
        mt: "auto",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Лого и описание */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  bgcolor: "rgba(102, 126, 234, 0.2)",
                  border: "2px solid rgba(102, 126, 234, 0.3)",
                }}
              >
                <FitnessCenter />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Fitness Dump
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{ mb: 3, lineHeight: 1.7, opacity: 0.9 }}
            >
              Вашият персонален фитнес асистент за постигане на по-добра форма и
              здравословен начин на живот. Следете прогреса си и постигнете
              целите си!
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Chip
                label="🏆 Премиум"
                size="small"
                sx={{ bgcolor: "rgba(255,215,0,0.2)", color: "#ffd700" }}
              />
              <Chip
                label="🔒 Сигурно"
                size="small"
                sx={{ bgcolor: "rgba(76,175,80,0.2)", color: "#4caf50" }}
              />
              <Chip
                label="📱 Мобилно"
                size="small"
                sx={{ bgcolor: "rgba(33,150,243,0.2)", color: "#2196f3" }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.name}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      bgcolor: social.color,
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${social.color}40`,
                    },
                    transition: "all 0.3s ease",
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Бързи линкове */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Бързи линкове
            </Typography>
            <Box
              component="nav"
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {quickLinks.map((link) => (
                <Link
                  key={link.text}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#667eea",
                      bgcolor: "rgba(102, 126, 234, 0.1)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <span style={{ marginRight: "8px" }}>{link.icon}</span>
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Правни */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Правни
            </Typography>
            <Box
              component="nav"
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              {legalLinks.map((link) => (
                <Link
                  key={link.text}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    py: 0.5,
                    px: 1,
                    borderRadius: 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#667eea",
                      bgcolor: "rgba(102, 126, 234, 0.1)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {link.text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Контакти */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 3 }}
            >
              Контакти
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 2,
                    bgcolor: "rgba(102, 126, 234, 0.2)",
                  }}
                >
                  <Email fontSize="small" />
                </Avatar>
                <Link
                  href="mailto:contact@fitnessdump.com"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#667eea",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  contact@fitnessdump.com
                </Link>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 2,
                    bgcolor: "rgba(76,175,80,0.2)",
                  }}
                >
                  <Phone fontSize="small" />
                </Avatar>
                <Link
                  href="tel:+359888888888"
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    textDecoration: "none",
                    "&:hover": {
                      color: "#667eea",
                    },
                    transition: "color 0.2s ease",
                  }}
                >
                  +359 88 888 8888
                </Link>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    mr: 2,
                    bgcolor: "rgba(255,152,0,0.2)",
                  }}
                >
                  <LocationOn fontSize="small" />
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  София, България
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
            © {new Date().getFullYear()} Fitness Dump. Всички права запазени.
          </Typography>

          <IconButton
            onClick={scrollToTop}
            sx={{
              bgcolor: "rgba(102, 126, 234, 0.2)",
              color: "#667eea",
              border: "1px solid rgba(102, 126, 234, 0.3)",
              "&:hover": {
                bgcolor: "#667eea",
                color: "white",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
