import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import { Visibility as ViewIcon } from "@mui/icons-material";
import { useAuth } from "../contexts/auth.context";
import { usePersonalSettings } from "../hooks/usePersonalSettings";
import { PersonalSettingsForm } from "../components/PersonalSettings/PersonalSettingsForm";
import { PersonalSettings } from "../types/personal-settings.types";
import { ChangePasswordDTO } from "../types/auth.types";
import ProfileInfoForm from "../components/PersonalSettings/ProfileInfoForm";
import ChangePasswordForm from "../components/PersonalSettings/ChangePasswordForm";
import authService from "../services/auth.service";
import { useState } from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  const {
    settings,
    setSettings,
    loading,
    save,
    calculating,
    getPersonalSettingsById,
    updatePersonalSettingsById,
  } = usePersonalSettings(user?.id);

  // State for profile info
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // State for password change
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // State for viewing settings by ID
  const [viewByIdDialogOpen, setViewByIdDialogOpen] = useState(false);
  const [settingsId, setSettingsId] = useState("");
  const [viewByIdLoading, setViewByIdLoading] = useState(false);
  const [viewByIdError, setViewByIdError] = useState<string | null>(null);
  const [foundSettings, setFoundSettings] = useState<PersonalSettings | null>(
    null
  );

  const handleSave = async (data: PersonalSettings) => {
    await save(data);
  };

  const handleProfileSave = async (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      await authService.updateProfile(data);
    } catch (e: any) {
      setProfileError(e?.message || "Грешка при запис на личните данни");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      const changePasswordData: ChangePasswordDTO = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.newPassword,
        newPasswordMatching: true,
      };
      await authService.changePassword(changePasswordData);
    } catch (e: any) {
      setPasswordError(e?.message || "Грешка при смяна на паролата");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleViewSettingsById = async () => {
    if (!settingsId.trim()) return;

    setViewByIdLoading(true);
    setViewByIdError(null);
    setFoundSettings(null);

    try {
      const settings = await getPersonalSettingsById(parseInt(settingsId));
      setFoundSettings(settings);
    } catch (err: any) {
      setViewByIdError(err.message || "Настройките не са намерени");
    } finally {
      setViewByIdLoading(false);
    }
  };

  const handleUpdateSettingsById = async (data: PersonalSettings) => {
    if (!settingsId.trim()) return;

    try {
      await updatePersonalSettingsById(parseInt(settingsId), data);
      setViewByIdDialogOpen(false);
      setSettingsId("");
      setFoundSettings(null);
    } catch (err: any) {
      setViewByIdError(err.message || "Грешка при обновяване на настройките");
    }
  };

  const handleFoundSettingsChange = (
    newSettings: Partial<PersonalSettings>
  ) => {
    if (foundSettings) {
      setFoundSettings({ ...foundSettings, ...newSettings });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Профил
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={() => setViewByIdDialogOpen(true)}
        >
          Преглед на настройки по ID
        </Button>
      </Box>

      {user && (
        <ProfileInfoForm
          user={user}
          onSave={handleProfileSave}
          loading={profileLoading}
          error={profileError}
        />
      )}
      <ChangePasswordForm
        onSave={handleChangePassword}
        loading={passwordLoading}
        error={passwordError}
      />
      {settings && (
        <PersonalSettingsForm
          settings={settings}
          setSettings={(newSettings: Partial<PersonalSettings>) =>
            setSettings((prev) => (prev ? { ...prev, ...newSettings } : null))
          }
          onSave={handleSave}
          loading={loading}
          userId={user?.id || 0}
        />
      )}

      {/* View Settings by ID Dialog */}
      <Dialog
        open={viewByIdDialogOpen}
        onClose={() => setViewByIdDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Преглед на лични настройки по ID</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="ID на настройките"
              type="number"
              value={settingsId}
              onChange={(e) => setSettingsId(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleViewSettingsById}
              disabled={viewByIdLoading || !settingsId.trim()}
              fullWidth
              sx={{ mb: 2 }}
            >
              {viewByIdLoading ? "Търсене..." : "Търси"}
            </Button>

            {viewByIdError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {viewByIdError}
              </Alert>
            )}

            {foundSettings && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Настройките са намерени!
                </Alert>
                <PersonalSettingsForm
                  settings={foundSettings}
                  setSettings={handleFoundSettingsChange}
                  onSave={handleUpdateSettingsById}
                  loading={viewByIdLoading}
                  userId={parseInt(settingsId)}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewByIdDialogOpen(false)}>Затвори</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;
