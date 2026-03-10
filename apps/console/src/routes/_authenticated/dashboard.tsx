import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Banknote, CheckCircle, DollarSign, Hourglass } from 'lucide-react'

import { DateRangePicker } from '@/features/dashboard/components/DateRangePicker'
import { KpiCard } from '@/features/dashboard/components/KpiCard'
import { OrdersByLoadTypeChart } from '@/features/dashboard/components/OrdersByLoadTypeChart'
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

function formatCurrency(value: number) {
  return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`
}

function DashboardPage() {
  const defaults = getDefaultDateRange()
  const [startDate, setStartDate] = useState(defaults.start)
  const [endDate, setEndDate] = useState(defaults.end)

  const { data, isLoading } = useDashboard(startDate, endDate)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s)
            setEndDate(e)
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(data?.revenue ?? 0)}
          trend={data?.revenueTrend ?? 0}
          icon={DollarSign}
          loading={isLoading}
        />
        <KpiCard
          title="Total Commissions"
          value={formatCurrency(data?.commissions ?? 0)}
          trend={data?.commissionsTrend ?? 0}
          icon={Banknote}
          loading={isLoading}
        />
        <KpiCard
          title="Completed Orders"
          value={String(data?.completedOrders ?? 0)}
          trend={data?.completedOrdersTrend ?? 0}
          icon={CheckCircle}
          loading={isLoading}
        />
        <KpiCard
          title="Pending Settlements"
          value={String(data?.pendingSettlements ?? 0)}
          trend={data?.pendingSettlementsTrend ?? 0}
          icon={Hourglass}
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
        <OrdersByLoadTypeChart
          data={data?.ordersByLoadType ?? []}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
