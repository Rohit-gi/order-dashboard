import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#1A1A2E',
    },
    primary: { main: '#3b82f6' },
    secondary: { main: '#64748b' },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontWeightBold: 700,
    fontFamily: 'Inter, sans-serif',
  },
})

export default theme
