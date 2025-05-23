'use client'

import { Box, IconButton } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import UserMenu from './UserMenu'

export default function Topbar() {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1301,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        paddingX: 2,
        paddingY: 1,
        height: '64px',
      }}
    >
      <IconButton color="inherit" aria-label="notifications">
        <NotificationsIcon />
      </IconButton>
      <UserMenu />
    </Box>
  )
}
