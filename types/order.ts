// types/order.ts

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderLine {
  item: string
  units: string
  quantity: number
  price: number
  amount: number
}

export interface OrderHistory {
  timestamp: string
  event: string
}

export type ReasonCode =
  | 'PRICE_DISCREPANCY'
  | 'CREDIT_HOLD'
  | 'STOCK_SHORTAGE'
  | 'CUSTOMER_REQUEST'

export type OrderStatus = 'Pending' | 'Approved' | 'Shipped' | 'Cancelled'

export interface Order {
  orderNumber: string
  customer: string
  transactionDate: string
  status: OrderStatus
  fromLocation: string
  toLocation: string
  pendingApprovalReasonCode: ReasonCode[]
  supportRep: string
  incoterm: string
  freightTerms: string
  totalShipUnitCount: number
  totalQuantity: number
  discountRate: number
  billingAddress: Address
  shippingAddress: Address
  earlyPickupDate: string
  latePickupDate: string
  lines: OrderLine[]
  history: OrderHistory[]
}

export interface OrderSummary {
  totalOrders: number
  totalRevenue: number
  Pending: number
  Approved: number
  Shipped: number
  Cancelled: number
}
