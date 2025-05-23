'use client'

import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import theme from '@/styles/theme'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { useState } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                transition: 'margin 0.3s ease',
                marginLeft: sidebarOpen ? '240px' : '64px', // match Sidebar widths
                display: 'flex',
                flexDirection: 'column',
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
