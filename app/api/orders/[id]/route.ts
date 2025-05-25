import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

// Path to the local orders JSON file
const filePath = path.join(process.cwd(), '/data/orders.json')

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    // Read the existing orders from the JSON file
    const rawData = await fs.readFile(filePath, 'utf-8')
    const orders = JSON.parse(rawData)

    // Filter out the order with the specified orderId
    const updatedOrders = orders.filter(
      (order: any) => order.orderNumber !== orderId
    )
    // Write the updated orders back to the JSON file
    await fs.writeFile(filePath, JSON.stringify(updatedOrders, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error deleting order:', err)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}
