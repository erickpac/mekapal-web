import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { DocumentViewer } from '@/features/validations/components/DocumentViewer'
import type { IncidentSeverity } from '@/shared/types'
import { formatCurrency, formatDate } from '@/shared/utils/format'
import {
  useIncident,
  useResolveIncident,
  useUpdateIncident,
} from '../hooks/useIncidents'
import { ResolveIncidentForm } from './ResolveIncidentForm'

const severityColors: Record<IncidentSeverity, string> = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

interface IncidentDetailViewProps {
  id: string
  onDone: () => void
}

export function IncidentDetailView({ id, onDone }: IncidentDetailViewProps) {
  const { data, isLoading } = useIncident(id)
  const updateIncident = useUpdateIncident()
  const resolveIncident = useResolveIncident()
  const [resolveOpen, setResolveOpen] = useState(false)

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const canResolve = data.status === 'OPEN' || data.status === 'INVESTIGATING'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">{data.incidentNumber}</h2>
        <span
          className={cn(
            'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
            severityColors[data.severity],
          )}
        >
          {data.severity}
        </span>
        <Badge variant="outline">{data.status}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Info del incidente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Tipo</dt>
              <dd className="capitalize">{data.type.toLowerCase()}</dd>
              <dt className="text-muted-foreground">ID de orden</dt>
              <dd className="font-mono text-xs">{data.orderId}</dd>
              <dt className="text-muted-foreground">Reportado por</dt>
              <dd className="font-mono text-xs">
                {data.reportedById.slice(0, 8)}…
              </dd>
              <dt className="text-muted-foreground">Reportado contra</dt>
              <dd className="font-mono text-xs">
                {data.reportedAgainstId.slice(0, 8)}…
              </dd>
              {data.assignedToId && (
                <>
                  <dt className="text-muted-foreground">Asignado a</dt>
                  <dd className="font-mono text-xs">
                    {data.assignedToId.slice(0, 8)}…
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">Creado</dt>
              <dd>{formatDate(data.createdAt)}</dd>
            </dl>
          </CardContent>
        </Card>

        {data.resolution && (
          <Card>
            <CardHeader>
              <CardTitle>Resolución</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Resolución</dt>
                <dd>{data.resolution}</dd>
                <dt className="text-muted-foreground">Acción del usuario</dt>
                <dd>{data.userAction}</dd>
                {data.refundAmount != null && (
                  <>
                    <dt className="text-muted-foreground">Monto de reembolso</dt>
                    <dd>{formatCurrency(data.refundAmount)}</dd>
                  </>
                )}
                {data.resolvedAt && (
                  <>
                    <dt className="text-muted-foreground">Resuelto el</dt>
                    <dd>
                      {formatDate(data.resolvedAt)}
                    </dd>
                  </>
                )}
              </dl>
              {data.resolutionNotes && (
                <p className="text-muted-foreground mt-3 text-sm">
                  {data.resolutionNotes}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Descripción</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{data.description}</p>
        </CardContent>
      </Card>

      {data.internalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas internas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data.internalNotes}</p>
          </CardContent>
        </Card>
      )}

      {data.evidenceUrls.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Evidencia</h3>
          <DocumentViewer images={data.evidenceUrls} />
        </div>
      )}

      {canResolve && (
        <div className="flex gap-2">
          {data.status === 'OPEN' && (
            <Button
              variant="outline"
              onClick={() =>
                updateIncident.mutate({
                  id,
                  data: { status: 'INVESTIGATING' },
                })
              }
              disabled={updateIncident.isPending}
            >
              Iniciar investigación
            </Button>
          )}
          <Button
            onClick={() => setResolveOpen(true)}
            disabled={resolveIncident.isPending}
          >
            Resolver
          </Button>
          <ResolveIncidentForm
            open={resolveOpen}
            onOpenChange={setResolveOpen}
            onSubmit={(resolveData) =>
              resolveIncident.mutate(
                { id, data: resolveData },
                {
                  onSuccess: () => {
                    setResolveOpen(false)
                    onDone()
                  },
                },
              )
            }
            isSubmitting={resolveIncident.isPending}
          />
        </div>
      )}
    </div>
  )
}
