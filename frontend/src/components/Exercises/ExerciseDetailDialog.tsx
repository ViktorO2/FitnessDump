import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CardMedia,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  Image as ImageIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import { ExerciseDTO, ExerciseCategoryDTO } from "../../types/exercise.types";

interface ExerciseDetailDialogProps {
  open: boolean;
  onClose: () => void;
  exercise: ExerciseDTO | null;
  categories: ExerciseCategoryDTO[];
}

const ExerciseDetailDialog: React.FC<ExerciseDetailDialogProps> = ({
  open,
  onClose,
  exercise,
  categories,
}) => {
  if (!exercise) return null;

  const getCategoryName = (categoryId: number) => {
    return (
      categories.find((cat) => cat.id === categoryId)?.name ||
      "Неизвестна категория"
    );
  };

  // Helper function for rendering media
  const renderMedia = (
    mediaType: string | undefined,
    url: string | undefined,
    alt: string
  ) => {
    if (!url) {
      return (
        <CardMedia
          component="img"
          height="300"
          image={"/images/workout.jpg"}
          alt={alt}
          sx={{ objectFit: "cover", borderRadius: 1 }}
        />
      );
    }
    if (mediaType === "video") {
      return (
        <Box sx={{ position: "relative", height: 300, background: "#000" }}>
          <video
            src={url}
            controls
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              borderRadius: 4,
            }}
            poster={"/images/workout.jpg"}
          />
        </Box>
      );
    }
    // image or gif
    return (
      <CardMedia
        component="img"
        height="300"
        image={url}
        alt={alt}
        sx={{ objectFit: "cover", borderRadius: 1 }}
        onError={(e: any) => {
          e.target.src = "/images/workout.jpg";
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h2">
            {exercise.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Голяма картинка */}
          {renderMedia(exercise.mediaType, exercise.videoUrl, exercise.name)}

          {/* Описание */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {exercise.description}
            </Typography>
          </Box>

          {/* Детайли */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Детайли
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={`Категория: ${getCategoryName(exercise.categoryId)}`}
                color="primary"
                variant="outlined"
              />
              {exercise.mediaType && (
                <Chip
                  label={`Тип: ${exercise.mediaType}`}
                  icon={
                    exercise.mediaType === "VIDEO" ? (
                      <PlayIcon />
                    ) : (
                      <ImageIcon />
                    )
                  }
                  variant="outlined"
                />
              )}
              <Chip
                label={`ID: ${exercise.id}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          {/* Бутон за отваряне на медия */}
          {exercise.videoUrl && (
            <Box>
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={() => window.open(exercise.videoUrl, "_blank")}
                fullWidth
                size="large"
              >
                Отвори {exercise.mediaType === "VIDEO" ? "видео" : "медия"} в
                нов таб
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Затвори
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExerciseDetailDialog;
