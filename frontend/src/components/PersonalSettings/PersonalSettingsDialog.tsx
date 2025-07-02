import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PersonalSettingsForm } from "./PersonalSettingsForm";
import { useAuth } from "../../contexts/auth.context";
import { usePersonalSettings } from "../../hooks/usePersonalSettings";
import { PersonalSettings } from "../../types/personal-settings.types";
import { useNavigate } from "react-router-dom";

interface PersonalSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const PersonalSettingsDialog: React.FC<PersonalSettingsDialogProps> = ({
  open,
  onClose,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { settings, setSettings, loading, save, calculating } =
    usePersonalSettings(user?.id);

  const handleSave = async (data: PersonalSettings) => {
    await save(data);
    onClose();
    navigate("/app/home");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Персонални настройки
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <PersonalSettingsForm
          settings={settings}
          setSettings={setSettings}
          onSave={handleSave}
          loading={loading}
          userId={user?.id || 0}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PersonalSettingsDialog;
