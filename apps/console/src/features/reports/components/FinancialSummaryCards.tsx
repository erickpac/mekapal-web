import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatNumber } from '@/shared/utils/format'
import type { FinancialSummary } from '../api/reports.api'

interface FinancialSummaryCardsProps {
  data?: FinancialSummary
  loading?: boolean
}

export function FinancialSummaryCards({
  data,
  loading,
}: FinancialSummaryCardsProps) {
  const cards = [
    {
      title: 'Ingresos totales',
      value: data ? formatCurrency(data.totalRevenue) : '',
    },
    {
      title: 'Comisiones totales',
      value: data ? formatCurrency(data.totalCommissions) : '',
    },
    {
      title: 'Impuestos totales',
      value: data ? formatCurrency(data.totalTaxes) : '',
    },
    {
      title: 'Transacciones completadas',
      value: data ? formatNumber(data.completedTransactions) : undefined,
    },
    {
      title: 'Pagos pendientes',
      value: data ? formatCurrency(data.pendingPayments) : '',
    },
    {
      title: 'Cantidad de pagos pendientes',
      value: data ? formatNumber(data.pendingPaymentsCount) : undefined,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-bold">{card.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
