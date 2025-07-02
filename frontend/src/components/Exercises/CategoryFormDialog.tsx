import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ExerciseCategoryDTO } from "../../types/exercise.types";

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (category: ExerciseCategoryDTO) => Promise<void>;
  category?: ExerciseCategoryDTO | null;
  loading?: boolean;
  error?: string | null;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  category,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<ExerciseCategoryDTO>({
    id: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        id: 0,
        name: "",
        description: "",
      });
    }
  }, [category, open]);

  const handleChange = (field: keyof ExerciseCategoryDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      return;
    }
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {category ? "Редактиране на категория" : "Създаване на категория"}
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
              label="Име на категорията"
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
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Отказ
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.name || !formData.description}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : category ? (
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

export default CategoryFormDialog;
