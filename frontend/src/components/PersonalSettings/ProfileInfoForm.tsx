import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { User } from "../../types/auth.types";

interface ProfileInfoFormProps {
  user: User;
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  user,
  onSave,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
    setSuccess(false);
  };

  const validate = () => {
    if (!form.firstName.trim()) return "Името е задължително.";
    if (!form.lastName.trim()) return "Фамилията е задължителна.";
    if (!form.email.trim()) return "Имейлът е задължителен.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Невалиден имейл адрес.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    try {
      await onSave(form);
      setSuccess(true);
    } catch (e) {
      setFormError("Грешка при запис.");
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Лични данни
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Име"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Фамилия"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Имейл"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {formError && <Alert severity="error">{formError}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Успешно записано!</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Запази
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileInfoForm;
