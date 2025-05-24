"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Order, ReasonCode } from "@/types/order";
import { fetchOrders } from "@/lib/orders";
import { getOrderColumns } from "@/components/getOrderColumns";
import OrderFilters from "@/components/OrderFilters";
import OrderSummary from "@/components/OrderSummary";

export default function OrderListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonCodes, setReasonCodes] = useState<ReasonCode[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleView = (id: string) => router.push(`/order/${id}`);
  const handleDelete = (id: string) =>
    setOrders((prev) => prev.filter((o) => o.orderNumber !== id));

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setReasonCodes([]);
    setStartDate("");
    setEndDate("");
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => !!o.orderNumber)
      .filter((o) => {
        const matchesStatus = statusFilter === "All" || o.status === statusFilter;
        const matchesSearch =
          o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const orderDate = o.transactionDate?.split("T")[0] || "";
        const inStartRange = !startDate || orderDate >= startDate;
        const inEndRange = !endDate || orderDate <= endDate;
        const matchesReason =
          reasonCodes.length === 0 ||
          o.pendingApprovalReasonCode?.some((code) => reasonCodes.includes(code));
        return matchesStatus && matchesSearch && inStartRange && inEndRange && matchesReason;
      });
  }, [orders, statusFilter, searchQuery, startDate, endDate, reasonCodes]);

  const pagedOrders = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    return filteredOrders.slice(start, start + paginationModel.pageSize);
  }, [filteredOrders, paginationModel]);

  const summary = useMemo(() => ({
    total: filteredOrders.length,
    Pending: filteredOrders.filter((o) => o.status === "Pending").length,
    Approved: filteredOrders.filter((o) => o.status === "Approved").length,
    Shipped: filteredOrders.filter((o) => o.status === "Shipped").length,
    Cancelled: filteredOrders.filter((o) => o.status === "Cancelled").length,
  }), [filteredOrders]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        px: { xs: 1, sm: 2 },
        py: { xs: 1.5, sm: 2 },
      }}
    >
      <Typography variant="h5" mb={2}>
        Orders
      </Typography>

      <OrderFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        reasonCodes={reasonCodes}
        setReasonCodes={setReasonCodes}
        onClearFilters={handleClearFilters}
      />

      <OrderSummary summary={summary} />

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          height: { xs: "auto", sm: 600 },
          width: "100%",
          p: { xs: 1, sm: 2 },
          borderRadius: 2,
          bgcolor: "background.paper",
          overflowX: "auto",
        }}
      >
        <Box sx={{ minWidth: 600 }}>
          <DataGrid<Order>
            sx={{
              '--DataGrid-containerBackground': 'background.paper',
              bgcolor: "background.paper",
              "& .MuiDataGrid-toolbarContainer": {
                bgcolor: "background.paper",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "background.paper",
              },
              "& .MuiDataGrid-footerContainer": {
                bgcolor: "background.paper",
              },
            }}
            rows={pagedOrders}
            pagination
            paginationMode="client"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            columns={getOrderColumns(handleView, handleDelete)}
            getRowId={(row) => row.orderNumber}
            loading={loading}
            disableRowSelectionOnClick
            density="comfortable"
            pageSizeOptions={[5, 10, 20]}
          />
        </Box>
      </Box>
    </Box>
  );
}
