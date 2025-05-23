"use client";

import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Popover,
  Typography,
  Divider,
} from "@mui/material";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    // Toggle behavior
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "user-popover" : undefined;

  return (
    <>
      <IconButton
        onClick={handleToggle}
        aria-describedby={id}
        aria-label="Open user menu"
        sx={{ p:1, ml: 2 }}
      >
        <Avatar alt="User Avatar" src="/avatar.png">RP</Avatar>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 1,
              boxShadow: 6,
              p: 2,
              minWidth: 220,
              zIndex: 1302,
            },
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src="/avatar.png" sx={{ width: 64, height: 64, mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Rohit Prakash
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Front-End Developer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            rohit.uw7@gmail.com
          </Typography>
          <Divider sx={{ my: 1, width: "100%" }} />
          <Typography
            variant="body2"
            sx={{ color: "primary.main", cursor: "pointer" }}
            onClick={handleClose}
          >
            Logout
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
