import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Button,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface RecipeFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGoals: string[];
  onGoalsChange: (goals: string[]) => void;
  maxCalories: number;
  onMaxCaloriesChange: (calories: number) => void;
  onClearFilters: () => void;
}

const RecipeFilters: React.FC<RecipeFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedGoals,
  onGoalsChange,
  maxCalories,
  onMaxCaloriesChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const goalLabels = {
    LOSE_WEIGHT: "Загуба на тегло",
    MAINTAIN_WEIGHT: "Поддържане на тегло",
    GAIN_WEIGHT: "Качване на тегло",
  };

  const handleGoalChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    onGoalsChange(typeof value === "string" ? [] : value);
  };

  const handleClearFilters = () => {
    onClearFilters();
    setShowFilters(false);
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedGoals.length > 0 || maxCalories < 2000;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Търсачка */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Търси рецепти..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
        />
        <Button
          variant={showFilters ? "contained" : "outlined"}
          startIcon={<FilterIcon />}
          onClick={() => setShowFilters(!showFilters)}
          sx={{ minWidth: "auto" }}
        >
          Филтри
        </Button>
        {hasActiveFilters && (
          <IconButton onClick={handleClearFilters} color="error">
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      {/* Разширени филтри */}
      <Collapse in={showFilters}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Цели */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Препоръчано за</InputLabel>
              <Select
                multiple
                value={selectedGoals}
                onChange={handleGoalChange}
                input={<OutlinedInput label="Препоръчано за" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={goalLabels[value as keyof typeof goalLabels]}
                        size="small"
                      />
                    ))}
                  </Box>
                )}
              >
                {Object.entries(goalLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Максимални калории */}
            <TextField
              label="Макс. калории"
              type="number"
              value={maxCalories}
              onChange={(e) => onMaxCaloriesChange(Number(e.target.value))}
              sx={{ minWidth: 150 }}
              inputProps={{ min: 0, max: 5000 }}
            />
          </Box>

          {/* Активни филтри */}
          {hasActiveFilters && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {searchQuery.trim() !== "" && (
                <Chip
                  label={`Търсене: "${searchQuery}"`}
                  onDelete={() => onSearchChange("")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedGoals.map((goal) => (
                <Chip
                  key={goal}
                  label={`Цел: ${goalLabels[goal as keyof typeof goalLabels]}`}
                  onDelete={() =>
                    onGoalsChange(selectedGoals.filter((g) => g !== goal))
                  }
                  color="secondary"
                  variant="outlined"
                />
              ))}
              {maxCalories < 2000 && (
                <Chip
                  label={`Макс. калории: ${maxCalories}`}
                  onDelete={() => onMaxCaloriesChange(2000)}
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default RecipeFilters;
