import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { FinancialSummary } from '../api/reports.api'

const Q = (v: number) =>
  v.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })

interface FinancialSummaryCardsProps {
  data?: FinancialSummary
  loading?: boolean
}

export function FinancialSummaryCards({
  data,
  loading,
}: FinancialSummaryCardsProps) {
  const cards = [
    { title: 'Total Revenue', value: data ? Q(data.totalRevenue) : '' },
    { title: 'Total Commissions', value: data ? Q(data.totalCommissions) : '' },
    { title: 'Total Taxes', value: data ? Q(data.totalTaxes) : '' },
    {
      title: 'Completed Transactions',
      value: data?.completedTransactions.toLocaleString('es-GT'),
    },
    {
      title: 'Pending Payments',
      value: data ? Q(data.pendingPayments) : '',
    },
    {
      title: 'Pending Payments Count',
      value: data?.pendingPaymentsCount.toLocaleString('es-GT'),
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
