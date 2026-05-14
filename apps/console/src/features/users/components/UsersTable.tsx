import { useTranslation } from 'react-i18next'
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
import { formatDate } from '@/shared/utils/format'
import type { UserListItem } from '../api/users.api'

interface UsersTableProps {
  data: UserListItem[]
  loading?: boolean
}

const ROLE_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  ADMIN: 'outline',
  BACKOFFICE: 'destructive',
  CLIENT: 'default',
  TRANSPORTER: 'secondary',
}

export function UsersTable({ data, loading }: UsersTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('users.table.name')}</TableHead>
          <TableHead>{t('users.table.email')}</TableHead>
          <TableHead>{t('users.table.phone')}</TableHead>
          <TableHead>{t('users.table.role')}</TableHead>
          <TableHead>{t('users.table.company')}</TableHead>
          <TableHead>{t('users.table.registered')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.phone || '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={ROLE_VARIANT[user.role] ?? 'outline'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.companyName ?? '—'}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-muted-foreground text-center"
            >
              {t('users.table.empty')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
