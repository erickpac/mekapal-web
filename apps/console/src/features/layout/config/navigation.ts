import {
  LayoutDashboard,
  ClipboardCheck,
  Banknote,
  AlertTriangle,
  Percent,
  MapPin,
  BarChart3,
  Users,
} from 'lucide-react'
import type { AppModule } from '@/features/auth/hooks/usePermissions'

export interface NavItem {
  to: string
  labelKey: string
  icon: typeof LayoutDashboard
  module: AppModule
}

export const navItems: NavItem[] = [
  {
    to: '/dashboard',
    labelKey: 'layout.nav.dashboard',
    icon: LayoutDashboard,
    module: 'dashboard',
  },
  {
    to: '/validations',
    labelKey: 'layout.nav.validations',
    icon: ClipboardCheck,
    module: 'validations',
  },
  {
    to: '/settlements',
    labelKey: 'layout.nav.settlements',
    icon: Banknote,
    module: 'settlements',
  },
  {
    to: '/incidents',
    labelKey: 'layout.nav.incidents',
    icon: AlertTriangle,
    module: 'incidents',
  },
  {
    to: '/commissions',
    labelKey: 'layout.nav.commissions',
    icon: Percent,
    module: 'commissions',
  },
  {
    to: '/locations',
    labelKey: 'layout.nav.locations',
    icon: MapPin,
    module: 'locations',
  },
  {
    to: '/reports',
    labelKey: 'layout.nav.reports',
    icon: BarChart3,
    module: 'reports',
  },
  { to: '/users', labelKey: 'layout.nav.users', icon: Users, module: 'users' },
]
