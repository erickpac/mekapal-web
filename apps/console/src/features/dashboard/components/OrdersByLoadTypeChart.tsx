import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { OrdersByLoadType } from '../api/dashboard.api'

const COLORS = [
  'oklch(var(--chart-1))',
  'oklch(var(--chart-3))',
  'oklch(var(--chart-5))',
]

interface OrdersByLoadTypeChartProps {
  data: OrdersByLoadType[]
  loading?: boolean
}

export function OrdersByLoadTypeChart({
  data,
  loading,
}: OrdersByLoadTypeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Load Type</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="flex items-center justify-center gap-6">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="loadType"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [Number(value), 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
