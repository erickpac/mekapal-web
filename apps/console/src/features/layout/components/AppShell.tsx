import { type ReactNode, useCallback, useState } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'
import { MobileSidebar } from './MobileSidebar'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const COLLAPSED_KEY = 'sidebar_collapsed'

function getInitialCollapsed() {
  return localStorage.getItem(COLLAPSED_KEY) === 'true'
}

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(getInitialCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(COLLAPSED_KEY, String(next))
      return next
    })
  }, [])

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        </div>

        <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  )
}
