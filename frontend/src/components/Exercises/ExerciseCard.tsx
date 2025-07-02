import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Chip,
  Typography,
  Box,
  Avatar,
  LinearProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  PlayArrow as PlayIcon,
  Image as ImageIcon,
  Info as InfoIcon,
  FitnessCenter,
} from "@mui/icons-material";
import { ExerciseDTO } from "../../types/exercise.types";

interface ExerciseCardProps {
  exercise: ExerciseDTO;
  categoryName: string;
  onEdit: (exercise: ExerciseDTO) => void;
  onDelete: (exercise: ExerciseDTO) => void;
  onView: (exercise: ExerciseDTO) => void;
}

// Helper function for rendering media
const renderMedia = (
  mediaType: string | undefined,
  url: string | undefined,
  alt: string
) => {
  if (!url) return null;
  if (mediaType === "video") {
    return (
      <Box sx={{ position: "relative", height: 200, background: "#000" }}>
        <video
          src={url}
          controls
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: 0,
          }}
        />
      </Box>
    );
  }
  // image or gif
  return (
    <CardMedia
      component="img"
      height="200"
      image={url}
      alt={alt}
      sx={{ objectFit: "cover", backgroundColor: "#f5f5f5" }}
      onError={(e: any) => {
        e.target.style.display = "none";
      }}
    />
  );
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  categoryName,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <Card
      onClick={() => onView(exercise)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.3)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
          "& .MuiCardMedia-root": {
            transform: "scale(1.05)",
          },
        },
        overflow: "hidden",
      }}
    >
      <Box sx={{ position: "relative" }}>
        {renderMedia(exercise.mediaType, exercise.videoUrl, exercise.name)}

        {/* Category chip */}
        <Chip
          label={categoryName}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "rgba(102, 126, 234, 0.9)",
            color: "white",
            fontWeight: 600,
            backdropFilter: "blur(10px)",
          }}
        />

        {/* Action buttons */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "flex",
            gap: 0.5,
            opacity: 0.8,
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onView(exercise);
            }}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#667eea",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(exercise);
            }}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#4facfe",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(exercise);
            }}
            sx={{
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#f5576c",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <FitnessCenter />
          </Avatar>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              flex: 1,
              fontWeight: 600,
              color: "#2d3748",
              lineHeight: 1.2,
            }}
          >
            {exercise.name}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          paragraph
          sx={{
            flexGrow: 1,
            mb: 2,
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {exercise.description}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          {exercise.mediaType && (
            <Chip
              label={
                exercise.mediaType === "video"
                  ? "Видео"
                  : exercise.mediaType === "gif"
                  ? "GIF"
                  : "Изображение"
              }
              size="small"
              variant="outlined"
              icon={
                exercise.mediaType === "video" ? <PlayIcon /> : <ImageIcon />
              }
              sx={{
                borderColor: "#667eea",
                color: "#667eea",
                "& .MuiChip-icon": {
                  color: "#667eea",
                },
              }}
            />
          )}
        </Box>

        {/* Progress bar for engagement */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Популярност
            </Typography>
            <Typography variant="caption" color="text.secondary">
              85%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={85}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 2,
                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
              },
            }}
          />
        </Box>

        {exercise.videoUrl && (
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(exercise.videoUrl, "_blank");
            }}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1,
              "&:hover": {
                bgcolor: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Преглед на{" "}
            {exercise.mediaType === "video"
              ? "видео"
              : exercise.mediaType === "gif"
              ? "GIF"
              : "медия"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseCard;
