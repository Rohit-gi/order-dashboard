import {
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Order, ReasonCode } from '@/types/order';

const statusTabs: (Order['status'] | 'All')[] = [
  'All',
  'Pending',
  'Approved',
  'Shipped',
  'Cancelled',
];

const reasonCodeOptions: ReasonCode[] = [
  'PRICE_DISCREPANCY',
  'CREDIT_HOLD',
  'STOCK_SHORTAGE',
  'CUSTOMER_REQUEST',
];

interface OrderFiltersProps {
  statusFilter: Order['status'] | 'All';
  setStatusFilter: (value: Order['status'] | 'All') => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  reasonCodes: ReasonCode[];
  setReasonCodes: (value: ReasonCode[]) => void;
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
}: OrderFiltersProps) {
  return (
    <>
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
                {code.replace(/_/g, ' ')}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
}
