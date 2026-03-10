import { apiClient } from '@/shared/api/client'
import type { PaginatedResponse } from '@/features/validations/api/validations.api'

export type UserRole = 'CLIENT' | 'TRANSPORTER' | 'ADMIN' | 'BACKOFFICE'

export interface UserItem {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
  createdAt: string
}

export type TransporterStatus =
  | 'PENDING_DOCUMENTS'
  | 'PENDING_REVIEW'
  | 'ACTIVE'
  | 'SUSPENDED'

export interface UserDetail extends UserItem {
  phone?: string
  company?: string
  lastLoginAt?: string
  transporterStatus?: TransporterStatus
}

export interface CreateAdminUserData {
  email: string
  name: string
  role: 'ADMIN' | 'BACKOFFICE'
  password: string
}

export interface UserFilters {
  role?: UserRole
  search?: string
  page?: number
  limit?: number
}

export async function getUsers(
  filters: UserFilters,
): Promise<PaginatedResponse<UserItem>> {
  const { data } = await apiClient.get<PaginatedResponse<UserItem>>(
    '/auth/admin/users',
    { params: filters },
  )
  return data
}

export async function getUser(id: string): Promise<UserDetail> {
  const { data } = await apiClient.get<UserDetail>(`/auth/admin/users/${id}`)
  return data
}

export interface CreateAdminUserResponse extends UserItem {
  temporaryPassword: string
}

export async function createAdminUser(
  payload: CreateAdminUserData,
): Promise<CreateAdminUserResponse> {
  const { data } = await apiClient.post<CreateAdminUserResponse>(
    '/auth/admin/users',
    payload,
  )
  return data
}
