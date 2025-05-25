// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { Order } from '@/types/order'

const filePath = path.join(process.cwd(), '/data/orders.json')

export async function POST(request: Request) {
  try {
    // Parsing the new order from the request body
    const newOrder: Order = await request.json()

    let orders: Order[] = []
    try {
      // Reading and parsing existing orders
      const fileData = await fs.readFile(filePath, 'utf-8')
      orders = JSON.parse(fileData || '[]')
    } catch (readError) {
      console.warn('Orders file missing or invalid. Initializing new array.')
      orders = []
    }

    orders.push(newOrder)

    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error writing file:', err)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}
