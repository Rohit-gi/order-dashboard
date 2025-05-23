'use client'

import { Box, Typography, List, ListItem, ListItemText } from '@mui/material'
import { OrderHistory } from '@/types/order'

type Props = {
  history: OrderHistory[]
}

export default function HistoryPanel({ history }: Props) {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Order History</Typography>
      <List dense>
        {sorted.map((entry, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={entry.event}
              secondary={new Date(entry.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
