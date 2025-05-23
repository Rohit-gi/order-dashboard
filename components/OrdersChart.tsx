'use client'

import { Box, Typography } from '@mui/material'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { format } from 'date-fns'

type Props = {
  data: { date: string; count: number }[]
}

export default function OrdersChart({ data }: Props) {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 3,
        boxShadow: '2',
        borderRadius: 2,
        maxWidth: '100%',
      }}
    >
      <Typography
        variant="h6"
        fontWeight={500}
        mt={1}
        mb={1}
        textAlign="center"
      >
        Orders Over the Last 30 Days
      </Typography>

      <Box sx={{ width: '100%', mx: 'auto' }}>
        <ResponsiveContainer width="95%" height={350}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), 'MMM d')}
              interval={4}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              domain={[0, 'dataMax + 1']}
              tick={{ fontSize: 12 }}
            />

            <Tooltip
              formatter={(value: number) => [`${value} Orders`, 'Count']}
              labelFormatter={(label) =>
                format(new Date(label), 'MMM d, yyyy')
              }
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}
