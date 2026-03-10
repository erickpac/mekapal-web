import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Info, UserPlus } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import type { CreateAdminUserData } from '@/features/users/api/users.api'
import { CreateAdminUserDialog } from '@/features/users/components/CreateAdminUserDialog'
import { useCreateAdminUser } from '@/features/users/hooks/useUsers'

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  const { canPerform } = usePermissions()
  const canCreate = canPerform('users', 'create')
  const [createOpen, setCreateOpen] = useState(false)
  const createUser = useCreateAdminUser()

  function handleCreateUser(formData: CreateAdminUserData) {
    createUser.mutate(formData, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Create admin and backoffice user accounts.
          </p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlus className="size-4" />
            Create User
          </Button>
        )}
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertTitle>User listing not available</AlertTitle>
        <AlertDescription>
          The backend does not currently provide a user listing endpoint. You can
          create new admin or backoffice users using the button above. Users will
          receive their credentials via email.
        </AlertDescription>
      </Alert>

      {canCreate && (
        <CreateAdminUserDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreateUser}
          isSubmitting={createUser.isPending}
        />
      )}
    </div>
  )
}
