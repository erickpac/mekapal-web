import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  ValidationItem,
  ValidationType,
} from '@/features/validations/api/validations.api'
import { Pagination } from '@/features/validations/components/Pagination'
import { ProfileDetailView } from '@/features/validations/components/ProfileDetailView'
import { ValidationFilters } from '@/features/validations/components/ValidationFilters'
import { ValidationsTable } from '@/features/validations/components/ValidationsTable'
import { VehicleDetailView } from '@/features/validations/components/VehicleDetailView'
import { useValidations } from '@/features/validations/hooks/useValidations'

export const Route = createFileRoute('/_authenticated/validations')({
  component: ValidationsPage,
})

function ValidationsPage() {
  const [type, setType] = useState<ValidationType>()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  const [selected, setSelected] = useState<ValidationItem | null>(null)

  const { data, isLoading } = useValidations({
    type,
    search: search || undefined,
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

        {selected.type === 'vehicle' ? (
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
