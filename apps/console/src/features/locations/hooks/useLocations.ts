import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { LocationFormData } from '../api/locations.api'
import * as api from '../api/locations.api'

export function useCountries() {
  return useQuery({
    queryKey: ['locations', 'countries'],
    queryFn: api.getCountries,
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

export function useDeleteCountry() {
  return useLocationMutation(
    (id: string) => api.deleteCountry(id),
    'Country deleted',
    'Failed to delete country',
  )
}

export function useCreateState() {
  return useLocationMutation(
    (countryId: string, data: LocationFormData) =>
      api.createState(countryId, data),
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

export function useDeleteState() {
  return useLocationMutation(
    (id: string) => api.deleteState(id),
    'State deleted',
    'Failed to delete state',
  )
}

export function useCreateMunicipality() {
  return useLocationMutation(
    (stateId: string, data: LocationFormData) =>
      api.createMunicipality(stateId, data),
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

export function useDeleteMunicipality() {
  return useLocationMutation(
    (id: string) => api.deleteMunicipality(id),
    'Municipality deleted',
    'Failed to delete municipality',
  )
}

export function useCreateZone() {
  return useLocationMutation(
    (municipalityId: string, data: LocationFormData) =>
      api.createZone(municipalityId, data),
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

export function useDeleteZone() {
  return useLocationMutation(
    (id: string) => api.deleteZone(id),
    'Zone deleted',
    'Failed to delete zone',
  )
}
