import { Link, useLocation } from '@tanstack/react-router'
import {
  LayoutDashboard,
  ClipboardCheck,
  Banknote,
  AlertTriangle,
  Percent,
  MapPin,
  BarChart3,
  Users,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/validations', label: 'Validations', icon: ClipboardCheck },
  { to: '/settlements', label: 'Settlements', icon: Banknote },
  { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { to: '/commissions', label: 'Commissions', icon: Percent },
  { to: '/locations', label: 'Locations', icon: MapPin },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users },
] as const

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground flex h-full flex-col border-r transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center px-4',
          collapsed && 'justify-center',
        )}
      >
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">Mekapal</span>
        )}
        {collapsed && <span className="text-lg font-bold">M</span>}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(to)
          const link = (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-0',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )

          if (collapsed) {
            return (
              <Tooltip key={to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            )
          }

          return link
        })}
      </nav>

      <Separator />

      <div className="p-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn('w-full', !collapsed && 'justify-start px-3')}
          onClick={onToggle}
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <ChevronsLeft className="size-4" />
          )}
          {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
