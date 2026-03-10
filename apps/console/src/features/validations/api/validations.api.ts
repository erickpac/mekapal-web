import { apiClient } from '@/shared/api/client'
import type { PaginatedQuery } from '@/shared/types'

export type ValidationType = 'profile' | 'vehicle'
export type ValidationStatus = 'pending' | 'approved' | 'rejected'

export interface ValidationItem {
  id: string
  type: ValidationType
  name: string
  submittedAt: string
  status: ValidationStatus
}

export interface ValidationFilters extends PaginatedQuery {
  type?: ValidationType
  search?: string
}

export interface VehicleDetail {
  id: string
  plate: string
  brand: string
  model: string
  year: number
  color: string
  type: string
  status: ValidationStatus
  photos: string[]
  submittedAt: string
  transporterName: string
}

export interface ProfileDetail {
  id: string
  name: string
  email: string
  phone: string
  dpi: string
  status: ValidationStatus
  documents: string[]
  submittedAt: string
}

export interface RejectionReason {
  category:
    | 'poor_quality_photo'
    | 'expired_document'
    | 'info_mismatch'
    | 'other'
  notes?: string
}

export async function getValidations(
  filters: ValidationFilters,
): Promise<ValidationItem[]> {
  const { data } = await apiClient.get<ValidationItem[]>('/validations', {
    params: filters,
  })
  return data
}

export async function getVehicleDetail(id: string): Promise<VehicleDetail> {
  const { data } = await apiClient.get<VehicleDetail>(
    `/validations/vehicles/${id}`,
  )
  return data
}

export async function getProfileDetail(id: string): Promise<ProfileDetail> {
  const { data } = await apiClient.get<ProfileDetail>(
    `/validations/profiles/${id}`,
  )
  return data
}

export async function approveVehicle(id: string): Promise<void> {
  await apiClient.post(`/validations/vehicles/${id}/approve`)
}

export async function rejectVehicle(
  id: string,
  reason: RejectionReason,
): Promise<void> {
  await apiClient.post(`/validations/vehicles/${id}/reject`, reason)
}

export async function approveProfile(id: string): Promise<void> {
  await apiClient.post(`/validations/profiles/${id}/approve`)
}

export async function rejectProfile(
  id: string,
  reason: RejectionReason,
): Promise<void> {
  await apiClient.post(`/validations/profiles/${id}/reject`, reason)
}
