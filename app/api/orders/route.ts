// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { Order } from '@/types/order'

const filePath = path.join(process.cwd(), '/data/orders.json')

export async function POST(request: Request) {
  try {
    const newOrder: Order = await request.json()

    let orders: Order[] = []
    try {
      const fileData = await fs.readFile(filePath, 'utf-8')
      orders = JSON.parse(fileData || '[]')
    } catch (readError) {
      // If file doesn't exist or is empty/corrupt, use empty array
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
