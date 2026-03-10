import { apiClient } from '@/shared/api/client'
import type {
  PaginatedQuery,
  TransporterStatus,
  UserRole,
} from '@/shared/types'

export interface UserItem {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
  createdAt: string
}

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

export interface UserFilters extends PaginatedQuery {
  role?: UserRole
  search?: string
}

export async function getUsers(filters: UserFilters): Promise<UserItem[]> {
  const { data } = await apiClient.get<UserItem[]>('/auth/admin/users', {
    params: filters,
  })
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
