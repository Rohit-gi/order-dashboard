"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { fetchOrders } from "@/lib/orders";
import { Order } from "@/types/order";
import { format, subDays } from "date-fns";
import SummaryCards from "@/components/SummaryCards";
import OrdersChart from "@/components/OrdersChart";
import RecentOrdersTable from "@/components/RecentOrdersTable";

export default function HomePage() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  // Fetching orders on mount
  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  const loading = orders === null;

  // Calculating total orders and revenue
  const totalOrders = orders?.length ?? 0;
  const totalRevenue =
    orders?.reduce(
      (sum, order) =>
        sum + order.lines.reduce((lSum, line) => lSum + line.amount, 0),
      0
    ) ?? 0;

  // Summary for cards
  const summary = {
    totalOrders,
    totalRevenue,
    Shipped: orders?.filter((o) => o.status === "Shipped").length ?? 0,
    Pending: orders?.filter((o) => o.status === "Pending").length ?? 0,
    Cancelled: orders?.filter((o) => o.status === "Cancelled").length ?? 0,
  };

  // Chart data for the last 30 days
  const chartData = orders
    ? Array.from({ length: 30 }).map((_, i) => {
        const date = format(subDays(new Date(), 29 - i), "yyyy-MM-dd");
        const count = orders.filter(
          (order) => order.transactionDate === date
        ).length;
        return { date, count };
      })
    : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Order Management Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <SummaryCards summary={summary} />

          <Grid container spacing={2} mt={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                elevation={0}
                sx={{
                  textAlign: "center",
                  boxShadow: 2,
                  p: 4,
                  height: "100%",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="h6" color="#fff" mb={2}>
                  Total Revenue
                </Typography>

                <Box
                  sx={{
                    position: "relative",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={70}
                    size={100}
                    thickness={4}
                    sx={{ color: "primary.main" }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" component="div" color="primary">
                      70%
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={0.5}>
                  Total sales made today
                </Typography>

                <Typography variant="h4" fontWeight={600} mb={1}>
                  ${totalRevenue.toFixed(0)}
                </Typography>

                <Typography variant="caption" color="text.secondary" mb={2}>
                  Previous transactions processing. Last payments may not be
                  included.
                </Typography>

                <Grid container spacing={2} justifyContent="center">
                  {[
                    {
                      label: "Target",
                      value: "$12.4k",
                      change: "down",
                      color: "error.main",
                    },
                    {
                      label: "Last Week",
                      value: "$2.4k",
                      change: "up",
                      color: "success.main",
                    },
                    {
                      label: "Last Month",
                      value: "$1.6k",
                      change: "up",
                      color: "success.main",
                    },
                  ].map(({ label, value, change, color }) => (
                    <Grid key={label} size={{ xs: 4 }}>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={0.5}
                      >
                        <Box component="span" sx={{ color }}>
                          {change === "up" ? "▲" : "▼"}
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{ color, fontWeight: 500 }}
                        >
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <OrdersChart data={chartData} />
            </Grid>
          </Grid>

          <Box mt={4}>
            <RecentOrdersTable />
          </Box>
        </>
      )}
    </Box>
  );
}
