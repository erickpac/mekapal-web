import { apiClient } from '@/shared/api/client'
import type { UserRole } from '@/shared/types'

export interface UserListItem {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: UserRole
  companyName: string | null
  createdAt: string
}

export interface UserListPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UserListResponse {
  data: UserListItem[]
  pagination: UserListPagination
}

export interface UserListQuery {
  role?: UserRole
  search?: string
  sort?: 'recent' | 'oldest'
  page?: number
  limit?: number
}

export interface CreateAdminUserData {
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'BACKOFFICE'
  phone?: string
  temporaryPassword?: string
}

export interface AdminUserResponse {
  id: string
  cognitoSub: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
}

export async function getUsers(
  query: UserListQuery,
): Promise<UserListResponse> {
  const { data } = await apiClient.get<UserListResponse>(
    '/backoffice/users',
    { params: query },
  )
  return data
}

export async function createAdminUser(
  payload: CreateAdminUserData,
): Promise<AdminUserResponse> {
  const { data } = await apiClient.post<AdminUserResponse>(
    '/auth/admin/users',
    payload,
  )
  return data
}
