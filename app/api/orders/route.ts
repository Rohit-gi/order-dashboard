// app/api/orders/route.ts
import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { Order } from '@/types/order'

const filePath = path.join(process.cwd(), 'public/data/orders.json')

export async function POST(request: Request) {
  try {
    const newOrder: Order = await request.json()

    const fileData = await fs.readFile(filePath, 'utf-8')
    const orders: Order[] = JSON.parse(fileData)
    orders.push(newOrder)

    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error writing file:', err)
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
  }
}
