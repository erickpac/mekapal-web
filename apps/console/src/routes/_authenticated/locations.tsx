import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/locations')({
  component: LocationsPage,
})

function LocationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Locations</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
