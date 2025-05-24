// app/order/list/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { Order, ReasonCode } from "@/types/order";
import { fetchOrders } from "@/lib/orders";
import { getOrderColumns } from "@/components/getOrderColumns";
import OrderFilters from "@/components/OrderFilters";
import OrderSummary from "@/components/OrderSummary";
import ClearIcon from "@mui/icons-material/Clear";

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
  const [pageSize, setPageSize] = useState<number>(10);

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

  const handleView = (id: string) => {
    router.push(`/order/${id}`);
  };

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.orderNumber !== id));
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => !!order.orderNumber) // ✅ ensure valid ID for DataGrid
      .filter((order) => {
        const matchesStatus =
          statusFilter === "All" || order.status === statusFilter;

        const matchesSearch =
          order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());

        const orderDate = order.transactionDate?.split("T")[0] || "";
        const inStartRange = !startDate || orderDate >= startDate;
        const inEndRange = !endDate || orderDate <= endDate;

        const matchesReason =
          reasonCodes.length === 0 ||
          order.pendingApprovalReasonCode?.some((code) =>
            reasonCodes.includes(code)
          );

        return (
          matchesStatus &&
          matchesSearch &&
          inStartRange &&
          inEndRange &&
          matchesReason
        );
      });
  }, [orders, statusFilter, searchQuery, startDate, endDate, reasonCodes]);

  const pagedOrders = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, paginationModel]);

  const summary = useMemo(() => {
    return {
      total: filteredOrders.length,
      Pending: filteredOrders.filter((o) => o.status === "Pending").length,
      Approved: filteredOrders.filter((o) => o.status === "Approved").length,
      Shipped: filteredOrders.filter((o) => o.status === "Shipped").length,
      Cancelled: filteredOrders.filter((o) => o.status === "Cancelled").length,
    };
  }, [filteredOrders]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setReasonCodes([]);
    setStartDate("");
    setEndDate("");
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}
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
      />

      <OrderSummary summary={summary} />

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleClearFilters}
        sx={{ mb: 2, alignSelf: "flex-start" }}
      >
        <ClearIcon sx={{ mr: 1 }} />
        Clear Filters
      </Button>

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <DataGrid<Order>
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
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
}
