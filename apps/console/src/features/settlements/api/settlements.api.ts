import { apiClient } from '@/shared/api/client'
import type { SettlementStatus } from '@/shared/types'

export interface Settlement {
  id: string
  amount: number
  status: SettlementStatus
  transferDate: string | null
  transactionNumber: string | null
  comment: string | null
  screenshotUrl: string | null
  paidAt: string | null
  orderId: string
  transporterId: string
  bankAccountId: string | null
  registeredBy: string | null
  createdAt: string
  updatedAt: string
}

export interface SettlementFilters {
  status?: SettlementStatus
  transporterId?: string
  fromDate?: string
  toDate?: string
}

export interface RecordPaymentData {
  transferDate: string
  transactionNumber: string
  comment?: string
  screenshotUrl?: string
  bankAccountId?: string
}

export async function getSettlements(
  filters: SettlementFilters,
): Promise<Settlement[]> {
  const { data } = await apiClient.get<Settlement[]>('/settlements', {
    params: filters,
  })
  return data
}

export async function getPendingSettlements(): Promise<Settlement[]> {
  const { data } = await apiClient.get<Settlement[]>('/settlements/pending')
  return data
}

export async function getSettlement(id: string): Promise<Settlement> {
  const { data } = await apiClient.get<Settlement>(`/settlements/${id}`)
  return data
}

export async function recordPayment(
  id: string,
  payload: RecordPaymentData,
): Promise<Settlement> {
  const { data } = await apiClient.post<Settlement>(
    `/settlements/${id}/pay`,
    payload,
  )
  return data
}
