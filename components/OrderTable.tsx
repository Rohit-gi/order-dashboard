import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Order, OrderLine } from "@/types/order";
import { fetchOrders } from "@/lib/orders";

const statusColors: Record<
  Order["status"],
  "warning" | "success" | "info" | "error"
> = {
  Pending: "warning",
  Approved: "success",
  Shipped: "info",
  Cancelled: "error",
};

const getOrderColumns = (
  handleView: (id: string) => void,
  handleDelete: (id: string) => void
): GridColDef<Order>[] => [
  { field: "orderNumber", headerName: "Order #", flex: 1 },
  { field: "customer", headerName: "Customer", flex: 1 },
  { field: "transactionDate", headerName: "Created Date", flex: 1 },
  {
    field: "dueDate",
    headerName: "Due Date",
    flex: 1,
    valueGetter: (params: GridRenderCellParams<Order>) =>
      params.row.latePickupDate,
  },
  {
    field: "amount",
    headerName: "Amount ($)",
    flex: 1,
    valueGetter: (params: GridRenderCellParams<Order>) =>
      params.row.lines.reduce(
        (sum: number, line: OrderLine) => sum + line.amount,
        0
      ),
    valueFormatter: (params: GridRenderCellParams<Order>) =>
      typeof params.value === "number"
        ? `$${params.value.toFixed(2)}`
        : "$0.00",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    type: "singleSelect",
    valueOptions: ["Pending", "Approved", "Shipped", "Cancelled"],
    renderCell: (params: GridRenderCellParams<Order>) => (
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
    type: "actions",
    flex: 0.5,
    renderCell: (params: GridRenderCellParams<Order>) => {
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      const open = Boolean(anchorEl);

      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };

      const handleClose = () => setAnchorEl(null);

      return (
        <>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                handleClose();
                handleView(params.row.orderNumber);
              }}
            >
              View
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleDelete(params.row.orderNumber);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </>
      );
    },
  },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "All">(
    "All"
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleView = (id: string) => {
    console.log("View order:", id);
  };

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.orderNumber !== id));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesSearch =
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const statusTabs: (Order["status"] | "All")[] = [
    "All",
    "Pending",
    "Approved",
    "Shipped",
    "Cancelled",
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Orders
      </Typography>

      <Tabs
        value={statusFilter}
        onChange={(_, newValue) => setStatusFilter(newValue)}
        sx={{ mb: 2 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {statusTabs.map((status) => (
          <Tab key={status} label={status} value={status} />
        ))}
      </Tabs>

      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Search by customer or order number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
        }}
      >
        <DataGrid
          rows={filteredOrders}
          columns={getOrderColumns(handleView, handleDelete)}
          getRowId={(row) => row.orderNumber}
          loading={loading}
          disableRowSelectionOnClick
          density="comfortable"
        />
      </Box>
    </Box>
  );
}
