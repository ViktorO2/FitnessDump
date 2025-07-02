import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ProgressiveLoadStep } from "../../types/program.types";

interface ProgressiveLoadSummaryProps {
  steps: ProgressiveLoadStep[];
}

const ProgressiveLoadSummary: React.FC<ProgressiveLoadSummaryProps> = ({
  steps,
}) => {
  if (steps.length === 0) return null;

  const calculateProgress = () => {
    if (steps.length < 2) return null;
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];

    return {
      weight: {
        value: lastStep.weight - firstStep.weight,
        percent: firstStep.weight
          ? ((lastStep.weight - firstStep.weight) / firstStep.weight) * 100
          : 0,
      },
      intensity: {
        value: lastStep.intensity - firstStep.intensity,
      },
      volume: {
        start: firstStep.sets * firstStep.reps * firstStep.weight,
        end: lastStep.sets * lastStep.reps * lastStep.weight,
      },
    };
  };

  const progress = calculateProgress();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Обобщение на прогреса
      </Typography>

      {progress && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            За {steps.length} седмици:
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
              mb: 2,
            }}
          >
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                backgroundColor:
                  progress.weight.value > 0 ? "success.light" : "error.light",
                color: "white",
              }}
            >
              <Typography variant="h6">
                {progress.weight.value > 0 ? "+" : ""}
                {progress.weight.value.toFixed(1)} кг
              </Typography>
              <Typography variant="caption">
                {progress.weight.percent > 0 ? "+" : ""}
                {progress.weight.percent.toFixed(1)}% тегло
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                backgroundColor:
                  progress.intensity.value > 0
                    ? "primary.light"
                    : "warning.light",
                color: "white",
              }}
            >
              <Typography variant="h6">
                {progress.intensity.value > 0 ? "+" : ""}
                {progress.intensity.value}%
              </Typography>
              <Typography variant="caption">интензивност</Typography>
            </Paper>

            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                backgroundColor:
                  progress.volume.end > progress.volume.start
                    ? "success.light"
                    : "error.light",
                color: "white",
              }}
            >
              <Typography variant="h6">
                {(
                  ((progress.volume.end - progress.volume.start) /
                    progress.volume.start) *
                  100
                ).toFixed(1)}
                %
              </Typography>
              <Typography variant="caption">обем (кг × повторения)</Typography>
            </Paper>
          </Box>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Седмица</TableCell>
              <TableCell align="right">Серии</TableCell>
              <TableCell align="right">Повт.</TableCell>
              <TableCell align="right">Тегло</TableCell>
              <TableCell align="right">Почивка</TableCell>
              <TableCell align="right">Интенз.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {steps.map((step) => (
              <TableRow
                key={step.week}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <TableCell component="th" scope="row">
                  {step.week}
                </TableCell>
                <TableCell align="right">{step.sets}</TableCell>
                <TableCell align="right">{step.reps}</TableCell>
                <TableCell align="right">{step.weight} кг</TableCell>
                <TableCell align="right">{step.restTime} сек</TableCell>
                <TableCell align="right">{step.intensity}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProgressiveLoadSummary;
