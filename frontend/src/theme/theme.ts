import { createTheme } from '@mui/material/styles';
import { colors } from './palette';
import { typography } from './typography';
import { components } from './components';

declare module '@mui/material/styles' {
  interface TypeBackground {
    gradient: {
      primary: string;
      secondary: string;
      mixed: string;
    }
  }
  interface TypeText {
    light: string;
  }
}

// Основната тема
export const theme = createTheme({
  palette: colors,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
});

export const gradients = {
  primary: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  secondary: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
};

export const commonStyles = {
  glassEffect: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: 2,
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
};

export * from './styles';