'use client';

import { useParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Order } from '@/types/order';
import { fetchOrders } from '@/lib/orders';
import OrderForm from '@/components/OrderForm';
import HistoryPanel from '@/components/HistoryPanel';

export default function ViewOrderPage() {
  const { orderNumber } = useParams() as { orderNumber: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const allOrders = await fetchOrders();
      const matched = allOrders.find((o) => o.orderNumber === orderNumber);
      setOrder(matched || null);
      setLoading(false);
    };
    load();
  }, [orderNumber]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box p={4}>
        <Typography variant="h6">Order not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      display="flex"
      flexDirection="column"
      gap={4}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        View Order: {order.orderNumber}
      </Typography>

      <OrderForm readOnly defaultValues={order} />

      <HistoryPanel history={order.history} />
    </Box>
  );
}
