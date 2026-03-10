import { AxiosError } from 'axios'
import { apiClient } from '@/shared/api/client'
import type { UserRole } from '@/shared/types'

export interface AuthUser {
  id: string
  cognitoSub: string
  email: string
  phone: string
  firstName: string
  lastName: string
  role: UserRole
  companyName: string | null
  taxId: string | null
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  idToken: string
  expiresIn: number
  user: AuthUser
}

export interface ChallengeResponse {
  session: string
  email: string
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResponse | ChallengeResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/admin/sign-in',
      { email, password },
    )
    return data
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 400 &&
      error.response.data?.error === 'NEW_PASSWORD_REQUIRED'
    ) {
      return {
        session: error.response.data.session as string,
        email,
      }
    }
    throw error
  }
}

export function isChallenge(
  result: AuthResponse | ChallengeResponse,
): result is ChallengeResponse {
  return 'session' in result && !('accessToken' in result)
}

export async function completeNewPassword(
  email: string,
  newPassword: string,
  session: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    '/auth/admin/complete-new-password',
    { email, newPassword, session },
  )
  return data
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/refresh', {
    refreshToken: token,
  })
  return data
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/auth/me')
  return data
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/sign-out')
}
