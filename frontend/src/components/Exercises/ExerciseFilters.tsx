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
import { ExerciseCategoryDTO } from "../../types/exercise.types";

interface ExerciseFiltersProps {
  searchQuery: string;
  selectedCategory: number | "";
  categories: ExerciseCategoryDTO[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (categoryId: number | "") => void;
  onClearFilters: () => void;
}

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onClearFilters,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Филтри</Typography>
        </Box>

        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 2 }}
        >
          <TextField
            fullWidth
            placeholder="Търси упражнения..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              value={selectedCategory}
              label="Категория"
              onChange={(e) => onCategoryChange(e.target.value as number | "")}
            >
              <MenuItem value="">Всички категории</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={onClearFilters}
            disabled={!searchQuery && selectedCategory === ""}
          >
            Изчисти филтри
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ExerciseFilters;
