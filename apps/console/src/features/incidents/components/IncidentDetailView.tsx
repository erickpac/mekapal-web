import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
            <CardTitle>{t('incidents.detail.infoTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">
                {t('incidents.detail.type')}
              </dt>
              <dd className="capitalize">{data.type.toLowerCase()}</dd>
              <dt className="text-muted-foreground">
                {t('incidents.detail.orderId')}
              </dt>
              <dd className="font-mono text-xs">{data.orderId}</dd>
              <dt className="text-muted-foreground">
                {t('incidents.detail.reportedBy')}
              </dt>
              <dd className="font-mono text-xs">
                {data.reportedById.slice(0, 8)}…
              </dd>
              <dt className="text-muted-foreground">
                {t('incidents.detail.reportedAgainst')}
              </dt>
              <dd className="font-mono text-xs">
                {data.reportedAgainstId.slice(0, 8)}…
              </dd>
              {data.assignedToId && (
                <>
                  <dt className="text-muted-foreground">
                    {t('incidents.detail.assignedTo')}
                  </dt>
                  <dd className="font-mono text-xs">
                    {data.assignedToId.slice(0, 8)}…
                  </dd>
                </>
              )}
              <dt className="text-muted-foreground">
                {t('incidents.detail.createdAt')}
              </dt>
              <dd>{formatDate(data.createdAt)}</dd>
            </dl>
          </CardContent>
        </Card>

        {data.resolution && (
          <Card>
            <CardHeader>
              <CardTitle>{t('incidents.detail.resolutionTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">
                  {t('incidents.detail.resolution')}
                </dt>
                <dd>{data.resolution}</dd>
                <dt className="text-muted-foreground">
                  {t('incidents.detail.userAction')}
                </dt>
                <dd>{data.userAction}</dd>
                {data.refundAmount != null && (
                  <>
                    <dt className="text-muted-foreground">
                      {t('incidents.detail.refundAmount')}
                    </dt>
                    <dd>{formatCurrency(data.refundAmount)}</dd>
                  </>
                )}
                {data.resolvedAt && (
                  <>
                    <dt className="text-muted-foreground">
                      {t('incidents.detail.resolvedAt')}
                    </dt>
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
          <CardTitle>{t('incidents.detail.descriptionTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{data.description}</p>
        </CardContent>
      </Card>

      {data.internalNotes && (
        <Card>
          <CardHeader>
            <CardTitle>{t('incidents.detail.internalNotesTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{data.internalNotes}</p>
          </CardContent>
        </Card>
      )}

      {data.evidenceUrls.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">
            {t('incidents.detail.evidenceTitle')}
          </h3>
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
              {t('incidents.detail.startInvestigation')}
            </Button>
          )}
          <Button
            onClick={() => setResolveOpen(true)}
            disabled={resolveIncident.isPending}
          >
            {t('incidents.detail.resolve')}
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
