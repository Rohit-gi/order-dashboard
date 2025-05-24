'use client'

import { useState } from 'react'
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  ClickAwayListener,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  List as ListIcon,
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  const handleNavigate = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!open && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1400,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 2,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer Overlay */}
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: 240,
              height: '100vh',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              zIndex: 1350,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease',
            }}
          >
            <List>
              <ListItemButton onClick={() => handleNavigate('/home')}>
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>

              <ListItemButton onClick={() => setSubmenuOpen(!submenuOpen)}>
                <ListItemIcon><ListIcon /></ListItemIcon>
                <ListItemText primary="Orders" />
                {submenuOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/order/create')}>
                    <ListItemIcon><AddIcon /></ListItemIcon>
                    <ListItemText primary="Create" />
                  </ListItemButton>
                  <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate('/order/list')}>
                    <ListItemIcon><ListIcon /></ListItemIcon>
                    <ListItemText primary="List" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
            <Divider />
          </Box>
        </ClickAwayListener>
      )}
    </>
  )
}
