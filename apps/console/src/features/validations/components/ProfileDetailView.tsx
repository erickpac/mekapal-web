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
        <h2 className="text-lg font-semibold">{data.name}</h2>
        <Badge variant="secondary">{data.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{data.email}</dd>
            <dt className="text-muted-foreground">Phone</dt>
            <dd>{data.phone}</dd>
            <dt className="text-muted-foreground">DPI</dt>
            <dd>{data.dpi}</dd>
            <dt className="text-muted-foreground">Submitted</dt>
            <dd>{new Date(data.submittedAt).toLocaleDateString('es-GT')}</dd>
          </dl>
        </CardContent>
      </Card>

      <DocumentViewer images={data.documents} />

      {data.status === 'pending' && (
        <ApprovalForm
          onApprove={() => approve.mutate(id, { onSuccess: onDone })}
          onReject={(reason) =>
            reject.mutate({ id, reason }, { onSuccess: onDone })
          }
          isApproving={approve.isPending}
          isRejecting={reject.isPending}
        />
      )}
    </div>
  )
}
