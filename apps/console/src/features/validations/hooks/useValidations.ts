import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLocalizedError } from '@/shared/api/useLocalizedError'
import type {
  ApproveValidationData,
  RejectValidationData,
  ValidationFilters,
} from '../api/validations.api'
import * as api from '../api/validations.api'

export function useValidations(filters: ValidationFilters) {
  return useQuery({
    queryKey: ['validations', filters],
    queryFn: () => api.getValidations(filters),
  })
}

export function useVehicleDetail(id: string) {
  return useQuery({
    queryKey: ['validations', 'vehicle', id],
    queryFn: () => api.getVehicleDetail(id),
    enabled: !!id,
  })
}

export function useProfileDetail(id: string) {
  return useQuery({
    queryKey: ['validations', 'profile', id],
    queryFn: () => api.getProfileDetail(id),
    enabled: !!id,
  })
}

export function useApproveVehicle() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload?: ApproveValidationData
    }) => api.approveVehicle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success(t('validations.toast.vehicleApproved'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useRejectVehicle() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: RejectValidationData
    }) => api.rejectVehicle(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success(t('validations.toast.vehicleRejected'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useApproveProfile() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload?: ApproveValidationData
    }) => api.approveProfile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success(t('validations.toast.profileApproved'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useRejectProfile() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: RejectValidationData
    }) => api.rejectProfile(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success(t('validations.toast.profileRejected'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
