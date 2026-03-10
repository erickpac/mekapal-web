import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="text-muted-foreground">Coming soon.</p>
    </div>
  )
}
