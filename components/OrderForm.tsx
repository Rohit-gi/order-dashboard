"use client";

import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { Order, OrderLine, ReasonCode } from "@/types/order";

const defaultLineItem: OrderLine = {
  item: "",
  units: "",
  quantity: 1,
  price: 0,
  amount: 0,
};

const statusOptions = ["Pending", "Approved", "Shipped", "Cancelled"];
const fromLocations = ["Warehouse A", "Warehouse B", "Warehouse C", "Warehouse D"];
const incoterms = ["EXW", "FOB", "CIF", "DDP", "DAP"];
const freightTerms = ["Prepaid", "Collect"];
const reasonCodes: ReasonCode[] = [
  "PRICE_DISCREPANCY",
  "CREDIT_HOLD",
  "STOCK_SHORTAGE",
  "CUSTOMER_REQUEST",
];

type Props = {
  readOnly?: boolean;
  defaultValues?: Partial<Order>;
  onSubmit?: (order: Order) => void;
};

export default function OrderForm({ readOnly = false, defaultValues = {}, onSubmit }: Props) {
  const [order, setOrder] = useState<Order>({
    ...defaultValues,
    orderNumber: defaultValues.orderNumber || "",
    customer: defaultValues.customer || "",
    transactionDate: defaultValues.transactionDate || "",
    status: defaultValues.status || "Pending",
    fromLocation: defaultValues.fromLocation || "",
    toLocation: defaultValues.toLocation || "",
    pendingApprovalReasonCode: defaultValues.pendingApprovalReasonCode || [],
    supportRep: defaultValues.supportRep || "",
    incoterm: defaultValues.incoterm || "",
    freightTerms: defaultValues.freightTerms || "",
    totalShipUnitCount: defaultValues.totalShipUnitCount || 0,
    totalQuantity: defaultValues.totalQuantity || 0,
    discountRate: defaultValues.discountRate || 0,
    billingAddress: defaultValues.billingAddress || {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    shippingAddress: defaultValues.shippingAddress || {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    earlyPickupDate: defaultValues.earlyPickupDate || "",
    latePickupDate: defaultValues.latePickupDate || "",
    lines: defaultValues.lines || [defaultLineItem],
    history: defaultValues.history || [],
  } as Order);

  const handleChange = (field: keyof Order, value: any) => {
    setOrder((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    type: "billingAddress" | "shippingAddress",
    field: string,
    value: string
  ) => {
    setOrder((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleLineChange = (index: number, field: keyof OrderLine, value: any) => {
    const lines = [...order.lines];
    const line = { ...lines[index], [field]: value };
    line.amount = (line.quantity || 0) * (line.price || 0);
    lines[index] = line;
    setOrder((prev) => ({ ...prev, lines }));
  };

  const addLine = () => setOrder((prev) => ({ ...prev, lines: [...prev.lines, defaultLineItem] }));

  const removeLine = (index: number) =>
    setOrder((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));

  const handleCheckboxChange = (code: ReasonCode) => {
    const selected = order.pendingApprovalReasonCode.includes(code)
      ? order.pendingApprovalReasonCode.filter((c) => c !== code)
      : [...order.pendingApprovalReasonCode, code];
    handleChange("pendingApprovalReasonCode", selected);
  };

  const isValid = (): boolean => {
    const requiredFields = [
      order.orderNumber,
      order.customer,
      order.transactionDate,
      order.status,
      order.fromLocation,
      order.toLocation,
    ];
    if (requiredFields.some((f) => f.trim() === "")) return false;
    if (!order.incoterm && !order.freightTerms) return false;
    if (order.incoterm && order.freightTerms) return false;
    if (order.lines.length === 0) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isValid()) {
      alert("Please complete all required fields, add at least one line item, and ensure either Incoterm or Freight Terms is set (not both).")
      return;
    }
    if (onSubmit) onSubmit(order);
  };

  return (
    <Box component="form" display="flex" flexDirection="column" gap={3} sx={{ p: 3 }}>
      <Typography variant="h6">Basic Information</Typography>
      <Grid container spacing={2}>
        {[{ label: "Order Number (ORD-0000)", field: "orderNumber", required: true },
          { label: "Customer", field: "customer", required: true },
          { label: "Transaction Date", field: "transactionDate", type: "date", required: true, shrink: true },
          { label: "Status", field: "status", options: statusOptions },
          { label: "From Location", field: "fromLocation", options: fromLocations },
          { label: "To Location", field: "toLocation", required: true },
          { label: "Support Rep", field: "supportRep" },
        ].map(({ label, field, options, required, type = "text", shrink }) => (
          <Grid key={field} size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={label}
              value={order[field as keyof Order]}
              onChange={(e) => handleChange(field as keyof Order, e.target.value)}
              select={!!options}
              type={type}
              required={required}
              slotProps={{
                inputLabel: shrink ? { shrink: true } : undefined,
              }}
            >
              {options?.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}

        {[{ label: "Incoterm", field: "incoterm", options: incoterms, disabled: !!order.freightTerms },
          { label: "Freight Terms", field: "freightTerms", options: freightTerms, disabled: !!order.incoterm },
          { label: "Total Ship Unit Count", field: "totalShipUnitCount", type: "number" },
          { label: "Total Quantity", field: "totalQuantity", type: "number" },
          { label: "Discount Rate", field: "discountRate", type: "number" },
          { label: "Early Pickup Date", field: "earlyPickupDate", type: "date", shrink: true },
          { label: "Late Pickup Date", field: "latePickupDate", type: "date", shrink: true },
        ].map(({ label, field, type = "text", options, disabled, shrink }) => (
          <Grid key={field} size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={label}
              value={
                type === "number"
                  ? order[field as keyof Order] === 0
                    ? ""
                    : Number(order[field as keyof Order])
                  : order[field as keyof Order]
              }
              onChange={(e) => {
                const raw = e.target.value;
                const numericValue = parseFloat(raw.replace(/^0+(?!\.)/, ""));
                handleChange(
                  field as keyof Order,
                  type === "number" ? (isNaN(numericValue) ? 0 : numericValue) : raw
                );
              }}
              type={type}
              select={!!options}
              disabled={disabled}
              slotProps={{
                inputLabel: shrink ? { shrink: true } : undefined,
                htmlInput: type === "number" ? { min: 0 } : undefined,
              }}
            >
              {options?.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>
          </Grid>
        ))}

        {(["street", "city", "state", "postalCode", "country"] as const).map((field) => (
          <Grid key={`billing-${field}`} size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={`Billing ${field}`}
              value={order.billingAddress[field]}
              onChange={(e) => handleAddressChange("billingAddress", field, e.target.value)}
            />
          </Grid>
        ))}
        {(["street", "city", "state", "postalCode", "country"] as const).map((field) => (
          <Grid key={`shipping-${field}`} size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label={`Shipping ${field}`}
              value={order.shippingAddress[field]}
              onChange={(e) => handleAddressChange("shippingAddress", field, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6">Pending Approval Reasons</Typography>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {reasonCodes.map((code) => (
          <FormControlLabel
            key={code}
            control={
              <Checkbox
                checked={order.pendingApprovalReasonCode.includes(code)}
                onChange={() => handleCheckboxChange(code)}
              />
            }
            label={code}
          />
        ))}
      </Box>

      <Typography variant="h6">Order Lines</Typography>
      {order.lines.map((line, index) => (
        <Box
          key={index}
          sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper", boxShadow: 1 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                label="Item"
                value={line.item}
                onChange={(e) => handleLineChange(index, "item", e.target.value)}
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                fullWidth
                label="Units"
                value={line.units}
                onChange={(e) => handleLineChange(index, "units", e.target.value)}
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                type="number"
                fullWidth
                label="Quantity"
                value={line.quantity === 0 ? "" : line.quantity}
                onChange={(e) => {
                  const val = parseFloat(e.target.value.replace(/^0+(?!\.)/, ""));
                  handleLineChange(index, "quantity", isNaN(val) ? 0 : val);
                }}
                slotProps={{ htmlInput: { min: 0 } }}
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                type="number"
                fullWidth
                label="Price"
                value={line.price === 0 ? "" : line.price}
                onChange={(e) => {
                  const val = parseFloat(e.target.value.replace(/^0+(?!\.)/, ""));
                  handleLineChange(index, "price", isNaN(val) ? 0 : val);
                }}
                slotProps={{ htmlInput: { min: 0 } }}
                disabled={readOnly}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField fullWidth label="Amount (auto)" value={line.amount} disabled />
            </Grid>
            {!readOnly && (
              <Grid size={{ xs: 12, md: 1 }}>
                <Button variant="text" color="error" onClick={() => removeLine(index)}>
                  Remove
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      ))}

      {!readOnly && (
        <>
          <Button
            variant="contained"
            onClick={addLine}
            sx={{
              bgcolor: "#323949",
              color: "white",
              "&:hover": { bgcolor: "#212129" },
            }}
          >
            Add Line
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Order
          </Button>
        </>
      )}
    </Box>
  );
}
