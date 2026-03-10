import { apiClient } from '@/shared/api/client'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/sign-in', {
    email,
    password,
  })
  return data
}

export async function refreshToken(token: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
    refreshToken: token,
  })
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/sign-out')
}
