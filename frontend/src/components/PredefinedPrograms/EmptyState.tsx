import React from "react";
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
  hasFilters: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
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
        Няма намерени програми
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {hasFilters
          ? "Променете филтрите, за да видите повече програми"
          : "В момента няма налични готови програми"}
      </Typography>
    </Box>
  );
};

export default EmptyState;
