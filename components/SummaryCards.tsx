'use client';

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Link,
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';

type Summary = {
  totalOrders: number;
  totalRevenue: number;
  Pending?: number;
  Approved?: number;
  Shipped?: number;
  Cancelled?: number;
};

type Props = {
  summary: Summary;
};

const SummaryCards = ({ summary }: Props) => {
  const cardItems = [
    {
      label: 'Total Orders',
      value: summary.totalOrders,
      icon: <InventoryIcon fontSize="small" />,
      linkText: 'View all orders',
    },
    {
      label: 'Shipped Orders',
      value: summary.Shipped ?? 0,
      icon: <LocalShippingIcon fontSize="small" />,
      linkText: 'View shipped orders',
    },
    {
      label: 'Pending Orders',
      value: summary.Pending ?? 0,
      icon: <PendingIcon fontSize="small" />,
      linkText: 'View pending orders',
    },
    {
      label: 'Cancelled Orders',
      value: summary.Cancelled ?? 0,
      icon: <CancelIcon fontSize="small" />,
      linkText: 'View cancelled orders',
    },
  ];

  return (
    <Grid container spacing={2}>
      {cardItems.map(({ label, value, icon, linkText }) => (
        <Grid item xs={12} sm={6} md={3} key={label}>
          <Card
            elevation={0}
            sx={{
              boxShadow: '2',
              borderRadius: 2,
              color: '#fff',
              height: 160,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
            }}
          >
            <CardContent sx={{ flex: '1 1 auto' }}>
              <Typography variant="h6" color="#fff">
                {label}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {value}
              </Typography>
            </CardContent>
            <Box
              sx={{
                px: 2,
                pb: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Link
                href="/order/list"
                underline="hover"
                sx={{ color: 'text.secondary', fontSize: 14 }}
              >
                {linkText}
              </Link>
              <Box sx={{ color: 'text.secondary' }}>{icon}</Box>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryCards;
