import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  FitnessCenter as FitnessIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  Flag as GoalIcon,
  Star as DifficultyIcon,
} from "@mui/icons-material";
import { PredefinedProgramDTO } from "../../types/program.types";

interface PredefinedProgramCardProps {
  program: PredefinedProgramDTO;
  onCopyProgram: (program: PredefinedProgramDTO) => void;
}

const PredefinedProgramCard: React.FC<PredefinedProgramCardProps> = ({
  program,
  onCopyProgram,
}) => {
  const [open, setOpen] = useState(false);

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case "MUSCLE_GAIN":
        return "primary";
      case "WEIGHT_LOSS":
        return "success";
      case "ENDURANCE":
        return "info";
      case "STRENGTH":
        return "warning";
      case "FLEXIBILITY":
        return "secondary";
      default:
        return "default";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "success";
      case "INTERMEDIATE":
        return "warning";
      case "ADVANCED":
        return "error";
      default:
        return "default";
    }
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case "MUSCLE_GAIN":
        return "Изграждане на мускули";
      case "WEIGHT_LOSS":
        return "Отслабване";
      case "ENDURANCE":
        return "Издръжливост";
      case "STRENGTH":
        return "Сила";
      case "FLEXIBILITY":
        return "Гъвкавост";
      default:
        return goal;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "Начинаещ";
      case "INTERMEDIATE":
        return "Среден";
      case "ADVANCED":
        return "Напреднал";
      default:
        return difficulty;
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <CardMedia
        component="img"
        height="160"
        image="/images/workout.jpg"
        alt={program.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ fontWeight: 600 }}
        >
          {program.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {program.description}
        </Typography>
        <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            icon={<GoalIcon />}
            label={getGoalLabel(program.goal)}
            color={getGoalColor(program.goal) as any}
            size="small"
          />
          <Chip
            icon={<DifficultyIcon />}
            label={getDifficultyLabel(program.difficultyLevel)}
            color={getDifficultyColor(program.difficultyLevel) as any}
            size="small"
          />
          <Chip
            label={`${program.durationWeeks} седмици`}
            variant="outlined"
            size="small"
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FitnessIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body2" color="text.secondary">
            {program.exercises.length} упражнения
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setOpen(true)}
            startIcon={<InfoIcon />}
          >
            Виж детайли
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onCopyProgram(program)}
            startIcon={<PlayIcon />}
          >
            Копирай
          </Button>
        </Box>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{program.name}</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {program.description}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                icon={<GoalIcon />}
                label={getGoalLabel(program.goal)}
                color={getGoalColor(program.goal) as any}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                icon={<DifficultyIcon />}
                label={getDifficultyLabel(program.difficultyLevel)}
                color={getDifficultyColor(program.difficultyLevel) as any}
                size="small"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`${program.durationWeeks} седмици`}
                variant="outlined"
                size="small"
              />
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Упражнения в програмата:
            </Typography>
            <List dense>
              {program.exercises.map((ex, idx) => (
                <ListItem key={ex.id || idx}>
                  <ListItemIcon>
                    <FitnessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Ден ${ex.dayOfWeek}: ${ex.sets} x ${ex.reps} @ ${
                      ex.suggestedWeight || "-"
                    } кг`}
                    secondary={`ID на упражнение: ${ex.exerciseId}`}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Затвори</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PredefinedProgramCard;
