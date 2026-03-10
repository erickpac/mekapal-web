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
    label: 'Validaciones',
    icon: ClipboardCheck,
    module: 'validations',
  },
  {
    to: '/settlements',
    label: 'Liquidaciones',
    icon: Banknote,
    module: 'settlements',
  },
  {
    to: '/incidents',
    label: 'Incidentes',
    icon: AlertTriangle,
    module: 'incidents',
  },
  {
    to: '/commissions',
    label: 'Comisiones',
    icon: Percent,
    module: 'commissions',
  },
  { to: '/locations', label: 'Ubicaciones', icon: MapPin, module: 'locations' },
  { to: '/reports', label: 'Reportes', icon: BarChart3, module: 'reports' },
  { to: '/users', label: 'Usuarios', icon: Users, module: 'users' },
]
