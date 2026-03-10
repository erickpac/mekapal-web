import { apiClient } from '@/shared/api/client'

export interface RevenueBreakdownItem {
  category: string
  totalRevenue: number
  totalCommissions: number
  totalTax: number
  orderCount: number
}

export interface FinancialSummary {
  totalRevenue: number
  totalCommissions: number
  totalTax: number
  netRevenue: number
  totalOrders: number
  breakdown: RevenueBreakdownItem[]
}

export async function getFinancialSummary(
  startDate: string,
  endDate: string,
): Promise<FinancialSummary> {
  const { data } = await apiClient.get<FinancialSummary>(
    '/reports/financial-summary',
    { params: { startDate, endDate } },
  )
  return data
}

export async function exportDashboardCsv(
  startDate: string,
  endDate: string,
): Promise<Blob> {
  const { data } = await apiClient.get('/reports/dashboard/export', {
    params: { startDate, endDate },
    responseType: 'blob',
  })
  return data as Blob
}
