import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { parseApiError } from '@/shared/api/error'

/**
 * Centralized API-error → localized-message layer for the console.
 *
 * `getErrorMessage(error)` normalizes any thrown value into an `AppError`
 * and returns the localized string for its `i18nKey`. The raw server
 * `message` is English/dev-facing — it is never shown to the user, only
 * logged in development to aid debugging. Mirrors
 * `mekapal-mobile/hooks/useLocalizedError.ts`.
 */
export function useLocalizedError() {
  const { t } = useTranslation()

  const getErrorMessage = useCallback(
    (error: unknown): string => {
      const appError = parseApiError(error)
      if (import.meta.env.DEV && appError.serverMessage) {
        console.warn(
          `[API error] ${appError.serverErrorCode ?? appError.code}: ${appError.serverMessage}`,
        )
      }
      return t(appError.i18nKey)
    },
    [t],
  )

  return { getErrorMessage }
}
