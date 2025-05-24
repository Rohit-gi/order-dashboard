'use client'

import { useState } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Sidebar from '@/components/Sidebar'
import MobileSidebar from '@/components/MobileSidebar'
import Topbar from '@/components/Topbar'
import theme from '@/styles/theme'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const muiTheme = useTheme()
  const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'))

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {isSmallScreen ? (
              <MobileSidebar />
            ) : (
              <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            )}

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                transition: 'margin 0.3s ease',
                marginLeft: isSmallScreen ? 0 : sidebarOpen ? '240px' : '64px',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Topbar />
              <Box sx={{ p: 3, flexGrow: 1, overflowX: 'auto' }}>
                {children}
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  )
}
