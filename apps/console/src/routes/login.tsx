import { createFileRoute, redirect } from '@tanstack/react-router'

import { LoginPage } from '@/features/auth/components/LoginPage'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})
