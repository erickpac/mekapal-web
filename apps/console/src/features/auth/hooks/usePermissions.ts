import { UserRole } from '@/shared/types'
import { useAuth } from './useAuth'

export type AppModule =
  | 'dashboard'
  | 'validations'
  | 'settlements'
  | 'incidents'
  | 'commissions'
  | 'locations'
  | 'reports'
  | 'users'

export type AppAction = 'create' | 'update' | 'delete' | 'assign'

type RolePermissions = {
  modules: AppModule[]
  actions: Record<AppModule, AppAction[]>
}

const PERMISSIONS: Partial<Record<UserRole, RolePermissions>> = {
  [UserRole.ADMIN]: {
    modules: [
      'dashboard',
      'validations',
      'settlements',
      'incidents',
      'commissions',
      'locations',
      'reports',
      'users',
    ],
    actions: {
      dashboard: [],
      validations: ['update'],
      settlements: ['create', 'update'],
      incidents: ['update'],
      commissions: ['create', 'update', 'delete', 'assign'],
      locations: ['create', 'update', 'delete'],
      reports: [],
      users: ['create'],
    },
  },
  [UserRole.BACKOFFICE]: {
    modules: ['dashboard', 'validations', 'settlements', 'incidents', 'users'],
    actions: {
      dashboard: [],
      validations: ['update'],
      settlements: ['create', 'update'],
      incidents: ['update'],
      commissions: [],
      locations: [],
      reports: [],
      users: [],
    },
  },
}

export function usePermissions() {
  const { user } = useAuth()
  const role = user?.role
  const perms = role ? PERMISSIONS[role] : undefined

  function canAccess(module: AppModule): boolean {
    if (!perms) return false
    return perms.modules.includes(module)
  }

  function canPerform(module: AppModule, action: AppAction): boolean {
    if (!perms) return false
    return perms.actions[module]?.includes(action) ?? false
  }

  return { canAccess, canPerform }
}
