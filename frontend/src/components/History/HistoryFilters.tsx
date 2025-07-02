import { Box, TextField, Button, Paper, Grid } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { HistoryFilters as Filters } from "../../types/history.types";

interface HistoryFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onApply: () => void;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker
            label="От дата"
            value={filters.startDate || null}
            onChange={(date) =>
              onFilterChange({ startDate: date || undefined })
            }
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <DatePicker
            label="До дата"
            value={filters.endDate || null}
            onChange={(date) => onFilterChange({ endDate: date || undefined })}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Тип"
            value={filters.type || ""}
            onChange={(e) => onFilterChange({ type: e.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={onApply}
              sx={{ minWidth: 120 }}
            >
              Приложи филтри
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
