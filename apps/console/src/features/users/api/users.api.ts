import { apiClient } from '@/shared/api/client'
import type { UserRole } from '@/shared/types'

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

export async function createAdminUser(
  payload: CreateAdminUserData,
): Promise<AdminUserResponse> {
  const { data } = await apiClient.post<AdminUserResponse>(
    '/auth/admin/users',
    payload,
  )
  return data
}
