import React from "react";
import { Box } from "@mui/material";
import CalorieCalculator from "../components/Calculator/CalorieCalculator";

const CalorieCalculatorPage: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", my: 4 }}>
      <CalorieCalculator />
    </Box>
  );
};

export default CalorieCalculatorPage;
