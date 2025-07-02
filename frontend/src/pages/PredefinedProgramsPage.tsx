import React from "react";
import { Box, Typography, Grid, CircularProgress, Alert } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import { usePredefinedPrograms } from "../hooks/usePredefinedPrograms";
import PredefinedProgramCard from "../components/PredefinedPrograms/PredefinedProgramCard";
import PredefinedProgramFilters from "../components/PredefinedPrograms/PredefinedProgramFilters";
import EmptyState from "../components/PredefinedPrograms/EmptyState";

const PredefinedProgramsPage: React.FC = () => {
  const {
    predefinedPrograms,
    filteredPrograms,
    loading,
    error,
    searchQuery,
    selectedGoal,
    selectedDifficulty,
    hasActiveFilters,
    setSearchQuery,
    setSelectedGoal,
    setSelectedDifficulty,
    handleCopyProgram,
    clearFilters,
  } = usePredefinedPrograms();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: 1,
        }}
      >
        <Typography variant="h4">Готови тренировъчни програми</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <StarIcon color="primary" />
          <Typography variant="body2" color="text.secondary">
            Професионално разработени програми
          </Typography>
        </Box>
      </Box>

      <PredefinedProgramFilters
        searchQuery={searchQuery}
        selectedGoal={selectedGoal}
        selectedDifficulty={selectedDifficulty}
        onSearchChange={setSearchQuery}
        onGoalChange={setSelectedGoal}
        onDifficultyChange={setSelectedDifficulty}
        onClearFilters={clearFilters}
      />

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Показани програми: {filteredPrograms.length} от{" "}
          {predefinedPrograms.length}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredPrograms.map((program) => (
          <Grid key={program.id}>
            <PredefinedProgramCard
              program={program}
              onCopyProgram={handleCopyProgram}
            />
          </Grid>
        ))}
      </Grid>

      {filteredPrograms.length === 0 && !loading && (
        <EmptyState hasFilters={hasActiveFilters} />
      )}
    </Box>
  );
};

export default PredefinedProgramsPage;
