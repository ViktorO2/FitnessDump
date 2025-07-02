import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Restaurant as FoodIcon,
  LocalFireDepartment as CaloriesIcon,
  FitnessCenter as ProteinIcon,
  Grain as CarbsIcon,
  Opacity as FatsIcon,
} from "@mui/icons-material";
import { FoodDTO, CreateFoodDTO } from "../../services/food.service";

interface FoodFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFoodDTO) => void;
  food?: FoodDTO | null;
  loading?: boolean;
  error?: string | null;
}

const FoodFormDialog: React.FC<FoodFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  food,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<CreateFoodDTO>({
    name: "",
    description: "",
    kcal: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        description: food.description || "",
        kcal: food.kcal,
        protein: food.protein,
        fat: food.fat,
        carbs: food.carbs,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        kcal: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
      });
    }
    setErrors({});
  }, [food, open]);

  const handleInputChange = (
    field: keyof CreateFoodDTO,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Името е задължително";
    }

    if (formData.kcal < 0) {
      newErrors.kcal = "Калориите не могат да са отрицателни";
    }

    if (formData.protein < 0) {
      newErrors.protein = "Протеините не могат да са отрицателни";
    }

    if (formData.carbs < 0) {
      newErrors.carbs = "Въглехидратите не могат да са отрицателни";
    }

    if (formData.fat < 0) {
      newErrors.fat = "Мазнините не могат да са отрицателни";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FoodIcon sx={{ fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {food ? "Редактиране на храна" : "Нова храна"}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 600, color: "#2c3e50" }}
                >
                  Основна информация
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Име на храната"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Описание"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      multiline
                      rows={3}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Calories Section */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#fff5f5" }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <CaloriesIcon color="error" />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#c53030" }}
                  >
                    Калории
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  label="Калории (на 100g)"
                  type="number"
                  value={formData.kcal}
                  onChange={(e) =>
                    handleInputChange("kcal", Number(e.target.value))
                  }
                  error={!!errors.kcal}
                  helperText={errors.kcal}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Paper>
            </Grid>

            {/* Macronutrients Section */}
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "#f0f8ff" }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: "#2c3e50" }}
                >
                  Макронутриенти (на 100g)
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(25, 118, 210, 0.1)",
                        border: "1px solid rgba(25, 118, 210, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <ProteinIcon color="primary" />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#1976d2" }}
                        >
                          Протеини
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Грамове"
                        type="number"
                        value={formData.protein}
                        onChange={(e) =>
                          handleInputChange("protein", Number(e.target.value))
                        }
                        error={!!errors.protein}
                        helperText={errors.protein}
                        required
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(156, 39, 176, 0.1)",
                        border: "1px solid rgba(156, 39, 176, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <FatsIcon color="secondary" />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#9c27b0" }}
                        >
                          Мазнини
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Грамове"
                        type="number"
                        value={formData.fat}
                        onChange={(e) =>
                          handleInputChange("fat", Number(e.target.value))
                        }
                        error={!!errors.fat}
                        helperText={errors.fat}
                        required
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                          },
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "rgba(255, 152, 0, 0.1)",
                        border: "1px solid rgba(255, 152, 0, 0.2)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CarbsIcon color="warning" />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, color: "#ff9800" }}
                        >
                          Въглехидрати
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        label="Грамове"
                        type="number"
                        value={formData.carbs}
                        onChange={(e) =>
                          handleInputChange("carbs", Number(e.target.value))
                        }
                        error={!!errors.carbs}
                        helperText={errors.carbs}
                        required
                        size="small"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Отказ
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              },
            }}
          >
            {loading ? "Запазване..." : food ? "Обнови" : "Създай"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FoodFormDialog;
