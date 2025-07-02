import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "./contexts/auth.context";
import { theme } from "./theme/theme";
import RouterProvider from "./routes/RouterProvider";
import "./config/axios.config";
import { ToastProvider } from "./components/Toast/ToastProvider";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ToastProvider>
            <AuthProvider>
              <RouterProvider />
            </AuthProvider>
          </ToastProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
