import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
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
  successMsg: string,
  errorMsg: string,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (args: TArgs) => mutationFn(...args),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      toast.success(successMsg)
    },
    onError: () => {
      toast.error(errorMsg)
    },
  })
}

// --- Countries ---

export function useCreateCountry() {
  return useLocationMutation(
    (data: LocationFormData) => api.createCountry(data),
    'Country created',
    'Failed to create country',
  )
}

export function useUpdateCountry() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateCountry(id, data),
    'Country updated',
    'Failed to update country',
  )
}

export function useToggleCountryStatus() {
  return useLocationMutation(
    (id: string) => api.toggleCountryStatus(id),
    'Country status updated',
    'Failed to update country status',
  )
}

// --- States ---

export function useCreateState() {
  return useLocationMutation(
    (countryId: string, data: LocationFormData) =>
      api.createState({ ...data, countryId }),
    'State created',
    'Failed to create state',
  )
}

export function useUpdateState() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateState(id, data),
    'State updated',
    'Failed to update state',
  )
}

export function useToggleStateStatus() {
  return useLocationMutation(
    (id: string) => api.toggleStateStatus(id),
    'State status updated',
    'Failed to update state status',
  )
}

// --- Municipalities ---

export function useCreateMunicipality() {
  return useLocationMutation(
    (stateId: string, data: LocationFormData) =>
      api.createMunicipality({ ...data, stateId }),
    'Municipality created',
    'Failed to create municipality',
  )
}

export function useUpdateMunicipality() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateMunicipality(id, data),
    'Municipality updated',
    'Failed to update municipality',
  )
}

export function useToggleMunicipalityStatus() {
  return useLocationMutation(
    (id: string) => api.toggleMunicipalityStatus(id),
    'Municipality status updated',
    'Failed to update municipality status',
  )
}

// --- Zones ---

export function useCreateZone() {
  return useLocationMutation(
    (municipalityId: string, data: LocationFormData) =>
      api.createZone({ ...data, municipalityId }),
    'Zone created',
    'Failed to create zone',
  )
}

export function useUpdateZone() {
  return useLocationMutation(
    (id: string, data: LocationFormData) => api.updateZone(id, data),
    'Zone updated',
    'Failed to update zone',
  )
}

export function useToggleZoneStatus() {
  return useLocationMutation(
    (id: string) => api.toggleZoneStatus(id),
    'Zone status updated',
    'Failed to update zone status',
  )
}
