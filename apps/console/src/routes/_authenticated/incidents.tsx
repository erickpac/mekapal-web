import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/incidents')({
  component: IncidentsPage,
})

function IncidentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Incidents</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
