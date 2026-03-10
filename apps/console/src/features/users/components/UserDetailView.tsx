import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TransporterStatus } from '../api/users.api'
import { useUser } from '../hooks/useUsers'

interface UserDetailViewProps {
  userId: string
  onBack: () => void
}

const TRANSPORTER_STATUS_VARIANT: Record<
  TransporterStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  ACTIVE: 'default',
  PENDING_DOCUMENTS: 'outline',
  PENDING_REVIEW: 'secondary',
  SUSPENDED: 'destructive',
}

const TRANSPORTER_STATUS_LABEL: Record<TransporterStatus, string> = {
  ACTIVE: 'Active',
  PENDING_DOCUMENTS: 'Pending Documents',
  PENDING_REVIEW: 'Pending Review',
  SUSPENDED: 'Suspended',
}

export function UserDetailView({ userId, onBack }: UserDetailViewProps) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <p className="text-muted-foreground">User not found.</p>
      </div>
    )
  }

  const fields = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone ?? '—' },
    { label: 'Company', value: user.company ?? '—' },
    {
      label: 'Registered',
      value: new Date(user.createdAt).toLocaleDateString('es-GT'),
    },
    {
      label: 'Last Login',
      value: user.lastLoginAt
        ? new Date(user.lastLoginAt).toLocaleDateString('es-GT')
        : '—',
    },
  ]

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <Badge variant={user.active ? 'default' : 'secondary'}>
              {user.active ? 'Active' : 'Inactive'}
            </Badge>
            <Badge variant="outline">{user.role}</Badge>
            {user.role === 'TRANSPORTER' && user.transporterStatus && (
              <Badge
                variant={TRANSPORTER_STATUS_VARIANT[user.transporterStatus]}
              >
                {TRANSPORTER_STATUS_LABEL[user.transporterStatus]}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-muted-foreground text-sm">{f.label}</dt>
                <dd className="font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
