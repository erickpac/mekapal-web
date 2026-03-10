import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { UserPlus } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import type { UserRole } from '@/shared/types'
import type { CreateAdminUserData } from '@/features/users/api/users.api'
import { CreateAdminUserDialog } from '@/features/users/components/CreateAdminUserDialog'
import { UserFilters } from '@/features/users/components/UserFilters'
import { UsersTable } from '@/features/users/components/UsersTable'
import { useCreateAdminUser, useUsers } from '@/features/users/hooks/useUsers'

const usersSearchSchema = z.object({
  role: z
    .enum(['ADMIN', 'BACKOFFICE', 'CLIENT', 'TRANSPORTER'])
    .optional()
    .catch(undefined),
  search: z.string().optional().catch(undefined),
  sort: z.enum(['recent', 'oldest']).optional().catch('recent'),
  page: z.number().int().min(1).optional().catch(1),
})

export const Route = createFileRoute('/_authenticated/users')({
  component: UsersPage,
  validateSearch: usersSearchSchema,
})

const LIMIT = 20

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function UsersPage() {
  const { canPerform } = usePermissions()
  const canCreate = canPerform('users', 'create')
  const navigate = useNavigate({ from: Route.fullPath })
  const { role, search, sort = 'recent', page = 1 } = Route.useSearch()

  const [searchInput, setSearchInput] = useState(search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [createOpen, setCreateOpen] = useState(false)

  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
        page: 1,
      }),
      replace: true,
    })
  }, [debouncedSearch, navigate])

  const { data, isLoading } = useUsers({
    role,
    search: search || undefined,
    sort,
    page,
    limit: LIMIT,
  })
  const createUser = useCreateAdminUser()

  function handleCreateUser(formData: CreateAdminUserData) {
    createUser.mutate(formData, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  function setSearchParam(updates: Partial<z.infer<typeof usersSearchSchema>>) {
    navigate({ search: (prev) => ({ ...prev, ...updates }), replace: true })
  }

  const pagination = data?.pagination

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
            {isLoading
              ? 'Loading...'
              : `${pagination?.total ?? 0} users total`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserFilters
            role={role}
            search={searchInput}
            sort={sort}
            onRoleChange={(r) =>
              setSearchParam({ role: r, page: 1 })
            }
            onSearchChange={setSearchInput}
            onSortChange={(s) =>
              setSearchParam({ sort: s, page: 1 })
            }
          />

          <UsersTable data={data?.data ?? []} loading={isLoading} />

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setSearchParam({ page: page - 1 })}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setSearchParam({ page: page + 1 })}
                >
                  Next
                </Button>
              </div>
            </div>
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
