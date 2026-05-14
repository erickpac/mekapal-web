import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  Zone,
} from '@/features/locations/api/locations.api'
import { LocationFormDialog } from '@/features/locations/components/LocationFormDialog'
import { LocationTable } from '@/features/locations/components/LocationTable'
import { ToggleStatusDialog } from '@/features/locations/components/ToggleStatusDialog'
import {
  useCountries,
  useCreateCountry,
  useCreateMunicipality,
  useCreateState,
  useCreateZone,
  useMunicipalities,
  useStates,
  useToggleCountryStatus,
  useToggleMunicipalityStatus,
  useToggleStateStatus,
  useToggleZoneStatus,
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

const LEVEL_LABEL_KEYS: Record<LocationLevel, string> = {
  country: 'locations.levels.country',
  state: 'locations.levels.state',
  municipality: 'locations.levels.municipality',
  zone: 'locations.levels.zone',
}

const LEVEL_PLURAL_KEYS: Record<LocationLevel, string> = {
  country: 'locations.levelsPlural.country',
  state: 'locations.levelsPlural.state',
  municipality: 'locations.levelsPlural.municipality',
  zone: 'locations.levelsPlural.zone',
}

function LocationsPage() {
  const { t } = useTranslation()
  const [path, setPath] = useState<BreadcrumbEntry[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<LocationItem | null>(null)
  const [toggleTarget, setToggleTarget] = useState<LocationItem | null>(null)

  const currentLevel = getCurrentLevel(path)
  const parentId = path.length > 0 ? path[path.length - 1].id : ''

  const countries = useCountries()
  const states = useStates(parentId)
  const municipalities = useMunicipalities(parentId)
  const zones = useZones(parentId)

  const createCountry = useCreateCountry()
  const updateCountry = useUpdateCountry()
  const toggleCountry = useToggleCountryStatus()
  const createState = useCreateState()
  const updateState = useUpdateState()
  const toggleState = useToggleStateStatus()
  const createMunicipality = useCreateMunicipality()
  const updateMunicipality = useUpdateMunicipality()
  const toggleMunicipality = useToggleMunicipalityStatus()
  const createZone = useCreateZone()
  const updateZone = useUpdateZone()
  const toggleZone = useToggleZoneStatus()

  const { data, isLoading } = getQueryForLevel(currentLevel, {
    countries,
    states,
    municipalities,
    zones,
  })

  const hasChildren = currentLevel !== 'zone'
  const isZoneLevel = currentLevel === 'zone'

  const levelLabel = t(LEVEL_LABEL_KEYS[currentLevel])
  const levelPlural = t(LEVEL_PLURAL_KEYS[currentLevel])
  const codeLabel = isZoneLevel
    ? t('locations.table.postalCode')
    : t('locations.table.code')

  // Memoized so consumers' effects can depend on it without re-running on
  // every render of this route.
  const getCode = useMemo(
    () =>
      isZoneLevel
        ? (item: LocationItem) => (item as Zone).postalCode
        : undefined,
    [isZoneLevel],
  )

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

  function handleToggleStatus() {
    if (!toggleTarget) return
    const onSuccess = () => setToggleTarget(null)

    switch (currentLevel) {
      case 'country':
        toggleCountry.mutate([toggleTarget.id], { onSuccess })
        break
      case 'state':
        toggleState.mutate([toggleTarget.id], { onSuccess })
        break
      case 'municipality':
        toggleMunicipality.mutate([toggleTarget.id], { onSuccess })
        break
      case 'zone':
        toggleZone.mutate([toggleTarget.id], { onSuccess })
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
  const isToggling =
    toggleCountry.isPending ||
    toggleState.isPending ||
    toggleMunicipality.isPending ||
    toggleZone.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('locations.page.title')}</h1>
          <p className="text-muted-foreground">
            {t('locations.page.subtitle')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{levelPlural}</CardTitle>
              <CardDescription>
                {path.length > 0
                  ? t('locations.card.insideOf', {
                      name: path[path.length - 1].name,
                    })
                  : t('locations.card.topLevelCountries')}
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="size-4" />
              {t('locations.card.addButton', { level: levelLabel })}
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
                    {t('locations.breadcrumb.countries')}
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
            codeLabel={codeLabel}
            getCode={getCode}
            onDrillDown={handleDrillDown}
            onEdit={(item) => setEditItem(item)}
            onToggleStatus={(item) => setToggleTarget(item)}
          />
        </CardContent>
      </Card>

      <LocationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        levelLabel={levelLabel}
        codeLabel={codeLabel}
        getCode={getCode}
        showCoordinates={isZoneLevel}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />

      <LocationFormDialog
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        levelLabel={levelLabel}
        codeLabel={codeLabel}
        getCode={getCode}
        showCoordinates={isZoneLevel}
        item={editItem}
        onSubmit={handleUpdate}
        isSubmitting={isUpdating}
      />

      <ToggleStatusDialog
        open={!!toggleTarget}
        onOpenChange={(open) => !open && setToggleTarget(null)}
        levelLabel={levelLabel}
        itemName={toggleTarget?.name ?? ''}
        isActive={toggleTarget?.isActive ?? true}
        onConfirm={handleToggleStatus}
        isPending={isToggling}
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
