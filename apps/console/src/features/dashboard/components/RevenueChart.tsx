import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { RevenueByDay } from '../api/dashboard.api'

interface RevenueChartProps {
  data: RevenueByDay[]
  loading?: boolean
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Revenue (last 30 days)</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: string) =>
                  new Date(v).toLocaleDateString('es-GT', {
                    day: '2-digit',
                    month: 'short',
                  })
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [
                  `Q${Number(value).toLocaleString()}`,
                  'Revenue',
                ]}
                labelFormatter={(label) =>
                  new Date(String(label)).toLocaleDateString('es-GT')
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="oklch(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
