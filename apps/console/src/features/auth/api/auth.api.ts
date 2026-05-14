import { AxiosError } from 'axios'
import { apiClient } from '@/shared/api/client'
import { parseApiError } from '@/shared/api/error'
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
    const { data } = await apiClient.post<AuthResponse>('/auth/admin/sign-in', {
      email,
      password,
    })
    return data
  } catch (error) {
    // The NEW_PASSWORD_REQUIRED challenge arrives as a 400 carrying the
    // stable `error` code in the standardized contract. It is not a real
    // failure — surface it as a challenge instead of throwing.
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
    // Everything else is normalized to an AppError so callers localize via
    // the centralized error layer instead of reading `data.message`.
    throw parseApiError(error)
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
  try {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/admin/complete-new-password',
      { email, newPassword, session },
    )
    return data
  } catch (error) {
    throw parseApiError(error)
  }
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/sign-out')
}
