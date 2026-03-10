import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Download, Loader2 } from 'lucide-react'
import { requireModule } from '@/shared/utils/route-guard'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/features/dashboard/components/DateRangePicker'
import { exportDashboardCsv } from '@/features/reports/api/reports.api'
import { FinancialSummaryCards } from '@/features/reports/components/FinancialSummaryCards'
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
  const [fromDate, setFromDate] = useState(defaults.start)
  const [toDate, setToDate] = useState(defaults.end)
  const [exporting, setExporting] = useState(false)

  const { data, isLoading } = useFinancialSummary({ fromDate, toDate })

  async function handleExport() {
    setExporting(true)
    try {
      const blob = await exportDashboardCsv({ fromDate, toDate })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${fromDate}-to-${toDate}.csv`
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
            Financial summary for the selected period.
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
        startDate={fromDate}
        endDate={toDate}
        onChange={(s, e) => {
          setFromDate(s)
          setToDate(e)
        }}
      />

      <FinancialSummaryCards data={data} loading={isLoading} />
    </div>
  )
}
