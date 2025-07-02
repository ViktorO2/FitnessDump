import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface ExerciseEmptyStateProps {
  hasFilters: boolean;
  onCreateExercise: () => void;
}

const ExerciseEmptyState: React.FC<ExerciseEmptyStateProps> = ({
  hasFilters,
  onCreateExercise,
}) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 8,
        border: "2px dashed #ddd",
        borderRadius: 2,
        mt: 3,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Няма намерени упражнения
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {hasFilters
          ? "Променете филтрите или създайте ново упражнение"
          : "Създайте първото упражнение, за да започнете"}
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateExercise}
      >
        {hasFilters ? "Добави упражнение" : "Добави първо упражнение"}
      </Button>
    </Box>
  );
};

export default ExerciseEmptyState;
