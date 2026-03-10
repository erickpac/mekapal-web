import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import type {
  CreateAdminUserData,
  UserRole,
} from '@/features/users/api/users.api'
import { CreateAdminUserDialog } from '@/features/users/components/CreateAdminUserDialog'
import { UserDetailView } from '@/features/users/components/UserDetailView'
import { UserFilters } from '@/features/users/components/UserFilters'
import { UsersTable } from '@/features/users/components/UsersTable'
import { useCreateAdminUser, useUsers } from '@/features/users/hooks/useUsers'
import { Pagination } from '@/features/validations/components/Pagination'

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  const { canPerform } = usePermissions()
  const canCreate = canPerform('users', 'create')

  const [role, setRole] = useState<UserRole | undefined>()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useUsers({
    role,
    search: search || undefined,
    page,
    limit: 10,
  })
  const createUser = useCreateAdminUser()

  function handleCreateUser(formData: CreateAdminUserData): Promise<string> {
    return new Promise((resolve, reject) => {
      createUser.mutate(formData, {
        onSuccess: (response) => {
          resolve(response.temporaryPassword)
        },
        onError: (error) => {
          reject(error)
        },
      })
    })
  }

  if (selectedUserId) {
    return (
      <UserDetailView
        userId={selectedUserId}
        onBack={() => setSelectedUserId(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage users and create admin accounts.
          </p>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <UserPlus className="size-4" />
            Create User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {data
              ? `${data.total} user${data.total !== 1 ? 's' : ''} found`
              : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters
            role={role}
            search={search}
            onRoleChange={(r) => {
              setRole(r)
              setPage(1)
            }}
            onSearchChange={(s) => {
              setSearch(s)
              setPage(1)
            }}
          />

          <UsersTable
            data={data?.data ?? []}
            loading={isLoading}
            onRowClick={(u) => setSelectedUserId(u.id)}
          />

          {data && data.total > data.pageSize && (
            <Pagination
              page={page}
              pageSize={data.pageSize}
              total={data.total}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

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
