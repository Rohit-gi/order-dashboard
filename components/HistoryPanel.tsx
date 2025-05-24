"use client";

import { Typography, List, ListItem, ListItemText, Paper } from "@mui/material";
import { OrderHistory } from "@/types/order";

type Props = {
  history: OrderHistory[];
};

export default function HistoryPanel({ history }: Props) {
  const sorted = [...history].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Paper
      elevation={0}
      sx={{p: 2, borderRadius: 2, bgcolor: "background.paper" }}
    >
      <Typography variant="h6" gutterBottom>
        Order History
      </Typography>
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
    </Paper>
  );
}
