import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import { ProgressData } from "../../types/dashboard.types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { bg } from "date-fns/locale";

interface ProgressTabProps {
  progress: ProgressData;
  loading: boolean;
  onPeriodChange: (period: "week" | "month" | "year") => void;
}

// Общ компонент за графики
const ChartCard = ({
  title,
  data,
  dataKey,
  color,
}: {
  title: string;
  data: any[];
  dataKey: string;
  color: string;
}) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                format(new Date(date), "dd/MM", { locale: bg })
              }
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) =>
                format(new Date(date), "dd MMMM yyyy", { locale: bg })
              }
            />
            <Line type="monotone" dataKey={dataKey} stroke={color} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

export const ProgressTab = ({
  progress,
  loading,
  onPeriodChange,
}: ProgressTabProps) => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: "week" | "month" | "year"
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
      onPeriodChange(newPeriod);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          aria-label="период"
        >
          <ToggleButton value="week">Седмица</ToggleButton>
          <ToggleButton value="month">Месец</ToggleButton>
          <ToggleButton value="year">Година</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ChartCard
            title="Прогрес на теглото"
            data={progress.weightHistory}
            dataKey="weight"
            color="#8884d8"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Калории"
            data={progress.caloriesHistory}
            dataKey="calories"
            color="#82ca9d"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartCard
            title="Тренировки"
            data={progress.workoutsHistory}
            dataKey="count"
            color="#ffc658"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
