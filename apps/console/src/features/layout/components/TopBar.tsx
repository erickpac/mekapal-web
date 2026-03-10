import { Menu, LogOut } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="bg-background flex h-14 items-center gap-4 border-b px-4">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex-1" />

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{user.name}</span>
          <Badge variant="secondary">{user.role}</Badge>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="size-4" />
          </Button>
        </div>
      )}
    </header>
  )
}
