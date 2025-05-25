'use client'

import { Box, Typography, Paper } from '@mui/material'
import OrderForm from '@/components/OrderForm'
import { useRouter } from 'next/navigation'
import { createOrder } from '@/lib/orders'

export default function CreateOrderPage() {
  const router = useRouter()

  // Function to handle form submission
  const handleSubmit = async (order: any) => {
    await createOrder(order) 
    router.push('/order/list') 
  }

  return (
    <Box
    sx={{
    bgcolor: 'background.paper',
    boxShadow: 'none',
    borderRadius: 2,
    p: 3,
  }}>
      <Typography variant="h5" gutterBottom>
        Create Order
      </Typography>
      <Paper elevation={0} sx={{ p: 3 }}>
        <OrderForm onSubmit={handleSubmit} />
      </Paper>
    </Box>
  )
}
