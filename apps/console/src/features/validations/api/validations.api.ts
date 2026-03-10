import { apiClient } from '@/shared/api/client'

export type ValidationType = 'VEHICLE' | 'TRANSPORTER_PROFILE'

export interface ValidationTransporter {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
}

export interface ValidationItem {
  id: string
  type: ValidationType
  transporter: ValidationTransporter
  createdAt: string
  summary: Record<string, unknown>
}

export interface ValidationPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedValidations {
  data: ValidationItem[]
  pagination: ValidationPagination
}

export interface ValidationFilters {
  type?: ValidationType
  search?: string
  sort?: 'recent' | 'oldest' | 'priority'
  page?: number
  limit?: number
}

export interface VehicleDetail {
  id: string
  userId: string
  brand: string
  model: string
  year: number
  licensePlate: string
  vin: string
  color: string
  vehicleType: string
  loadType: string
  maxWeightKg: number
  maxVolumeM3: number
  frontPhotoUrl: string | null
  rearPhotoUrl: string | null
  sidePhotoUrl: string | null
  interiorPhotoUrl: string | null
  registrationDocUrl: string | null
  insuranceDocUrl: string | null
  insuranceExpiration: string | null
  status: string
  user: ValidationTransporter
}

export interface ProfileDetail {
  id: string
  userId: string
  licenseNumber: string
  licenseExpiration: string | null
  licenseFrontPhotoUrl: string | null
  licenseBackPhotoUrl: string | null
  idPhotoUrl: string | null
  address: string | null
  city: string
  state: string
  status: string
  user: ValidationTransporter
}

export type RejectionCategory =
  | 'POOR_QUALITY_PHOTOS'
  | 'EXPIRED_DOCUMENTS'
  | 'INFORMATION_MISMATCH'
  | 'ADDITIONAL_DOCUMENTATION_REQUIRED'
  | 'OTHER'

export interface RejectValidationData {
  category: RejectionCategory
  details: string
}

export interface ApproveValidationData {
  checklist?: Record<string, boolean>
}

export async function getValidations(
  filters: ValidationFilters,
): Promise<PaginatedValidations> {
  const { data } = await apiClient.get<PaginatedValidations>(
    '/backoffice/validations',
    { params: filters },
  )
  return data
}

export async function getVehicleDetail(id: string): Promise<VehicleDetail> {
  const { data } = await apiClient.get<VehicleDetail>(
    `/backoffice/validations/vehicle/${id}`,
  )
  return data
}

export async function getProfileDetail(id: string): Promise<ProfileDetail> {
  const { data } = await apiClient.get<ProfileDetail>(
    `/backoffice/validations/profile/${id}`,
  )
  return data
}

export async function approveVehicle(
  id: string,
  payload?: ApproveValidationData,
): Promise<void> {
  await apiClient.post(`/backoffice/validations/vehicle/${id}/approve`, payload)
}

export async function rejectVehicle(
  id: string,
  payload: RejectValidationData,
): Promise<void> {
  await apiClient.post(`/backoffice/validations/vehicle/${id}/reject`, payload)
}

export async function approveProfile(
  id: string,
  payload?: ApproveValidationData,
): Promise<void> {
  await apiClient.post(`/backoffice/validations/profile/${id}/approve`, payload)
}

export async function rejectProfile(
  id: string,
  payload: RejectValidationData,
): Promise<void> {
  await apiClient.post(`/backoffice/validations/profile/${id}/reject`, payload)
}
