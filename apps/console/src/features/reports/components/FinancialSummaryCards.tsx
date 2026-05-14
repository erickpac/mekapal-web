import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const cards = [
    {
      title: t('reports.cards.totalRevenue'),
      value: data ? formatCurrency(data.totalRevenue) : '',
    },
    {
      title: t('reports.cards.totalCommissions'),
      value: data ? formatCurrency(data.totalCommissions) : '',
    },
    {
      title: t('reports.cards.totalTaxes'),
      value: data ? formatCurrency(data.totalTaxes) : '',
    },
    {
      title: t('reports.cards.completedTransactions'),
      value: data ? formatNumber(data.completedTransactions) : undefined,
    },
    {
      title: t('reports.cards.pendingPayments'),
      value: data ? formatCurrency(data.pendingPayments) : '',
    },
    {
      title: t('reports.cards.pendingPaymentsCount'),
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
