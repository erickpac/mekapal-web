import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/settlements')({
  component: SettlementsPage,
})

function SettlementsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settlements</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
