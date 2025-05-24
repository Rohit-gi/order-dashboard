'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import { Order } from '@/types/order';

type Props = {
  orders: Order[];
};

export default function RecentOrdersTable({ orders }: Props) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 2,
        p: 4,
        pb: 6,
        borderRadius: 2,
        mt: 4,
      }}
    >
      <Typography variant="h6" fontWeight={500} mb={2}>
        Recent Orders
      </Typography>

      <Box sx={{ overflowX: 'auto', p: 0 }}>
        <Table
          size="small"
          sx={{
            width: '100%',
            minWidth: 600,
            tableLayout: 'fixed',
            borderCollapse: 'collapse',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '20%', textAlign: 'left', px: 2, py: 1, fontWeight: 500 }}>
                Order #
              </TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'left', px: 2, py: 1, fontWeight: 500 }}>
                Customer
              </TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'center', px: 2, py: 1, fontWeight: 500 }}>
                Date
              </TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'center', px: 2, py: 1, fontWeight: 500 }}>
                Amount ($)
              </TableCell>
              <TableCell sx={{ width: '20%', textAlign: 'center', px: 2, py: 1, fontWeight: 500 }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.slice(0, 5).map((order) => {
              const amount = order.lines.reduce((sum, l) => sum + l.amount, 0);
              const statusColor =
                order.status === 'Approved'
                  ? 'success'
                  : order.status === 'Pending'
                  ? 'warning'
                  : order.status === 'Shipped'
                  ? 'info'
                  : 'error';

              return (
                <TableRow key={order.orderNumber} sx={{ height: 50 }}>
                  <TableCell sx={{ width: '20%', textAlign: 'left', px: 2, py: 1 }}>
                    {order.orderNumber}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'left', px: 2, py: 1 }}>
                    {order.customer}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center', px: 2, py: 1 }}>
                    {order.transactionDate}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center', px: 2, py: 1 }}>
                    {amount.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'center', px: 2, py: 1 }}>
                    <Chip
                      label={order.status}
                      size="small"
                      color={statusColor}
                      sx={{ mx: 'auto' }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
  