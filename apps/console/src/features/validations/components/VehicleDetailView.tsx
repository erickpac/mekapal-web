import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ApprovalForm } from './ApprovalForm'
import { DocumentViewer } from './DocumentViewer'
import {
  useApproveVehicle,
  useRejectVehicle,
  useVehicleDetail,
} from '../hooks/useValidations'

interface VehicleDetailViewProps {
  id: string
  onDone: () => void
}

export function VehicleDetailView({ id, onDone }: VehicleDetailViewProps) {
  const { data, isLoading } = useVehicleDetail(id)
  const approve = useApproveVehicle()
  const reject = useRejectVehicle()

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
        <h2 className="text-lg font-semibold">Vehicle: {data.plate}</h2>
        <Badge variant="secondary">{data.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Transporter</dt>
            <dd>{data.transporterName}</dd>
            <dt className="text-muted-foreground">Brand / Model</dt>
            <dd>
              {data.brand} {data.model}
            </dd>
            <dt className="text-muted-foreground">Year</dt>
            <dd>{data.year}</dd>
            <dt className="text-muted-foreground">Color</dt>
            <dd>{data.color}</dd>
            <dt className="text-muted-foreground">Type</dt>
            <dd>{data.type}</dd>
            <dt className="text-muted-foreground">Submitted</dt>
            <dd>{new Date(data.submittedAt).toLocaleDateString('es-GT')}</dd>
          </dl>
        </CardContent>
      </Card>

      <DocumentViewer images={data.photos} />

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
