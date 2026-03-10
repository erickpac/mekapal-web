import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { DocumentViewer } from '@/features/validations/components/DocumentViewer'
import type { IncidentSeverity } from '../api/incidents.api'
import {
  useIncident,
  useResolveIncident,
  useUpdateIncident,
} from '../hooks/useIncidents'
import { IncidentTimeline } from './IncidentTimeline'
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

  const isResolved = data.status === 'RESOLVED'

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold capitalize">
          {data.type.toLowerCase()} Incident
        </h2>
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
            <CardTitle>Reporter</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{data.reportedBy}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{data.reporterEmail}</dd>
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{data.reporterPhone}</dd>
              <dt className="text-muted-foreground">Date</dt>
              <dd>{new Date(data.date).toLocaleDateString('es-GT')}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Order ID</dt>
              <dd className="font-mono text-xs">{data.orderId}</dd>
              <dt className="text-muted-foreground">Description</dt>
              <dd>{data.orderDescription}</dd>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{data.description}</p>
        </CardContent>
      </Card>

      {data.evidence.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">Evidence</h3>
          <DocumentViewer images={data.evidence} />
        </div>
      )}

      <IncidentTimeline entries={data.timeline} />

      {!isResolved && (
        <div className="flex gap-2">
          {data.status === 'OPEN' && (
            <Button
              variant="outline"
              onClick={() =>
                updateIncident.mutate({
                  id,
                  data: {
                    status: 'INVESTIGATING',
                    notes: 'Started investigation',
                  },
                })
              }
              disabled={updateIncident.isPending}
            >
              Start Investigation
            </Button>
          )}
          <Button
            onClick={() => setResolveOpen(true)}
            disabled={resolveIncident.isPending}
          >
            Resolve
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
