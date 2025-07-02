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
  Chip,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  TrainingProgramDTO,
  ProgramExerciseDTO,
} from "../../types/program.types";
import { ExerciseDTO } from "../../types/exercise.types";

interface ProgramFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (program: TrainingProgramDTO) => Promise<void>;
  program?: TrainingProgramDTO | null;
  exercises: ExerciseDTO[];
  loading?: boolean;
  error?: string | null;
}

const ProgramFormDialog: React.FC<ProgramFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  program,
  exercises,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState<TrainingProgramDTO>({
    id: 0,
    name: "",
    description: "",
    userId: 0,
    exercises: [],
  });

  useEffect(() => {
    if (program) {
      setFormData(program);
    } else {
      setFormData({
        id: 0,
        name: "",
        description: "",
        userId: 0,
        exercises: [],
      });
    }
  }, [program, open]);

  const handleChange = (field: keyof TrainingProgramDTO, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addExercise = () => {
    const newExercise: ProgramExerciseDTO = {
      id: 0,
      exerciseId: 0,
      dayOfWeek: 1,
      sets: 3,
      reps: 10,
      weight: 0,
      orderInDay: formData.exercises.length + 1,
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));
  };

  const removeExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (
    index: number,
    field: keyof ProgramExerciseDTO,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      formData.exercises.length === 0 ||
      formData.exercises.some(
        (ex) => !ex.exerciseId || ex.sets <= 0 || ex.reps <= 0
      )
    ) {
      return;
    }
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {program ? "Редактиране на програма" : "Създаване на програма"}
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
              label="Име на програмата"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
              error={!formData.name}
              helperText={!formData.name ? "Името е задължително" : ""}
            />

            <TextField
              label="Описание"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              multiline
              rows={3}
              fullWidth
              error={!formData.description}
              helperText={
                !formData.description ? "Описанието е задължително" : ""
              }
            />

            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Упражнения</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addExercise}
                  variant="outlined"
                  size="small"
                >
                  Добави упражнение
                </Button>
              </Box>

              {formData.exercises.map((exercise, index) => (
                <Box
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    backgroundColor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">
                      Упражнение {index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => removeExercise(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <FormControl
                      fullWidth
                      required
                      error={!exercise.exerciseId}
                    >
                      <InputLabel>Избери упражнение</InputLabel>
                      <Select
                        value={exercise.exerciseId || ""}
                        label="Избери упражнение"
                        onChange={(e) =>
                          updateExercise(index, "exerciseId", e.target.value)
                        }
                      >
                        {exercises.map((ex) => (
                          <MenuItem key={ex.id} value={ex.id}>
                            {ex.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {!exercise.exerciseId && (
                        <Typography variant="caption" color="error">
                          Изберете упражнение
                        </Typography>
                      )}
                    </FormControl>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Ден от седмицата"
                        select
                        value={exercise.dayOfWeek}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "dayOfWeek",
                            parseInt(e.target.value)
                          )
                        }
                        fullWidth
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <MenuItem key={day} value={day}>
                            {
                              [
                                "Понеделник",
                                "Вторник",
                                "Сряда",
                                "Четвъртък",
                                "Петък",
                                "Събота",
                                "Неделя",
                              ][day - 1]
                            }
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Ред в деня"
                        type="number"
                        value={exercise.orderInDay}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "orderInDay",
                            parseInt(e.target.value) || 1
                          )
                        }
                        inputProps={{ min: 1 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Серии"
                        type="number"
                        value={exercise.sets}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "sets",
                            parseInt(e.target.value) || 0
                          )
                        }
                        error={exercise.sets <= 0}
                        helperText={exercise.sets <= 0 ? "Минимум 1 серия" : ""}
                        inputProps={{ min: 1 }}
                        required
                      />

                      <TextField
                        label="Повторения"
                        type="number"
                        value={exercise.reps}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "reps",
                            parseInt(e.target.value) || 0
                          )
                        }
                        error={exercise.reps <= 0}
                        helperText={
                          exercise.reps <= 0 ? "Минимум 1 повторение" : ""
                        }
                        inputProps={{ min: 1 }}
                        required
                      />

                      <TextField
                        label="Тегло (кг)"
                        type="number"
                        value={exercise.weight}
                        onChange={(e) =>
                          updateExercise(
                            index,
                            "weight",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0, step: 0.5 }}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}

              {formData.exercises.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ py: 4 }}
                >
                  Все още няма добавени упражнения. Използвайте бутона отгоре,
                  за да добавите.
                </Typography>
              )}
            </Box>
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
              formData.exercises.length === 0 ||
              formData.exercises.some(
                (ex) => !ex.exerciseId || ex.sets <= 0 || ex.reps <= 0
              )
            }
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : program ? (
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

export default ProgramFormDialog;
