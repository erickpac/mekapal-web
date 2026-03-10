import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { IncidentSeverity, IncidentStatus, IncidentType } from '@/shared/types'
import type { IncidentItem } from '@/features/incidents/api/incidents.api'
import { IncidentDetailView } from '@/features/incidents/components/IncidentDetailView'
import { IncidentFilters } from '@/features/incidents/components/IncidentFilters'
import { IncidentStatsCards } from '@/features/incidents/components/IncidentStatsCards'
import { IncidentsTable } from '@/features/incidents/components/IncidentsTable'
import {
  useIncidents,
  useIncidentStats,
} from '@/features/incidents/hooks/useIncidents'
import { Pagination } from '@/features/validations/components/Pagination'

export const Route = createFileRoute('/_authenticated/incidents')({
  component: IncidentsPage,
})

const LIMIT = 20

function IncidentsPage() {
  const [status, setStatus] = useState<IncidentStatus>()
  const [severity, setSeverity] = useState<IncidentSeverity>()
  const [type, setType] = useState<IncidentType>()
  const [offset, setOffset] = useState(0)

  const [selected, setSelected] = useState<IncidentItem | null>(null)

  const { data: stats, isLoading: statsLoading } = useIncidentStats()
  const { data, isLoading } = useIncidents({
    status,
    severity,
    type,
    limit: LIMIT,
    offset,
  })

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="size-4" />
          Back to list
        </Button>
        <IncidentDetailView id={selected.id} onDone={() => setSelected(null)} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Incidents</h1>

      <IncidentStatsCards stats={stats} loading={statsLoading} />

      <IncidentFilters
        status={status}
        severity={severity}
        type={type}
        onStatusChange={(v) => {
          setStatus(v)
          setOffset(0)
        }}
        onSeverityChange={(v) => {
          setSeverity(v)
          setOffset(0)
        }}
        onTypeChange={(v) => {
          setType(v)
          setOffset(0)
        }}
      />

      <IncidentsTable
        data={data ?? []}
        loading={isLoading}
        onRowClick={setSelected}
      />

      {data && (
        <Pagination
          offset={offset}
          limit={LIMIT}
          count={data.length}
          onOffsetChange={setOffset}
        />
      )}
    </div>
  )
}
