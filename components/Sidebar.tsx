'use client'

import { useState } from 'react'
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Home as HomeIcon,
  Add as AddIcon,
  List as ListIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

type SidebarProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const router = useRouter()
  const [submenuOpen, setSubmenuOpen] = useState(false)

  const handleToggle = () => {
    if (open) setSubmenuOpen(false) // auto-close submenu when collapsing
    setOpen(!open)
  }

  return (
    <Box
      component="nav"
      sx={{
        width: open ? 240 : 64,
        transition: 'width 0.3s',
        bgcolor: 'background.paper',
        height: '100vh',
        borderRight: '1px solid',
        borderColor: 'divider',
        position: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1300
      }}
    >
      <IconButton
        onClick={handleToggle}
        sx={{ m: 1, alignSelf: open ? 'flex-end' : 'center' }}
        aria-label={open ? 'Collapse menu' : 'Expand menu'}
      >
        <MenuIcon />
      </IconButton>

      <List component="nav" sx={{ flexGrow: 1 }}>
        <Tooltip title="Home" placement="right" disableHoverListener={open}>
          <ListItemButton onClick={() => router.push('/home')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItemButton>
        </Tooltip>

        <Tooltip title="Orders" placement="right" disableHoverListener={open}>
          <ListItemButton onClick={() => setSubmenuOpen(!submenuOpen)}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            {open && <ListItemText primary="Order" />}
            {open && (submenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </Tooltip>

        <Collapse in={submenuOpen && open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Tooltip title="Create Order" placement="right" disableHoverListener={open}>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => router.push('/order/create')}
              >
                <ListItemIcon><AddIcon /></ListItemIcon>
                {open && <ListItemText primary="Create" />}
              </ListItemButton>
            </Tooltip>

            <Tooltip title="Order List" placement="right" disableHoverListener={open}>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => router.push('/order/list')}
              >
                <ListItemIcon><ListIcon /></ListItemIcon>
                {open && <ListItemText primary="List" />}
              </ListItemButton>
            </Tooltip>
          </List>
        </Collapse>
      </List>
    </Box>
  )
}
