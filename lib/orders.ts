import orders from '@/data/orders.json'
import { Order, OrderStatus, OrderSummary } from '@/types/order'

// Simulating async order fetch

export async function fetchOrders(): Promise<Order[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enhancedOrders = (orders as Order[]).map((order) => ({
        ...order,
        amount: order.lines.reduce((sum, line) => sum + line.amount, 0),
        dueDate: order.latePickupDate,
      }));
      resolve(enhancedOrders);
    }, 300);
  });
}


export async function createOrder(order: Order): Promise<void> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  })

  if (!res.ok) {
    throw new Error('Failed to create order')
  }
}

export async function fetchOrderSummary(): Promise<OrderSummary> {
  const orders = await fetchOrders()

  const totalOrders = orders.length
  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + order.lines.reduce((lineSum, line) => lineSum + line.amount, 0),
    0
  )

  const statusCounts = orders.reduce(
    (acc, order) => {
      acc[order.status] += 1
      return acc
    },
    {
      Pending: 0,
      Approved: 0,
      Shipped: 0,
      Cancelled: 0,
    } as Record<OrderStatus, number>
  )

  return {
    totalOrders,
    totalRevenue,
    ...statusCounts,
  }
}
