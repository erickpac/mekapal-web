import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, Loader2 } from 'lucide-react'
import { requireModule } from '@/shared/utils/route-guard'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DateRangePicker } from '@/features/dashboard/components/DateRangePicker'
import { exportDashboardCsv } from '@/features/reports/api/reports.api'
import { FinancialSummaryCards } from '@/features/reports/components/FinancialSummaryCards'
import { RevenueBreakdownTable } from '@/features/reports/components/RevenueBreakdownTable'
import { useFinancialSummary } from '@/features/reports/hooks/useReports'

export const Route = createFileRoute('/_authenticated/reports')({
  beforeLoad: requireModule('reports'),
  component: ReportsPage,
})

function getDefaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

function ReportsPage() {
  const defaults = getDefaultRange()
  const [startDate, setStartDate] = useState(defaults.start)
  const [endDate, setEndDate] = useState(defaults.end)
  const [exporting, setExporting] = useState(false)

  const { data, isLoading } = useFinancialSummary(startDate, endDate)

  async function handleExport() {
    setExporting(true)
    try {
      const blob = await exportDashboardCsv(startDate, endDate)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${startDate}-to-${endDate}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Report exported')
    } catch {
      toast.error('Failed to export report')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Financial summary and revenue breakdown.
          </p>
        </div>
        <Button size="sm" onClick={handleExport} disabled={exporting}>
          {exporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Export CSV
        </Button>
      </div>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onChange={(s, e) => {
          setStartDate(s)
          setEndDate(e)
        }}
      />

      <FinancialSummaryCards data={data} loading={isLoading} />

      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>
            Breakdown by category for the selected period.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RevenueBreakdownTable
            data={data?.breakdown ?? []}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
