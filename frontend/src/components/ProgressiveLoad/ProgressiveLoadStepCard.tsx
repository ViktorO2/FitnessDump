import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Paper,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { ProgressiveLoadStep } from "../../types/program.types";

interface ProgressiveLoadStepCardProps {
  step: ProgressiveLoadStep;
  index: number;
  onUpdate: (index: number, step: ProgressiveLoadStep) => void;
  onRemove: (index: number) => void;
}

const ProgressiveLoadStepCard: React.FC<ProgressiveLoadStepCardProps> = ({
  step,
  index,
  onUpdate,
  onRemove,
}) => {
  const handleChange = (field: keyof ProgressiveLoadStep, value: number) => {
    onUpdate(index, { ...step, [field]: value });
  };

  const isInvalid = (field: keyof ProgressiveLoadStep): boolean => {
    switch (field) {
      case "sets":
      case "reps":
      case "restTime":
        return step[field] <= 0;
      case "weight":
        return step[field] < 0;
      case "intensity":
        return step[field] <= 0 || step[field] > 100;
      default:
        return false;
    }
  };

  const getErrorMessage = (field: keyof ProgressiveLoadStep): string => {
    switch (field) {
      case "sets":
        return "Минимум 1 серия";
      case "reps":
        return "Минимум 1 повторение";
      case "weight":
        return "Тежестта не може да е отрицателна";
      case "restTime":
        return "Минимум 1 секунда почивка";
      case "intensity":
        return "Интензивността трябва да е между 1 и 100%";
      default:
        return "";
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 2,
        },
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
        <Typography variant="subtitle1" color="primary">
          Седмица {step.week}
        </Typography>
        <Tooltip title="Изтрий стъпка">
          <IconButton
            onClick={() => onRemove(index)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 2,
        }}
      >
        <TextField
          label="Серии"
          type="number"
          value={step.sets}
          onChange={(e) => handleChange("sets", parseInt(e.target.value) || 0)}
          error={isInvalid("sets")}
          helperText={isInvalid("sets") ? getErrorMessage("sets") : ""}
          inputProps={{ min: 1 }}
          fullWidth
        />

        <TextField
          label="Повторения"
          type="number"
          value={step.reps}
          onChange={(e) => handleChange("reps", parseInt(e.target.value) || 0)}
          error={isInvalid("reps")}
          helperText={isInvalid("reps") ? getErrorMessage("reps") : ""}
          inputProps={{ min: 1 }}
          fullWidth
        />

        <TextField
          label="Тегло (кг)"
          type="number"
          value={step.weight}
          onChange={(e) =>
            handleChange("weight", parseFloat(e.target.value) || 0)
          }
          error={isInvalid("weight")}
          helperText={isInvalid("weight") ? getErrorMessage("weight") : ""}
          inputProps={{ min: 0, step: 0.5 }}
          fullWidth
        />

        <TextField
          label="Почивка (сек)"
          type="number"
          value={step.restTime}
          onChange={(e) =>
            handleChange("restTime", parseInt(e.target.value) || 0)
          }
          error={isInvalid("restTime")}
          helperText={isInvalid("restTime") ? getErrorMessage("restTime") : ""}
          inputProps={{ min: 1 }}
          fullWidth
        />

        <TextField
          label="Интензивност (%)"
          type="number"
          value={step.intensity}
          onChange={(e) =>
            handleChange("intensity", parseInt(e.target.value) || 0)
          }
          error={isInvalid("intensity")}
          helperText={
            isInvalid("intensity") ? getErrorMessage("intensity") : ""
          }
          inputProps={{ min: 1, max: 100 }}
          fullWidth
        />
      </Box>
    </Paper>
  );
};

export default ProgressiveLoadStepCard;
