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
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

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

interface MobileSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const location = useLocation()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-60 p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle className="text-lg font-bold tracking-tight">
            Mekapal
          </SheetTitle>
        </SheetHeader>

        <Separator />

        <nav className="space-y-1 p-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
