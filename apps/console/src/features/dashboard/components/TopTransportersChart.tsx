import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TopTransporter } from '../api/dashboard.api'

interface TopTransportersChartProps {
  data: TopTransporter[]
  loading?: boolean
}

export function TopTransportersChart({
  data,
  loading,
}: TopTransportersChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Transporters</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="transporterName"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value) => [
                  `Q${Number(value).toLocaleString()}`,
                  'Earnings',
                ]}
              />
              <Bar
                dataKey="totalEarnings"
                fill="oklch(var(--chart-2))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
