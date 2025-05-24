"use client";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { Order, OrderLine } from "@/types/order";
import { OrderActionsCell } from "./OrderActionsCell";

type GridValueGetterParams<T = any> = {
  id: string | number;
  field: string;
  value: any;
  row: T;
};

const statusColors: Record<
  Order["status"],
  "warning" | "success" | "info" | "error"
> = {
  Pending: "warning",
  Approved: "success",
  Shipped: "info",
  Cancelled: "error",
};

export const getOrderColumns = (
  handleView: (id: string) => void,
  handleDelete: (id: string) => void
): GridColDef<Order>[] => [
  {
    field: "orderNumber",
    headerName: "Order #",
    flex: 1,
  },
  {
    field: "customer",
    headerName: "Customer",
    flex: 1,
  },
  {
    field: "transactionDate",
    headerName: "Created Date",
    flex: 1,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    flex: 1,
  },
  {
    field: "amount",
    headerName: "Amount ($)",
    flex: 1,
    type: "number",
    renderCell: (params: GridRenderCellParams<Order, number>) => {
      const value = params.value ?? 0;
      return `$${value.toFixed(2)}`;
    },
  },

  {
    field: "status",
    headerName: "Status",
    flex: 1,
    type: "singleSelect",
    valueOptions: ["Pending", "Approved", "Shipped", "Cancelled"],
    renderCell: (params: GridRenderCellParams<Order, string>) => (
      <Chip
        label={params.value}
        color={statusColors[params.value as Order["status"]]}
        size="small"
      />
    ),
  },
  {
    field: "actions",
    headerName: "",
    flex: 0.5,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Order>) => (
      <OrderActionsCell
        row={params.row}
        onView={handleView}
        onDelete={handleDelete}
      />
    ),
  },
];
