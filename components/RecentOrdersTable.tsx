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
import { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { fetchOrders } from '@/lib/orders'; 

// This component fetches and displays the most recent orders in a table format.
export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders(); 
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  // Get last 5 orders, showing newest first
  const recentOrders = orders.slice(-5).reverse(); 

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

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
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
                <TableCell sx={{ fontWeight: 500, textAlign: 'left' }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 500, textAlign: 'left' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 500, textAlign: 'center' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 500, textAlign: 'center' }}>Amount ($)</TableCell>
                <TableCell sx={{ fontWeight: 500, textAlign: 'center' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => {
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
                  <TableRow key={order.orderNumber} sx={{ height: 50}}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{order.transactionDate}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{amount.toFixed(2)}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Chip label={order.status} color={statusColor} size="small" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
