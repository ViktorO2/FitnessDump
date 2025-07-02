import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { WorkoutProgress } from "../../types/training.types";

interface WorkoutProgressDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: WorkoutProgress) => void;
  initialData?: Partial<WorkoutProgress>;
  exerciseName: string;
}

const WorkoutProgressDialog: React.FC<WorkoutProgressDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
  exerciseName,
}) => {
  const [formData, setFormData] = React.useState<Partial<WorkoutProgress>>({
    completedSets: 0,
    completedReps: 0,
    weightUsed: 0,
    notes: "",
    difficultyRating: 3,
    completed: false,
    ...initialData,
  });

  const handleChange = (field: keyof WorkoutProgress, value: any) => {
    setFormData((prev: Partial<WorkoutProgress>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      completed: true,
    } as WorkoutProgress);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {exerciseName} - Прогрес
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Завършени серии"
            type="number"
            value={formData.completedSets}
            onChange={(e) =>
              handleChange("completedSets", parseInt(e.target.value) || 0)
            }
            inputProps={{ min: 0 }}
            fullWidth
          />

          <TextField
            label="Завършени повторения"
            type="number"
            value={formData.completedReps}
            onChange={(e) =>
              handleChange("completedReps", parseInt(e.target.value) || 0)
            }
            inputProps={{ min: 0 }}
            fullWidth
          />

          <TextField
            label="Използвана тежест (кг)"
            type="number"
            value={formData.weightUsed}
            onChange={(e) =>
              handleChange("weightUsed", parseFloat(e.target.value) || 0)
            }
            inputProps={{ min: 0, step: 0.5 }}
            fullWidth
          />

          <Box>
            <Typography component="legend" gutterBottom>
              Трудност
            </Typography>
            <Rating
              value={formData.difficultyRating}
              onChange={(_, value) =>
                handleChange("difficultyRating", value || 3)
              }
              max={5}
            />
          </Box>

          <TextField
            label="Бележки"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отказ</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={formData.completedSets === 0}
        >
          Завърши
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkoutProgressDialog;
