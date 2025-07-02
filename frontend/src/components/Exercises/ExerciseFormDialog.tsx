import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  CardMedia,
  Paper,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  Image as ImageIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { ExerciseDTO, ExerciseCategoryDTO } from "../../types/exercise.types";

interface ExerciseFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (exercise: ExerciseDTO) => Promise<void>;
  exercise?: ExerciseDTO | null;
  categories: ExerciseCategoryDTO[];
  loading?: boolean;
  error?: string | null;
}

const ExerciseFormDialog: React.FC<ExerciseFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  exercise,
  categories,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<ExerciseDTO>({
    id: 0,
    name: "",
    description: "",
    categoryId: 0,
    videoUrl: "",
    mediaType: "video",
  });

  useEffect(() => {
    if (exercise) {
      setFormData(exercise);
    } else {
      setFormData({
        id: 0,
        name: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].id : 0,
        videoUrl: "",
        mediaType: "video",
      });
    }
  }, [exercise, open, categories]);

  const handleChange = (field: keyof ExerciseDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      (categories.length > 0 && !formData.categoryId)
    ) {
      return;
    }
    await onSubmit(formData);
  };

  // Helper function for rendering media preview
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
        height="200"
        image={url}
        alt={alt}
        sx={{ objectFit: "cover", borderRadius: 1, border: "1px solid #ddd" }}
        onError={(e: any) => {
          e.target.src = "/images/workout.jpg";
        }}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {exercise ? "Редактиране на упражнение" : "Създаване на упражнение"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Име на упражнението"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Описание"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Категория</InputLabel>
              <Select
                value={formData.categoryId || ""}
                label="Категория"
                onChange={(e) => handleChange("categoryId", e.target.value)}
                disabled={categories.length === 0}
              >
                {categories.length === 0 ? (
                  <MenuItem value="" disabled>
                    Няма налични категории
                  </MenuItem>
                ) : (
                  categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              label="URL на видео"
              value={formData.videoUrl || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              fullWidth
              helperText="Въведете URL на видео, изображение или GIF"
            />

            <FormControl fullWidth>
              <InputLabel>Тип медия</InputLabel>
              <Select
                value={formData.mediaType || "video"}
                label="Тип медия"
                onChange={(e) => handleChange("mediaType", e.target.value)}
              >
                <MenuItem value="video">Видео</MenuItem>
                <MenuItem value="gif">GIF</MenuItem>
                <MenuItem value="image">Изображение</MenuItem>
              </Select>
            </FormControl>

            {/* Preview на медията */}
            {formData.videoUrl ? (
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Преглед на медията:
                </Typography>
                {renderMedia(formData.mediaType, formData.videoUrl, "Preview")}
                <Box
                  sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
                >
                  {formData.mediaType === "video" ? (
                    <PlayIcon color="primary" fontSize="small" />
                  ) : (
                    <ImageIcon color="primary" fontSize="small" />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {formData.mediaType === "video"
                      ? "Видео"
                      : formData.mediaType === "gif"
                      ? "GIF"
                      : "Изображение"}
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Paper
                elevation={1}
                sx={{ p: 2, textAlign: "center", backgroundColor: "#f5f5f5" }}
              >
                <LinkIcon
                  sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Въведете URL за да видите преглед на медията
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Отказ
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              loading ||
              !formData.name ||
              !formData.description ||
              (categories.length > 0 && !formData.categoryId)
            }
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : exercise ? (
              "Обнови"
            ) : (
              "Създай"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ExerciseFormDialog;
