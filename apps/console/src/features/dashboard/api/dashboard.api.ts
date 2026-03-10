import { apiClient } from '@/shared/api/client'

export interface RevenueByDay {
  date: string
  revenue: number
}

export interface TopTransporter {
  id: string
  name: string
  earnings: number
}

export interface OrdersByLoadType {
  loadType: 'LIGHT' | 'HEAVY' | 'BOTH'
  count: number
}

export interface DashboardResponse {
  revenue: number
  revenueTrend: number
  commissions: number
  commissionsTrend: number
  completedOrders: number
  completedOrdersTrend: number
  pendingSettlements: number
  pendingSettlementsTrend: number
  revenueByDay: RevenueByDay[]
  topTransporters: TopTransporter[]
  ordersByLoadType: OrdersByLoadType[]
}

export async function getDashboard(
  startDate: string,
  endDate: string,
): Promise<DashboardResponse> {
  const { data } = await apiClient.get<DashboardResponse>(
    '/reports/dashboard',
    {
      params: { startDate, endDate },
    },
  )
  return data
}
