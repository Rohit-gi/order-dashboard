import { Box, Chip, Paper, Typography } from '@mui/material';

interface SummaryProps {
  summary: {
    total: number;
    Pending: number;
    Approved: number;
    Shipped: number;
    Cancelled: number;
  };
}

export default function OrderSummary({ summary }: SummaryProps) {
  return (
    <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle2">Summary</Typography>
      <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
        <Chip label={`Total: ${summary.total}`} />
        <Chip color="warning" label={`Pending: ${summary.Pending}`} />
        <Chip color="success" label={`Approved: ${summary.Approved}`} />
        <Chip color="info" label={`Shipped: ${summary.Shipped}`} />
        <Chip color="error" label={`Cancelled: ${summary.Cancelled}`} />
      </Box>
    </Paper>
  );
}
