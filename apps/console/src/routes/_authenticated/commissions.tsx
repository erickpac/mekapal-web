import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/commissions')({
  component: CommissionsPage,
})

function CommissionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Commissions</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
