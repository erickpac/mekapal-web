import { apiClient } from '@/shared/api/client'

export interface FinancialSummary {
  totalRevenue: number
  totalCommissions: number
  totalTaxes: number
  completedTransactions: number
  pendingPayments: number
  pendingPaymentsCount: number
}

export interface ReportQuery {
  fromDate?: string
  toDate?: string
  preset?: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM'
  transporterId?: string
  clientId?: string
  topLimit?: number
}

export async function getFinancialSummary(
  params: ReportQuery,
): Promise<FinancialSummary> {
  const { data } = await apiClient.get<FinancialSummary>(
    '/reports/financial-summary',
    { params },
  )
  return data
}

export async function exportDashboardCsv(params: ReportQuery): Promise<Blob> {
  const { data } = await apiClient.get('/reports/dashboard/export', {
    params,
    responseType: 'blob',
  })
  return data as Blob
}
