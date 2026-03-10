import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/validations')({
  component: ValidationsPage,
})

function ValidationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Validations</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
