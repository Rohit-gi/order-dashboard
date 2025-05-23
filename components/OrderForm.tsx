'use client'

import {
  Box, Button, MenuItem, TextField, Typography, Checkbox, FormControlLabel
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import { Order, OrderLine, ReasonCode } from '@/types/order'

type Props = {
  readOnly?: boolean
  defaultValues?: Partial<Order>
  onSubmit?: (order: Order) => void
}

const defaultLineItem: OrderLine = { item: '', units: '', quantity: 1, price: 0, amount: 0 }

const statusOptions = ['Pending', 'Approved', 'Shipped', 'Cancelled']
const fromLocations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Warehouse D']
const incoterms = ['EXW', 'FOB', 'CIF', 'DDP', 'DAP']
const freightTerms = ['Prepaid', 'Collect']
const reasonCodes: ReasonCode[] = ['PRICE_DISCREPANCY', 'CREDIT_HOLD', 'STOCK_SHORTAGE', 'CUSTOMER_REQUEST']

export default function OrderForm({ readOnly = false, defaultValues = {}, onSubmit }: Props) {
  const [order, setOrder] = useState<Order>({
    ...defaultValues,
    orderNumber: defaultValues.orderNumber || '',
    customer: defaultValues.customer || '',
    transactionDate: defaultValues.transactionDate || '',
    status: defaultValues.status || 'Pending',
    fromLocation: defaultValues.fromLocation || '',
    toLocation: defaultValues.toLocation || '',
    pendingApprovalReasonCode: defaultValues.pendingApprovalReasonCode || [],
    supportRep: defaultValues.supportRep || '',
    incoterm: defaultValues.incoterm || '',
    freightTerms: defaultValues.freightTerms || '',
    totalShipUnitCount: defaultValues.totalShipUnitCount || 0,
    totalQuantity: defaultValues.totalQuantity || 0,
    discountRate: defaultValues.discountRate || 0,
    billingAddress: defaultValues.billingAddress || { street: '', city: '', state: '', postalCode: '', country: '' },
    shippingAddress: defaultValues.shippingAddress || { street: '', city: '', state: '', postalCode: '', country: '' },
    earlyPickupDate: defaultValues.earlyPickupDate || '',
    latePickupDate: defaultValues.latePickupDate || '',
    lines: defaultValues.lines || [defaultLineItem],
    history: defaultValues.history || [],
  } as Order)

  const handleChange = (field: keyof Order, value: any) => {
    setOrder((prev) => ({ ...prev, [field]: value }))
  }

  const handleLineChange = (index: number, field: keyof OrderLine, value: any) => {
    const lines = [...order.lines]
    const line = { ...lines[index], [field]: value }
    line.amount = line.quantity * line.price
    lines[index] = line
    setOrder((prev) => ({ ...prev, lines }))
  }

  const addLine = () => setOrder((prev) => ({ ...prev, lines: [...prev.lines, defaultLineItem] }))
  const removeLine = (index: number) => setOrder((prev) => ({ ...prev, lines: prev.lines.filter((_, i) => i !== index) }))

  const handleCheckboxChange = (code: ReasonCode) => {
    const selected = order.pendingApprovalReasonCode.includes(code)
      ? order.pendingApprovalReasonCode.filter(c => c !== code)
      : [...order.pendingApprovalReasonCode, code]
    handleChange('pendingApprovalReasonCode', selected)
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(order)
  }

  return (
    <Box component="form" display="flex" flexDirection="column" gap={3}>
      <Typography variant="h6">Basic Information</Typography>
      <Grid container spacing={2} component="div">
        <Grid item xs={6}>
          <TextField
            fullWidth label="Order Number" value={order.orderNumber}
            onChange={(e) => handleChange('orderNumber', e.target.value)}
            disabled={readOnly} required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth label="Customer" value={order.customer}
            onChange={(e) => handleChange('customer', e.target.value)}
            disabled={readOnly} required
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth label="Transaction Date" type="date"
            value={order.transactionDate}
            onChange={(e) => handleChange('transactionDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={readOnly} required
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select fullWidth label="Status" value={order.status}
            onChange={(e) => handleChange('status', e.target.value)}
            disabled={readOnly}
          >
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select fullWidth label="From Location" value={order.fromLocation}
            onChange={(e) => handleChange('fromLocation', e.target.value)}
            disabled={readOnly}
          >
            {fromLocations.map(loc => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth label="To Location" value={order.toLocation}
            onChange={(e) => handleChange('toLocation', e.target.value)}
            disabled={readOnly} required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth label="Support Rep" value={order.supportRep}
            onChange={(e) => handleChange('supportRep', e.target.value)}
            disabled={readOnly}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            select fullWidth label="Incoterm" value={order.incoterm}
            onChange={(e) => handleChange('incoterm', e.target.value)}
            disabled={readOnly || !!order.freightTerms}
          >
            {incoterms.map(term => (
              <MenuItem key={term} value={term}>{term}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            select fullWidth label="Freight Terms" value={order.freightTerms}
            onChange={(e) => handleChange('freightTerms', e.target.value)}
            disabled={readOnly || !!order.incoterm}
          >
            {freightTerms.map(term => (
              <MenuItem key={term} value={term}>{term}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Typography variant="h6">Pending Approval Reasons</Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {reasonCodes.map(code => (
          <FormControlLabel
            key={code}
            control={
              <Checkbox
                checked={order.pendingApprovalReasonCode.includes(code)}
                onChange={() => handleCheckboxChange(code)}
                disabled={readOnly}
              />
            }
            label={code}
          />
        ))}
      </Box>

      <Typography variant="h6">Order Lines</Typography>
      {order.lines.map((line, index) => (
        <Grid container spacing={2} key={index}>
          <Grid item xs={3}>
            <TextField fullWidth label="Item" value={line.item}
              onChange={(e) => handleLineChange(index, 'item', e.target.value)}
              disabled={readOnly}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField fullWidth label="Units" value={line.units}
              onChange={(e) => handleLineChange(index, 'units', e.target.value)}
              disabled={readOnly}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField type="number" fullWidth label="Quantity" value={line.quantity}
              onChange={(e) => handleLineChange(index, 'quantity', parseInt(e.target.value))}
              disabled={readOnly}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField type="number" fullWidth label="Price" value={line.price}
              onChange={(e) => handleLineChange(index, 'price', parseFloat(e.target.value))}
              disabled={readOnly}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField fullWidth label="Amount" value={line.amount} disabled />
          </Grid>
          {!readOnly && (
            <Grid item xs={1}>
              <Button color="error" onClick={() => removeLine(index)}>Remove</Button>
            </Grid>
          )}
        </Grid>
      ))}
      {!readOnly && <Button onClick={addLine}>Add Line</Button>}

      {!readOnly && <Button variant="contained" color="primary" onClick={handleSubmit}>Submit Order</Button>}
    </Box>
  )
}
