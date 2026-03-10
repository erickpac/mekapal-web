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
  challengeName: 'NEW_PASSWORD_REQUIRED'
  session: string
  email: string
}

export type SignInResult = AuthResponse | ChallengeResponse

export function isChallenge(result: SignInResult): result is ChallengeResponse {
  return 'challengeName' in result
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  const { data } = await apiClient.post<SignInResult>('/auth/admin/sign-in', {
    email,
    password,
  })
  return data
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
