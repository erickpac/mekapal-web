import { useCallback, useSyncExternalStore } from 'react'

import type { AuthResponse, AuthUser, ChallengeResponse } from '../api/auth.api'
import * as authApi from '../api/auth.api'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function getSnapshot() {
  return getToken()
}

function getServerSnapshot() {
  return null
}

function storeAuthResponse(response: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, response.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(response.user))
  emitChange()
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const user = token ? getUser() : null

  const login = useCallback(
    async (
      email: string,
      password: string,
    ): Promise<ChallengeResponse | null> => {
      const result = await authApi.signIn(email, password)

      if (authApi.isChallenge(result)) {
        return result
      }

      storeAuthResponse(result)
      return null
    },
    [],
  )

  const completeNewPassword = useCallback(
    async (email: string, newPassword: string, session: string) => {
      const response = await authApi.completeNewPassword(
        email,
        newPassword,
        session,
      )
      storeAuthResponse(response)
    },
    [],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.signOut()
    } catch {
      // ignore — clear local state regardless
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    emitChange()
  }, [])

  return {
    isAuthenticated: !!token,
    user,
    token,
    login,
    completeNewPassword,
    logout,
  }
}
