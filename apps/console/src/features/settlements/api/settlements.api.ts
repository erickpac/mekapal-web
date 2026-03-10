import { apiClient } from '@/shared/api/client'
import type { PaginatedResponse } from '@/features/validations/api/validations.api'

export type SettlementStatus = 'PENDING' | 'PAID'

export interface SettlementItem {
  id: string
  transporterName: string
  orderId: string
  amount: number
  commission: number
  netAmount: number
  status: SettlementStatus
  date: string
}

export interface SettlementDetail extends SettlementItem {
  bankAccounts: BankAccount[]
  paymentInfo?: PaymentInfo
}

export interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
}

export interface PaymentInfo {
  transferDate: string
  transferAmount: number
  transactionNumber: string
  bankAccountId: string
  comments?: string
}

export interface SettlementFilters {
  status?: SettlementStatus
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface RecordPaymentData {
  transferDate: string
  transferAmount: number
  transactionNumber: string
  bankAccountId: string
  comments?: string
}

export async function getSettlements(
  filters: SettlementFilters,
): Promise<PaginatedResponse<SettlementItem>> {
  const { data } = await apiClient.get<PaginatedResponse<SettlementItem>>(
    '/settlements',
    { params: filters },
  )
  return data
}

export async function getSettlement(id: string): Promise<SettlementDetail> {
  const { data } = await apiClient.get<SettlementDetail>(`/settlements/${id}`)
  return data
}

export async function recordPayment(
  id: string,
  payload: RecordPaymentData,
): Promise<void> {
  await apiClient.post(`/settlements/${id}/pay`, payload)
}
