import { useTranslation } from 'react-i18next'
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
import { formatCurrency } from '@/shared/utils/format'
import type { TopTransporter } from '../api/dashboard.api'

interface TopTransportersChartProps {
  data: TopTransporter[]
  loading?: boolean
}

export function TopTransportersChart({
  data,
  loading,
}: TopTransportersChartProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.charts.topTransporters')}</CardTitle>
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
                  formatCurrency(Number(value)),
                  t('dashboard.charts.earningsTooltip'),
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
