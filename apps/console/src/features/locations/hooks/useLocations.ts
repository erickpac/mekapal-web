import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLocalizedError } from '@/shared/api/useLocalizedError'
import type { LocationFormData } from '../api/locations.api'
import * as api from '../api/locations.api'

export function useCountries() {
  return useQuery({
    queryKey: ['locations', 'countries'],
    queryFn: () => api.getCountries(),
  })
}

export function useStates(countryId: string) {
  return useQuery({
    queryKey: ['locations', 'states', countryId],
    queryFn: () => api.getStates(countryId),
    enabled: !!countryId,
  })
}

export function useMunicipalities(stateId: string) {
  return useQuery({
    queryKey: ['locations', 'municipalities', stateId],
    queryFn: () => api.getMunicipalities(stateId),
    enabled: !!stateId,
  })
}

export function useZones(municipalityId: string) {
  return useQuery({
    queryKey: ['locations', 'zones', municipalityId],
    queryFn: () => api.getZones(municipalityId),
    enabled: !!municipalityId,
  })
}

function useLocationMutation<TArgs extends unknown[]>(
  mutationFn: (...args: TArgs) => Promise<unknown>,
  successKey: string,
) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: (args: TArgs) => mutationFn(...args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      toast.success(t(successKey))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

// --- Countries ---

export function useCreateCountry() {
  return useLocationMutation(
    (data: LocationFormData) => api.createCountry(data),
    'locations.toast.countryCreated',
  )
}

export function useUpdateCountry() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateCountry(id, data),
    'locations.toast.countryUpdated',
  )
}

export function useToggleCountryStatus() {
  return useLocationMutation(
    (id: string) => api.toggleCountryStatus(id),
    'locations.toast.countryStatusUpdated',
  )
}

// --- States ---

export function useCreateState() {
  return useLocationMutation(
    (countryId: string, data: LocationFormData) =>
      api.createState({ ...data, countryId }),
    'locations.toast.stateCreated',
  )
}

export function useUpdateState() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateState(id, data),
    'locations.toast.stateUpdated',
  )
}

export function useToggleStateStatus() {
  return useLocationMutation(
    (id: string) => api.toggleStateStatus(id),
    'locations.toast.stateStatusUpdated',
  )
}

// --- Municipalities ---

export function useCreateMunicipality() {
  return useLocationMutation(
    (stateId: string, data: LocationFormData) =>
      api.createMunicipality({ ...data, stateId }),
    'locations.toast.municipalityCreated',
  )
}

export function useUpdateMunicipality() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateMunicipality(id, data),
    'locations.toast.municipalityUpdated',
  )
}

export function useToggleMunicipalityStatus() {
  return useLocationMutation(
    (id: string) => api.toggleMunicipalityStatus(id),
    'locations.toast.municipalityStatusUpdated',
  )
}

// --- Zones ---

export function useCreateZone() {
  return useLocationMutation(
    (municipalityId: string, data: LocationFormData) =>
      api.createZone({
        name: data.name,
        postalCode: data.code,
        municipalityId,
        latitude: data.latitude,
        longitude: data.longitude,
      }),
    'locations.toast.zoneCreated',
  )
}

export function useUpdateZone() {
  return useLocationMutation(
    (id: string, data: LocationFormData) =>
      api.updateZone(id, {
        name: data.name,
        postalCode: data.code,
        latitude: data.latitude,
        longitude: data.longitude,
      }),
    'locations.toast.zoneUpdated',
  )
}

export function useToggleZoneStatus() {
  return useLocationMutation(
    (id: string) => api.toggleZoneStatus(id),
    'locations.toast.zoneStatusUpdated',
  )
}
