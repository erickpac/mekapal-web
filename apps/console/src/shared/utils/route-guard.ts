import { redirect } from '@tanstack/react-router'

import type { AppModule } from '@/features/auth/hooks/usePermissions'

const ADMIN_ONLY_MODULES: AppModule[] = ['commissions', 'locations', 'reports']

export function requireModule(module: AppModule) {
  return () => {
    const raw = localStorage.getItem('auth_user')
    if (!raw) throw redirect({ to: '/login' })

    const user = JSON.parse(raw) as { role: string }
    if (ADMIN_ONLY_MODULES.includes(module) && user.role !== 'ADMIN') {
      throw redirect({ to: '/dashboard' })
    }
  }
}
