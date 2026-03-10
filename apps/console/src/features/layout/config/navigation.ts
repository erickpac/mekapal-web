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
  label: string
  icon: typeof LayoutDashboard
  module: AppModule
}

export const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    module: 'dashboard',
  },
  {
    to: '/validations',
    label: 'Validations',
    icon: ClipboardCheck,
    module: 'validations',
  },
  {
    to: '/settlements',
    label: 'Settlements',
    icon: Banknote,
    module: 'settlements',
  },
  {
    to: '/incidents',
    label: 'Incidents',
    icon: AlertTriangle,
    module: 'incidents',
  },
  {
    to: '/commissions',
    label: 'Commissions',
    icon: Percent,
    module: 'commissions',
  },
  { to: '/locations', label: 'Locations', icon: MapPin, module: 'locations' },
  { to: '/reports', label: 'Reports', icon: BarChart3, module: 'reports' },
  { to: '/users', label: 'Users', icon: Users, module: 'users' },
]
