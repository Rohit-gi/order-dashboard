"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Tabs,
  Tab,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Order, ReasonCode } from "@/types/order";
import { fetchOrders } from "@/lib/orders";
import { getOrderColumns } from "@/components/OrderTable";
import ClearIcon from "@mui/icons-material/Clear";

const statusTabs: (Order["status"] | "All")[] = [
  "All",
  "Pending",
  "Approved",
  "Shipped",
  "Cancelled",
];
const reasonCodeOptions: ReasonCode[] = [
  "PRICE_DISCREPANCY",
  "CREDIT_HOLD",
  "STOCK_SHORTAGE",
  "CUSTOMER_REQUEST",
];

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "All">(
    "All"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleView = (id: string) => {
    router.push(`/order/${id}`);
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

      const orderDate = order.transactionDate?.split("T")[0] || "";

      const inStartRange = !startDate || orderDate >= startDate;
      const inEndRange = !endDate || orderDate <= endDate;

      return matchesStatus && matchesSearch && inStartRange && inEndRange;
    });
  }, [orders, statusFilter, searchQuery, startDate, endDate]);

  const summary = useMemo(() => {
    return {
      total: filteredOrders.length,
      Pending: filteredOrders.filter((o) => o.status === "Pending").length,
      Approved: filteredOrders.filter((o) => o.status === "Approved").length,
      Shipped: filteredOrders.filter((o) => o.status === "Shipped").length,
      Cancelled: filteredOrders.filter((o) => o.status === "Cancelled").length,
    };
  }, [filteredOrders]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}
    >
      <Typography variant="h5" mb={2}>
        Orders
      </Typography>

      <Tabs
        value={statusFilter}
        onChange={(_, val) => setStatusFilter(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {statusTabs.map((s) => (
          <Tab key={s} label={s} value={s} />
        ))}
      </Tabs>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer or order number"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            size="small"
            label="Approval Reasons"
            SelectProps={{ multiple: true }}
            value={reasonCodes}
            onChange={(e) =>
              setReasonCodes(e.target.value as unknown as ReasonCode[])
            }
          >
            {reasonCodeOptions.map((code) => (
              <MenuItem key={code} value={code}>
                {code.replace(/_/g, " ")}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2">Summary</Typography>
        <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
          <Chip label={`Total: ${summary.total}`} />
          <Chip color="warning" label={`Pending: ${summary.Pending}`} />
          <Chip color="success" label={`Approved: ${summary.Approved}`} />
          <Chip color="info" label={`Shipped: ${summary.Shipped}`} />
          <Chip color="error" label={`Cancelled: ${summary.Cancelled}`} />
        </Box>
      </Paper>

      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          setSearchQuery("");
          setStatusFilter("All");
          setReasonCodes([]);
          setStartDate(null);
          setEndDate(null);
        }}
        sx={{ mb: 2, alignSelf: "flex-start" }}
      >
        <ClearIcon sx={{ mr: 1 }} />
        Clear Filters
      </Button>

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
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
