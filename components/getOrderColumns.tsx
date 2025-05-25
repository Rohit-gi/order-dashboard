"use client";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { Order, OrderLine } from "@/types/order";
import { OrderActionsCell } from "./OrderActionsCell";

// Mapping each order status to a MUI Chip color
const statusColors: Record<
  Order["status"],
  "warning" | "success" | "info" | "error"
> = {
  Pending: "warning",
  Approved: "success",
  Shipped: "info",
  Cancelled: "error",
};

// Defining column structure for the Orders DataGrid
export const getOrderColumns = (
  handleView: (id: string) => void,
  handleDelete: (id: string) => void
): GridColDef<Order>[] => [
  {
    field: "orderNumber",
    headerName: "Order #",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "customer",
    headerName: "Customer",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "transactionDate",
    headerName: "Created Date",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "amount",
    headerName: "Amount ($)",
    flex: 1,
    align: "center",
    headerAlign: "center",

    // Calculating the total amount from the order lines
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
    align: "center",
    headerAlign: "center",

    type: "singleSelect",
    valueOptions: ["Pending", "Approved", "Shipped", "Cancelled"],

    // Using a custom render function to display the status with a colored Chip
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
    align: "center",
    headerAlign: "center",

    // Rendering actions menu (⋮) with View/Delete options
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
