import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocalizedError } from '@/shared/api/useLocalizedError'
import type { ChallengeResponse } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'

const createLoginSchema = (t: TFunction) =>
  z.object({
    email: z.email(t('auth.validation.emailInvalid')),
    password: z.string().min(1, t('auth.validation.passwordRequired')),
  })

const createNewPasswordSchema = (t: TFunction) =>
  z
    .object({
      newPassword: z.string().min(8, t('auth.validation.newPasswordMin')),
      confirmPassword: z
        .string()
        .min(1, t('auth.validation.confirmPasswordRequired')),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('auth.validation.passwordsMismatch'),
      path: ['confirmPassword'],
    })

type LoginValues = z.infer<ReturnType<typeof createLoginSchema>>
type NewPasswordValues = z.infer<ReturnType<typeof createNewPasswordSchema>>

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation()
  const { login, completeNewPassword } = useAuth()
  const { getErrorMessage } = useLocalizedError()
  const [apiError, setApiError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null)

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(createLoginSchema(t)),
  })

  const passwordForm = useForm<NewPasswordValues>({
    resolver: zodResolver(createNewPasswordSchema(t)),
  })

  async function onLoginSubmit(values: LoginValues) {
    setApiError(null)
    try {
      const result = await login(values.email, values.password)
      if (result) {
        setChallenge(result)
      } else {
        onSuccess()
      }
    } catch (error) {
      setApiError(getErrorMessage(error))
    }
  }

  async function onNewPasswordSubmit(values: NewPasswordValues) {
    if (!challenge) return
    setApiError(null)
    try {
      await completeNewPassword(
        challenge.email,
        values.newPassword,
        challenge.session,
      )
      onSuccess()
    } catch (error) {
      setApiError(getErrorMessage(error))
    }
  }

  if (challenge) {
    return (
      <form
        onSubmit={passwordForm.handleSubmit(onNewPasswordSubmit)}
        className="grid gap-4"
      >
        <p className="text-muted-foreground text-sm">
          {t('auth.newPassword.instructions')}
        </p>

        <div className="grid gap-2">
          <Label htmlFor="new-password">
            {t('auth.newPassword.newPasswordLabel')}
          </Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            {...passwordForm.register('newPassword')}
          />
          {passwordForm.formState.errors.newPassword && (
            <p className="text-destructive text-sm">
              {passwordForm.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="confirm-password">
            {t('auth.newPassword.confirmPasswordLabel')}
          </Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            {...passwordForm.register('confirmPassword')}
          />
          {passwordForm.formState.errors.confirmPassword && (
            <p className="text-destructive text-sm">
              {passwordForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        {apiError && <p className="text-destructive text-sm">{apiError}</p>}

        <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
          {passwordForm.formState.isSubmitting && (
            <Loader2 className="animate-spin" />
          )}
          {t('auth.newPassword.submit')}
        </Button>
      </form>
    )
  }

  return (
    <form
      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
      className="grid gap-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="email">{t('auth.login.emailLabel')}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t('auth.login.emailPlaceholder')}
          autoComplete="email"
          {...loginForm.register('email')}
        />
        {loginForm.formState.errors.email && (
          <p className="text-destructive text-sm">
            {loginForm.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">{t('auth.login.passwordLabel')}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...loginForm.register('password')}
        />
        {loginForm.formState.errors.password && (
          <p className="text-destructive text-sm">
            {loginForm.formState.errors.password.message}
          </p>
        )}
      </div>

      {apiError && <p className="text-destructive text-sm">{apiError}</p>}

      <Button type="submit" disabled={loginForm.formState.isSubmitting}>
        {loginForm.formState.isSubmitting && (
          <Loader2 className="animate-spin" />
        )}
        {t('auth.login.submit')}
      </Button>
    </form>
  )
}
