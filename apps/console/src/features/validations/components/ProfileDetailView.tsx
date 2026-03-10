import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ApprovalForm } from './ApprovalForm'
import { DocumentViewer } from './DocumentViewer'
import {
  useApproveProfile,
  useProfileDetail,
  useRejectProfile,
} from '../hooks/useValidations'

interface ProfileDetailViewProps {
  id: string
  onDone: () => void
}

function collectDocuments(data: {
  licenseFrontPhotoUrl: string | null
  licenseBackPhotoUrl: string | null
  idPhotoUrl: string | null
}): string[] {
  return [
    data.licenseFrontPhotoUrl,
    data.licenseBackPhotoUrl,
    data.idPhotoUrl,
  ].filter((url): url is string => url !== null)
}

export function ProfileDetailView({ id, onDone }: ProfileDetailViewProps) {
  const { data, isLoading } = useProfileDetail(id)
  const approve = useApproveProfile()
  const reject = useRejectProfile()

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {data.user.firstName} {data.user.lastName}
        </h2>
        <Badge variant="secondary">{data.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{data.user.email}</dd>
            <dt className="text-muted-foreground">Phone</dt>
            <dd>{data.user.phone ?? '—'}</dd>
            <dt className="text-muted-foreground">License Number</dt>
            <dd>{data.licenseNumber}</dd>
            {data.licenseExpiration && (
              <>
                <dt className="text-muted-foreground">License Expiration</dt>
                <dd>
                  {new Date(data.licenseExpiration).toLocaleDateString('es-GT')}
                </dd>
              </>
            )}
            <dt className="text-muted-foreground">City</dt>
            <dd>{data.city}</dd>
            <dt className="text-muted-foreground">State</dt>
            <dd>{data.state}</dd>
            {data.address && (
              <>
                <dt className="text-muted-foreground">Address</dt>
                <dd>{data.address}</dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      <DocumentViewer images={collectDocuments(data)} />

      {data.status === 'PENDING_REVIEW' && (
        <ApprovalForm
          onApprove={() =>
            approve.mutate({ id }, { onSuccess: onDone })
          }
          onReject={(payload) =>
            reject.mutate({ id, payload }, { onSuccess: onDone })
          }
          isApproving={approve.isPending}
          isRejecting={reject.isPending}
        />
      )}
    </div>
  )
}
