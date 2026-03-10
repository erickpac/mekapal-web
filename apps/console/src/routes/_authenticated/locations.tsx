import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { requireModule } from '@/shared/utils/route-guard'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type {
  LocationFormData,
  LocationItem,
  LocationLevel,
} from '@/features/locations/api/locations.api'
import { DeleteLocationDialog } from '@/features/locations/components/DeleteLocationDialog'
import { LocationFormDialog } from '@/features/locations/components/LocationFormDialog'
import { LocationTable } from '@/features/locations/components/LocationTable'
import {
  useCountries,
  useCreateCountry,
  useCreateMunicipality,
  useCreateState,
  useCreateZone,
  useDeleteCountry,
  useDeleteMunicipality,
  useDeleteState,
  useDeleteZone,
  useMunicipalities,
  useStates,
  useUpdateCountry,
  useUpdateMunicipality,
  useUpdateState,
  useUpdateZone,
  useZones,
} from '@/features/locations/hooks/useLocations'

export const Route = createFileRoute('/_authenticated/locations')({
  beforeLoad: requireModule('locations'),
  component: LocationsPage,
})

interface BreadcrumbEntry {
  id: string
  name: string
  level: LocationLevel
}

const LEVEL_LABELS: Record<LocationLevel, string> = {
  country: 'Country',
  state: 'State',
  municipality: 'Municipality',
  zone: 'Zone',
}

const LEVEL_PLURAL: Record<LocationLevel, string> = {
  country: 'Countries',
  state: 'States',
  municipality: 'Municipalities',
  zone: 'Zones',
}

function LocationsPage() {
  const [path, setPath] = useState<BreadcrumbEntry[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<LocationItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LocationItem | null>(null)

  const currentLevel = getCurrentLevel(path)
  const parentId = path.length > 0 ? path[path.length - 1].id : ''

  const countries = useCountries()
  const states = useStates(parentId)
  const municipalities = useMunicipalities(parentId)
  const zones = useZones(parentId)

  const createCountry = useCreateCountry()
  const updateCountry = useUpdateCountry()
  const deleteCountry = useDeleteCountry()
  const createState = useCreateState()
  const updateState = useUpdateState()
  const deleteState = useDeleteState()
  const createMunicipality = useCreateMunicipality()
  const updateMunicipality = useUpdateMunicipality()
  const deleteMunicipality = useDeleteMunicipality()
  const createZone = useCreateZone()
  const updateZone = useUpdateZone()
  const deleteZone = useDeleteZone()

  const { data, isLoading } = getQueryForLevel(currentLevel, {
    countries,
    states,
    municipalities,
    zones,
  })

  const hasChildren = currentLevel !== 'zone'

  function handleDrillDown(item: LocationItem) {
    const childLevel = getChildLevel(currentLevel)
    if (childLevel) {
      setPath([...path, { id: item.id, name: item.name, level: currentLevel }])
    }
  }

  function handleBreadcrumbClick(index: number) {
    setPath(path.slice(0, index))
  }

  function handleCreate(formData: LocationFormData) {
    const onSuccess = () => setFormOpen(false)

    switch (currentLevel) {
      case 'country':
        createCountry.mutate([formData], { onSuccess })
        break
      case 'state':
        createState.mutate([parentId, formData], { onSuccess })
        break
      case 'municipality':
        createMunicipality.mutate([parentId, formData], { onSuccess })
        break
      case 'zone':
        createZone.mutate([parentId, formData], { onSuccess })
        break
    }
  }

  function handleUpdate(formData: LocationFormData) {
    if (!editItem) return
    const onSuccess = () => setEditItem(null)

    switch (currentLevel) {
      case 'country':
        updateCountry.mutate([editItem.id, formData], { onSuccess })
        break
      case 'state':
        updateState.mutate([editItem.id, formData], { onSuccess })
        break
      case 'municipality':
        updateMunicipality.mutate([editItem.id, formData], { onSuccess })
        break
      case 'zone':
        updateZone.mutate([editItem.id, formData], { onSuccess })
        break
    }
  }

  function handleDelete() {
    if (!deleteTarget) return
    const onSuccess = () => setDeleteTarget(null)

    switch (currentLevel) {
      case 'country':
        deleteCountry.mutate([deleteTarget.id], { onSuccess })
        break
      case 'state':
        deleteState.mutate([deleteTarget.id], { onSuccess })
        break
      case 'municipality':
        deleteMunicipality.mutate([deleteTarget.id], { onSuccess })
        break
      case 'zone':
        deleteZone.mutate([deleteTarget.id], { onSuccess })
        break
    }
  }

  const isCreating =
    createCountry.isPending ||
    createState.isPending ||
    createMunicipality.isPending ||
    createZone.isPending
  const isUpdating =
    updateCountry.isPending ||
    updateState.isPending ||
    updateMunicipality.isPending ||
    updateZone.isPending
  const isDeleting =
    deleteCountry.isPending ||
    deleteState.isPending ||
    deleteMunicipality.isPending ||
    deleteZone.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Locations</h1>
          <p className="text-muted-foreground">
            Manage the location hierarchy for your operations.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{LEVEL_PLURAL[currentLevel]}</CardTitle>
              <CardDescription>
                {path.length > 0
                  ? `Under ${path[path.length - 1].name}`
                  : 'Top-level countries'}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              Add {LEVEL_LABELS[currentLevel]}
            </Button>
          </div>

          {path.length > 0 && (
            <Breadcrumb className="mt-2">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer"
                    onClick={() => handleBreadcrumbClick(0)}
                  >
                    Countries
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {path.map((entry, i) => (
                  <span key={entry.id} className="contents">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {i === path.length - 1 ? (
                        <BreadcrumbPage>{entry.name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          className="cursor-pointer"
                          onClick={() => handleBreadcrumbClick(i + 1)}
                        >
                          {entry.name}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </CardHeader>

        <CardContent>
          <LocationTable
            data={data ?? []}
            loading={isLoading}
            hasChildren={hasChildren}
            onDrillDown={handleDrillDown}
            onEdit={(item) => setEditItem(item)}
            onDelete={(item) => setDeleteTarget(item)}
          />
        </CardContent>
      </Card>

      <LocationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        levelLabel={LEVEL_LABELS[currentLevel]}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      <LocationFormDialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        levelLabel={LEVEL_LABELS[currentLevel]}
        item={editItem}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
      />

      <DeleteLocationDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        levelLabel={LEVEL_LABELS[currentLevel]}
        itemName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}

function getCurrentLevel(path: BreadcrumbEntry[]): LocationLevel {
  const levels: LocationLevel[] = ['country', 'state', 'municipality', 'zone']
  return levels[Math.min(path.length, levels.length - 1)]
}

function getChildLevel(level: LocationLevel): LocationLevel | null {
  const map: Record<LocationLevel, LocationLevel | null> = {
    country: 'state',
    state: 'municipality',
    municipality: 'zone',
    zone: null,
  }
  return map[level]
}

function getQueryForLevel(
  level: LocationLevel,
  queries: {
    countries: ReturnType<typeof useCountries>
    states: ReturnType<typeof useStates>
    municipalities: ReturnType<typeof useMunicipalities>
    zones: ReturnType<typeof useZones>
  },
) {
  switch (level) {
    case 'country':
      return queries.countries
    case 'state':
      return queries.states
    case 'municipality':
      return queries.municipalities
    case 'zone':
      return queries.zones
  }
}
