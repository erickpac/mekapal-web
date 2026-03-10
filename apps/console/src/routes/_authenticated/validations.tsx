import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  ValidationItem,
  ValidationType,
} from '@/features/validations/api/validations.api'
import { ProfileDetailView } from '@/features/validations/components/ProfileDetailView'
import { ValidationFilters } from '@/features/validations/components/ValidationFilters'
import { ValidationsTable } from '@/features/validations/components/ValidationsTable'
import { VehicleDetailView } from '@/features/validations/components/VehicleDetailView'
import { useValidations } from '@/features/validations/hooks/useValidations'

export const Route = createFileRoute('/_authenticated/validations')({
  component: ValidationsPage,
})

const LIMIT = 20

function ValidationsPage() {
  const [type, setType] = useState<ValidationType>()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [selected, setSelected] = useState<ValidationItem | null>(null)

  const { data, isLoading } = useValidations({
    type,
    search: search || undefined,
    limit: LIMIT,
    page,
  })

  const items = data?.data ?? []
  const pagination = data?.pagination

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="size-4" />
          Back to list
        </Button>

        {selected.type === 'VEHICLE' ? (
          <VehicleDetailView
            id={selected.id}
            onDone={() => setSelected(null)}
          />
        ) : (
          <ProfileDetailView
            id={selected.id}
            onDone={() => setSelected(null)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Validations</h1>

      <ValidationFilters
        type={type}
        search={search}
        onTypeChange={(t) => {
          setType(t)
          setPage(1)
        }}
        onSearchChange={(s) => {
          setSearch(s)
          setPage(1)
        }}
      />

      <ValidationsTable
        data={items}
        loading={isLoading}
        onRowClick={setSelected}
      />

      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            {pagination.total} result{pagination.total !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
