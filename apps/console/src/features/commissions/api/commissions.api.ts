import { apiClient } from '@/shared/api/client'
import type { CommissionType } from '@/shared/types'

export interface BillingProfile {
  id: string
  name: string
  type: CommissionType
  value: number
  minAmount: number | null
  maxAmount: number | null
  taxPercentage: number
  active: boolean
}

export interface BillingProfileFormData {
  name: string
  type: CommissionType
  value: number
  minAmount?: number | null
  maxAmount?: number | null
  taxPercentage: number
  active: boolean
}

export interface AssignedClient {
  id: string
  name: string
  email: string
  assignedAt: string
}

export interface ClientSearchResult {
  id: string
  name: string
  email: string
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
  payload: BillingProfileFormData,
): Promise<BillingProfile> {
  const { data } = await apiClient.put<BillingProfile>(
    `/admin/billing-profiles/${id}`,
    payload,
  )
  return data
}

export async function deleteBillingProfile(id: string): Promise<void> {
  await apiClient.delete(`/admin/billing-profiles/${id}`)
}

export async function getAssignedClients(
  profileId: string,
): Promise<AssignedClient[]> {
  const { data } = await apiClient.get<AssignedClient[]>(
    `/admin/billing-profiles/${profileId}/clients`,
  )
  return data
}

export async function searchClients(
  query: string,
): Promise<ClientSearchResult[]> {
  const { data } = await apiClient.get<ClientSearchResult[]>(
    '/admin/clients/search',
    { params: { q: query } },
  )
  return data
}

export async function assignClient(
  clientId: string,
  profileId: string,
): Promise<void> {
  await apiClient.post(`/admin/billing-profiles/clients/${clientId}/assign`, {
    billingProfileId: profileId,
  })
}

export async function unassignClient(
  clientId: string,
  profileId: string,
): Promise<void> {
  await apiClient.delete(`/admin/billing-profiles/clients/${clientId}/assign`, {
    data: { billingProfileId: profileId },
  })
}
