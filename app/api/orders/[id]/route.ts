import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

const filePath = path.join(process.cwd(), '/data/orders.json')

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    const rawData = await fs.readFile(filePath, 'utf-8')
    const orders = JSON.parse(rawData)

    const updatedOrders = orders.filter(
      (order: any) => order.orderNumber !== orderId
    )

    await fs.writeFile(filePath, JSON.stringify(updatedOrders, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting order:', err)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
