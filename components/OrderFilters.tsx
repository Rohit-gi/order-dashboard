"use client";

import {
  TextField,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
  Box,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { Order, ReasonCode } from "@/types/order";

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

export interface OrderFiltersProps {
  statusFilter: Order["status"] | "All";
  setStatusFilter: (status: Order["status"] | "All") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  reasonCodes: ReasonCode[];
  setReasonCodes: (codes: ReasonCode[]) => void;
  onClearFilters: () => void;
}

export default function OrderFilters({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  reasonCodes,
  setReasonCodes,
  onClearFilters,
}: OrderFiltersProps) {
  return (
    <>
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: "background.paper",
          mt:1,
          mb: 3,
        }}
      >
        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onChange={(_, val) => setStatusFilter(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {statusTabs.map((status) => (
            <Tab key={status} label={status} value={status} />
          ))}
        </Tabs>

        {/* Filters + Clear Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          {/* Filters Grid */}
          <Grid container spacing={2} sx={{ flex: 1 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer or order number"
                size="small"
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
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                select
                size="small"
                label="Approval Reasons"
                value={reasonCodes}
                onChange={(e) =>
                  setReasonCodes(e.target.value as unknown as ReasonCode[])
                }
                slotProps={{
                  select: {
                    multiple: true,
                  },
                }}
              >
                {reasonCodeOptions.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Clear Filters Button */}
          <Box sx={{ whiteSpace: "nowrap" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClearFilters}
              startIcon={<ClearIcon />}
              sx={{
                mt: { xs: 2, md: 0 },
                height: 40,
                backgroundColor: "background.paper",
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "background.default",
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
