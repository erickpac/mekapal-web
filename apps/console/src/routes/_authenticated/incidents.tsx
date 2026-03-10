import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  IncidentItem,
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from '@/features/incidents/api/incidents.api'
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

function IncidentsPage() {
  const [status, setStatus] = useState<IncidentStatus>()
  const [severity, setSeverity] = useState<IncidentSeverity>()
  const [type, setType] = useState<IncidentType>()
  const [page, setPage] = useState(1)
  const pageSize = 20

  const [selected, setSelected] = useState<IncidentItem | null>(null)

  const { data: stats, isLoading: statsLoading } = useIncidentStats()
  const { data, isLoading } = useIncidents({
    status,
    severity,
    type,
    page,
    pageSize,
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
          setPage(1)
        }}
        onSeverityChange={(v) => {
          setSeverity(v)
          setPage(1)
        }}
        onTypeChange={(v) => {
          setType(v)
          setPage(1)
        }}
      />

      <IncidentsTable
        data={data?.data ?? []}
        loading={isLoading}
        onRowClick={setSelected}
      />

      {data && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={data.total}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
