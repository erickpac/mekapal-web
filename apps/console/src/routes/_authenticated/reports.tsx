import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
