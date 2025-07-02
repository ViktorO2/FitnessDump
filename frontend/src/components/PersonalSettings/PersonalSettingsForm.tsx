import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import {
  PersonalSettings,
  GoalType,
  Gender,
  ActivityLevel,
} from "../../types/personal-settings.types";
import React from "react";

const goalOptions: { value: GoalType; label: string }[] = [
  { value: "LOSE_WEIGHT", label: "Отслабване" },
  { value: "GAIN_WEIGHT", label: "Качване на мускулна маса и тегло" },
  { value: "MAINTAIN_WEIGHT", label: "Поддържане" },
];
const genderOptions: { value: Gender; label: string }[] = [
  { value: "MALE", label: "Мъж" },
  { value: "FEMALE", label: "Жена" },
];
const activityOptions: { value: ActivityLevel; label: string }[] = [
  { value: "SEDENTARY", label: "Седящ" },
  { value: "LIGHTLY_ACTIVE", label: "Леко активен" },
  { value: "MODERATELY_ACTIVE", label: "Умерено активен" },
  { value: "VERY_ACTIVE", label: "Много активен" },
  { value: "EXTRA_ACTIVE", label: "Екстра активен" },
];

interface Props {
  settings: Partial<PersonalSettings>;
  setSettings: (s: Partial<PersonalSettings>) => void;
  onSave: (data: PersonalSettings) => void;
  loading: boolean;
  userId: number;
}

export const PersonalSettingsForm: React.FC<Props> = ({
  settings,
  setSettings,
  onSave,
  loading,
  userId,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...settings, userId } as PersonalSettings);
  };

  if (loading) return <Typography>Зареждане...</Typography>;

  return (
    <Paper sx={{ p: 3, mt: 3, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Персонални настройки
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Текущо тегло (кг)"
          name="currentWeight"
          type="number"
          value={settings.currentWeight || ""}
          onChange={handleChange}
          required
        />
        <TextField
          label="Целево тегло (кг)"
          name="targetWeight"
          type="number"
          value={settings.targetWeight || ""}
          onChange={handleChange}
          required
        />
        <TextField
          label="Височина (см)"
          name="height"
          type="number"
          value={settings.height || ""}
          onChange={handleChange}
          required
        />
        <TextField
          label="Възраст"
          name="age"
          type="number"
          value={settings.age || ""}
          onChange={handleChange}
          required
        />
        <TextField
          select
          label="Пол"
          name="gender"
          value={settings.gender || ""}
          onChange={handleChange}
          required
        >
          {genderOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Цел"
          name="goal"
          value={settings.goal || ""}
          onChange={handleChange}
          required
        >
          {goalOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Активност"
          name="activityLevel"
          value={settings.activityLevel || ""}
          onChange={handleChange}
          required
        >
          {activityOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Запази
        </Button>
      </Box>
      {(settings.bmr || settings.tdee) && (
        <Box sx={{ mt: 2 }}>
          {settings.bmr && <Typography>BMR: {settings.bmr}</Typography>}
          {settings.tdee && <Typography>TDEE: {settings.tdee}</Typography>}
        </Box>
      )}
    </Paper>
  );
};
