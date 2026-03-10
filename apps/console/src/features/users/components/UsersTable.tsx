import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { UserItem } from '../api/users.api'

interface UsersTableProps {
  data: UserItem[]
  loading?: boolean
  onRowClick: (user: UserItem) => void
}

const ROLE_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  ADMIN: 'default',
  BACKOFFICE: 'secondary',
  CLIENT: 'outline',
  TRANSPORTER: 'outline',
}

export function UsersTable({ data, loading, onRowClick }: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Registered</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => onRowClick(user)}
              >
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={ROLE_VARIANT[user.role] ?? 'outline'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.active ? 'default' : 'secondary'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('es-GT')}
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-muted-foreground text-center"
            >
              No users found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
