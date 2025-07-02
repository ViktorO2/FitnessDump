import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { ProgressiveLoadStep } from "../../types/program.types";
import ProgressiveLoadStepCard from "../ProgressiveLoad/ProgressiveLoadStepCard";
import ProgressiveLoadSummary from "../ProgressiveLoad/ProgressiveLoadSummary";

interface ProgressiveLoadDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (progressiveLoad: ProgressiveLoadStep[]) => void;
  initialData?: ProgressiveLoadStep[];
  exerciseName?: string;
}

const ProgressiveLoadDialog: React.FC<ProgressiveLoadDialogProps> = ({
  open,
  onClose,
  onSave,
  initialData = [],
  exerciseName = "Неизвестно упражнение",
}) => {
  const [steps, setSteps] = useState<ProgressiveLoadStep[]>(initialData);
  const [error, setError] = useState<string | null>(null);

  const addStep = () => {
    const lastStep = steps[steps.length - 1];
    const newStep: ProgressiveLoadStep = {
      week: steps.length + 1,
      sets: lastStep ? lastStep.sets : 3,
      reps: lastStep ? lastStep.reps : 10,
      weight: lastStep ? lastStep.weight + 2.5 : 0,
      restTime: lastStep ? lastStep.restTime : 90,
      intensity: lastStep ? Math.min(lastStep.intensity + 5, 100) : 60,
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (index: number, updatedStep: ProgressiveLoadStep) => {
    setSteps(steps.map((step, i) => (i === index ? updatedStep : step)));
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
    // Обновяваме номерата на седмиците
    setSteps((prev) =>
      prev.map((step, i) => ({
        ...step,
        week: i + 1,
      }))
    );
  };

  const handleSave = () => {
    // Валидация
    if (steps.length === 0) {
      setError("Добавете поне една стъпка");
      return;
    }

    const invalidStep = steps.find(
      (step) =>
        step.sets <= 0 ||
        step.reps <= 0 ||
        step.weight < 0 ||
        step.restTime <= 0 ||
        step.intensity <= 0 ||
        step.intensity > 100
    );

    if (invalidStep) {
      setError(
        "Всички стойности трябва да са положителни, а интензивността между 1 и 100%"
      );
      return;
    }

    setError(null);
    onSave(steps);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TrendingUpIcon color="primary" />
          <Typography variant="h6">
            Прогресивно натоварване - {exerciseName}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Настройте прогресивното натоварване за това упражнение. Добавете
          стъпки за всяка седмица, като постепенно увеличавате интензитета и
          тежестта.
        </Typography>

        <ProgressiveLoadSummary steps={steps} />

        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addStep}
            fullWidth
          >
            Добави стъпка
          </Button>
        </Box>

        {steps.map((step, index) => (
          <ProgressiveLoadStepCard
            key={index}
            step={step}
            index={index}
            onUpdate={updateStep}
            onRemove={removeStep}
          />
        ))}

        {steps.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 4 }}
          >
            Все още няма добавени стъпки. Използвайте бутона отгоре, за да
            добавите.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Отказ</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={steps.length === 0}
        >
          Запази
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgressiveLoadDialog;
