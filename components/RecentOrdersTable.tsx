'use client'

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material'
import { Order } from '@/types/order'

type Props = {
  orders: Order[]
}

export default function RecentOrdersTable({ orders }: Props) {
  return (
    <Box sx={{ bgcolor: 'background.paper', boxShadow: '2', p: 4, pb:6, borderRadius: 2, mt: 4 }}>
      <Typography variant="h6" fontWeight={500} mb={2}>
        Recent Orders
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order #</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount ($)</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.slice(0, 5).map((order) => {
            const amount = order.lines.reduce((sum, l) => sum + l.amount, 0)
            return (
              <TableRow key={order.orderNumber} sx={{ height: 50 }}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.transactionDate}</TableCell>
                <TableCell>{amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    color={
                      order.status === 'Approved'
                        ? 'success'
                        : order.status === 'Pending'
                        ? 'warning'
                        : order.status === 'Shipped'
                        ? 'info'
                        : 'error'
                    }
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
