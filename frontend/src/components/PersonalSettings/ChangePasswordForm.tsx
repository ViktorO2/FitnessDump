import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { validatePassword } from "../../utils/validation";

interface ChangePasswordFormProps {
  onSave: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSave,
  loading,
  error,
}) => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
    setSuccess(false);
  };

  const validate = () => {
    if (!form.currentPassword) return "Въведете текущата парола.";
    if (!form.newPassword) return "Въведете нова парола.";
    if (form.newPassword !== form.confirmPassword)
      return "Паролите не съвпадат.";
    const passwordErrors = validatePassword(form.newPassword);
    if (passwordErrors.length > 0) return passwordErrors.join("\n");
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
      await onSave({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      setFormError("Грешка при смяна на паролата.");
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Смяна на парола
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Текуща парола"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          required
        />
        <TextField
          label="Нова парола"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <TextField
          label="Потвърди нова парола"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {formError && <Alert severity="error">{formError}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {success && (
          <Alert severity="success">Паролата е сменена успешно!</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Смени паролата
        </Button>
      </Box>
    </Paper>
  );
};

export default ChangePasswordForm;
