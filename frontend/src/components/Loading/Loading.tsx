import { Box, CircularProgress, Typography, Avatar } from "@mui/material";
import { FitnessCenter } from "@mui/icons-material";

interface LoadingProps {
  message?: string;
  size?: "small" | "medium" | "large";
}

const Loading: React.FC<LoadingProps> = ({
  message = "Зареждане...",
  size = "medium",
}) => {
  const getSize = () => {
    switch (size) {
      case "small":
        return { progress: 24, avatar: 32, spacing: 1 };
      case "large":
        return { progress: 60, avatar: 80, spacing: 3 };
      default:
        return { progress: 40, avatar: 56, spacing: 2 };
    }
  };

  const sizes = getSize();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 200,
        p: 3,
        background: "rgba(255,255,255,0.5)",
        borderRadius: 3,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      {/* Animated logo */}
      <Box sx={{ position: "relative", mb: sizes.spacing }}>
        <Avatar
          sx={{
            width: sizes.avatar,
            height: sizes.avatar,
            bgcolor: "rgba(102, 126, 234, 0.1)",
            border: "2px solid rgba(102, 126, 234, 0.3)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <FitnessCenter
            sx={{
              fontSize: sizes.avatar * 0.5,
              color: "#667eea",
            }}
          />
        </Avatar>

        {/* Rotating progress ring */}
        <CircularProgress
          size={sizes.progress}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#667eea",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>

      {/* Loading text */}
      <Typography
        variant={size === "large" ? "h6" : "body1"}
        sx={{
          mt: sizes.spacing,
          color: "#2d3748",
          fontWeight: 500,
          textAlign: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {message}
      </Typography>

      {/* Animated dots */}
      <Box sx={{ display: "flex", gap: 0.5, mt: 1 }}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: "#667eea",
              animation: `pulse 1.4s ease-in-out infinite both`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Loading;
