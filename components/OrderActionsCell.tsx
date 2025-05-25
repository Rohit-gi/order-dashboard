'use client';

import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Order } from '@/types/order';

type Props = {
  row: Order;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
};

// Action menu for each order row: View or Delete
export function OrderActionsCell({ row, onView, onDelete }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  // Handle delete with API call and local state update
  const handleDelete = async () => {
    try {
      handleClose();
      const res = await fetch(`/api/orders/${row.orderNumber}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        console.error('Failed to delete order:', await res.text());
        return;
      }

      onDelete(row.orderNumber);
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            onView(row.orderNumber);
          }}
        >
          View
        </MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}
