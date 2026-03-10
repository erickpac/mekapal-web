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

function collectPhotos(data: {
  frontPhotoUrl: string | null
  rearPhotoUrl: string | null
  sidePhotoUrl: string | null
  interiorPhotoUrl: string | null
  registrationDocUrl: string | null
  insuranceDocUrl: string | null
}): string[] {
  return [
    data.frontPhotoUrl,
    data.rearPhotoUrl,
    data.sidePhotoUrl,
    data.interiorPhotoUrl,
    data.registrationDocUrl,
    data.insuranceDocUrl,
  ].filter((url): url is string => url !== null)
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
        <h2 className="text-lg font-semibold">Vehicle: {data.licensePlate}</h2>
        <Badge variant="secondary">{data.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Transporter</dt>
            <dd>
              {data.user.firstName} {data.user.lastName}
            </dd>
            <dt className="text-muted-foreground">Brand / Model</dt>
            <dd>
              {data.brand} {data.model}
            </dd>
            <dt className="text-muted-foreground">Year</dt>
            <dd>{data.year}</dd>
            <dt className="text-muted-foreground">Color</dt>
            <dd>{data.color}</dd>
            <dt className="text-muted-foreground">Vehicle Type</dt>
            <dd>{data.vehicleType}</dd>
            <dt className="text-muted-foreground">Load Type</dt>
            <dd>{data.loadType}</dd>
            <dt className="text-muted-foreground">License Plate</dt>
            <dd>{data.licensePlate}</dd>
            <dt className="text-muted-foreground">VIN</dt>
            <dd>{data.vin}</dd>
            <dt className="text-muted-foreground">Max Weight (kg)</dt>
            <dd>{data.maxWeightKg}</dd>
            <dt className="text-muted-foreground">Max Volume (m³)</dt>
            <dd>{data.maxVolumeM3}</dd>
            {data.insuranceExpiration && (
              <>
                <dt className="text-muted-foreground">Insurance Expiration</dt>
                <dd>
                  {new Date(data.insuranceExpiration).toLocaleDateString(
                    'es-GT',
                  )}
                </dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>

      <DocumentViewer images={collectPhotos(data)} />

      {data.status === 'PENDING_REVIEW' && (
        <ApprovalForm
          onApprove={() => approve.mutate({ id }, { onSuccess: onDone })}
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
