// types/order.ts

// Represents a shipping or billing address
export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Represents a single line item in an order
export interface OrderLine {
  item: string
  units: string
  quantity: number
  price: number
  amount: number
}

// Represents a timestamped event in order history
export interface OrderHistory {
  timestamp: string
  event: string
}

// Coded reasons for pending approval
export type ReasonCode =
  | 'PRICE_DISCREPANCY'
  | 'CREDIT_HOLD'
  | 'STOCK_SHORTAGE'
  | 'CUSTOMER_REQUEST'

// Valid order statuses
export type OrderStatus = 'Pending' | 'Approved' | 'Shipped' | 'Cancelled'

// Main order object structure
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

// Summary counts used for dashboard or filter chips
export interface OrderSummary {
  totalOrders: number
  totalRevenue: number
  Pending: number
  Approved: number
  Shipped: number
  Cancelled: number
}
