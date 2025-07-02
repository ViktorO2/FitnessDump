import React from "react";
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";

interface PredefinedProgramFiltersProps {
  searchQuery: string;
  selectedGoal: string;
  selectedDifficulty: string;
  onSearchChange: (query: string) => void;
  onGoalChange: (goal: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onClearFilters: () => void;
}

const PredefinedProgramFilters: React.FC<PredefinedProgramFiltersProps> = ({
  searchQuery,
  selectedGoal,
  selectedDifficulty,
  onSearchChange,
  onGoalChange,
  onDifficultyChange,
  onClearFilters,
}) => {
  const goals = [
    { value: "MUSCLE_GAIN", label: "Изграждане на мускули" },
    { value: "WEIGHT_LOSS", label: "Отслабване" },
    { value: "ENDURANCE", label: "Издръжливост" },
    { value: "STRENGTH", label: "Сила" },
    { value: "FLEXIBILITY", label: "Гъвкавост" },
  ];

  const difficulties = [
    { value: "BEGINNER", label: "Начинаещ" },
    { value: "INTERMEDIATE", label: "Среден" },
    { value: "ADVANCED", label: "Напреднал" },
  ];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Филтри</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Търсене"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Цел</InputLabel>
            <Select
              value={selectedGoal}
              label="Цел"
              onChange={(e) => onGoalChange(e.target.value)}
            >
              <MenuItem value="">Всички цели</MenuItem>
              {goals.map((goal) => (
                <MenuItem key={goal.value} value={goal.value}>
                  {goal.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Трудност</InputLabel>
            <Select
              value={selectedDifficulty}
              label="Трудност"
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              <MenuItem value="">Всички нива</MenuItem>
              {difficulties.map((difficulty) => (
                <MenuItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={onClearFilters}
            size="small"
            sx={{ alignSelf: "flex-end" }}
          >
            Изчисти филтрите
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PredefinedProgramFilters;
