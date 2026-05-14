import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Banknote,
  CheckCircle,
  DollarSign,
  Hourglass,
  Receipt,
  Users,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { formatCurrency } from '@/shared/utils/format'
import { DateRangePicker } from '@/features/dashboard/components/DateRangePicker'
import { KpiCard } from '@/features/dashboard/components/KpiCard'
import { RevenueByLoadTypeChart } from '@/features/dashboard/components/OrdersByLoadTypeChart'
import { RevenueChart } from '@/features/dashboard/components/RevenueChart'
import { TopTransportersChart } from '@/features/dashboard/components/TopTransportersChart'
import { useDashboard } from '@/features/dashboard/hooks/useDashboard'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function getDefaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  }
}

function DashboardPage() {
  const { t } = useTranslation()
  const defaults = getDefaultDateRange()
  const [fromDate, setFromDate] = useState(defaults.start)
  const [toDate, setToDate] = useState(defaults.end)

  const { data, isLoading } = useDashboard(fromDate, toDate)
  const summary = data?.financialSummary

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold">{t('dashboard.page.title')}</h1>
        <DateRangePicker
          startDate={fromDate}
          endDate={toDate}
          onChange={(s, e) => {
            setFromDate(s)
            setToDate(e)
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title={t('dashboard.kpi.totalRevenue')}
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          icon={DollarSign}
          loading={isLoading}
        />
        <KpiCard
          title={t('dashboard.kpi.totalCommissions')}
          value={formatCurrency(summary?.totalCommissions ?? 0)}
          icon={Banknote}
          loading={isLoading}
        />
        <KpiCard
          title={t('dashboard.kpi.totalTaxes')}
          value={formatCurrency(summary?.totalTaxes ?? 0)}
          icon={Receipt}
          loading={isLoading}
        />
        <KpiCard
          title={t('dashboard.kpi.completedTransactions')}
          value={String(summary?.completedTransactions ?? 0)}
          icon={CheckCircle}
          loading={isLoading}
        />
        <KpiCard
          title={t('dashboard.kpi.pendingPayments')}
          value={formatCurrency(summary?.pendingPayments ?? 0)}
          icon={Hourglass}
          loading={isLoading}
        />
        <KpiCard
          title={t('dashboard.kpi.activeTransporters')}
          value={String(data?.userStats?.activeTransporters ?? 0)}
          icon={Users}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <RevenueChart data={data?.revenueByDay ?? []} loading={isLoading} />
        <TopTransportersChart
          data={data?.topTransporters ?? []}
          loading={isLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueByLoadTypeChart
          data={data?.revenueByLoadType ?? []}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
