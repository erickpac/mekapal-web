import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/shared/utils/format'
import type { RevenueByLoadType } from '../api/dashboard.api'

const COLORS = [
  'oklch(var(--chart-1))',
  'oklch(var(--chart-3))',
  'oklch(var(--chart-5))',
]

interface RevenueByLoadTypeChartProps {
  data: RevenueByLoadType[]
  loading?: boolean
}

export function RevenueByLoadTypeChart({
  data,
  loading,
}: RevenueByLoadTypeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por tipo de carga</CardTitle>
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
                  dataKey="revenue"
                  nameKey="loadType"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, payload }) =>
                    `${name} ${(payload.percentage as number).toFixed(0)}%`
                  }
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    formatCurrency(Number(value)),
                    'Ingresos',
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
