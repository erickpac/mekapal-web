import { apiClient } from '@/shared/api/client'
import type { CommissionType } from '@/shared/types'

export interface BillingProfile {
  id: string
  name: string
  description: string | null
  commissionType: CommissionType
  commissionValue: number
  commissionMinimum: number | null
  commissionMaximum: number | null
  isCommissionExempt: boolean
  taxPercent: number
  isTaxExempt: boolean
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BillingProfileFormData {
  name: string
  description?: string
  commissionType: CommissionType
  commissionValue: number
  commissionMinimum?: number
  commissionMaximum?: number
  isCommissionExempt?: boolean
  taxPercent: number
  isTaxExempt?: boolean
  isDefault?: boolean
}

export interface UpdateBillingProfileData {
  name?: string
  description?: string | null
  commissionType?: CommissionType
  commissionValue?: number
  commissionMinimum?: number | null
  commissionMaximum?: number | null
  isCommissionExempt?: boolean
  taxPercent?: number
  isTaxExempt?: boolean
  isDefault?: boolean
  isActive?: boolean
}

export async function getBillingProfiles(): Promise<BillingProfile[]> {
  const { data } = await apiClient.get<BillingProfile[]>(
    '/admin/billing-profiles',
  )
  return data
}

export async function getBillingProfile(id: string): Promise<BillingProfile> {
  const { data } = await apiClient.get<BillingProfile>(
    `/admin/billing-profiles/${id}`,
  )
  return data
}

export async function createBillingProfile(
  payload: BillingProfileFormData,
): Promise<BillingProfile> {
  const { data } = await apiClient.post<BillingProfile>(
    '/admin/billing-profiles',
    payload,
  )
  return data
}

export async function updateBillingProfile(
  id: string,
  payload: UpdateBillingProfileData,
): Promise<BillingProfile> {
  const { data } = await apiClient.patch<BillingProfile>(
    `/admin/billing-profiles/${id}`,
    payload,
  )
  return data
}

export async function deleteBillingProfile(id: string): Promise<void> {
  await apiClient.delete(`/admin/billing-profiles/${id}`)
}

export async function assignClient(
  clientId: string,
  profileId: string,
): Promise<void> {
  await apiClient.post(`/admin/billing-profiles/clients/${clientId}/assign`, {
    profileId,
  })
}

export async function unassignClient(clientId: string): Promise<void> {
  await apiClient.delete(`/admin/billing-profiles/clients/${clientId}/assign`)
}
