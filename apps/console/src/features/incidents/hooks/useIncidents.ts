import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLocalizedError } from '@/shared/api/useLocalizedError'
import type {
  IncidentFilters,
  ResolveIncidentData,
  UpdateIncidentData,
} from '../api/incidents.api'
import * as api from '../api/incidents.api'

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => api.getIncidents(filters),
  })
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => api.getIncident(id),
    enabled: !!id,
  })
}

export function useIncidentStats() {
  return useQuery({
    queryKey: ['incidents', 'stats'],
    queryFn: api.getIncidentStats,
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentData }) =>
      api.updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success(t('incidents.toast.updateSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useResolveIncident() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResolveIncidentData }) =>
      api.resolveIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
      toast.success(t('incidents.toast.resolveSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
