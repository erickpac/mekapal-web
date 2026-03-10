import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ChallengeResponse } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const newPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Minimum 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type LoginValues = z.infer<typeof loginSchema>
type NewPasswordValues = z.infer<typeof newPasswordSchema>

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, completeNewPassword } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)
  const [challenge, setChallenge] = useState<ChallengeResponse | null>(null)

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const passwordForm = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
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
      if (error instanceof AxiosError) {
        setApiError(
          error.response?.data?.message ?? 'Invalid email or password',
        )
      } else {
        setApiError('An unexpected error occurred')
      }
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
      if (error instanceof AxiosError) {
        setApiError(
          error.response?.data?.message ?? 'Failed to set new password',
        )
      } else {
        setApiError('An unexpected error occurred')
      }
    }
  }

  if (challenge) {
    return (
      <form
        onSubmit={passwordForm.handleSubmit(onNewPasswordSubmit)}
        className="grid gap-4"
      >
        <p className="text-muted-foreground text-sm">
          You must set a new password before continuing.
        </p>

        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
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
          <Label htmlFor="confirm-password">Confirm Password</Label>
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
          Set Password
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="correo@mekapal.com"
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
        <Label htmlFor="password">Password</Label>
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
        Sign in
      </Button>
    </form>
  )
}
