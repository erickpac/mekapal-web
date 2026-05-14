import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useLocalizedError } from '@/shared/api/useLocalizedError'
import type {
  BillingProfileFormData,
  UpdateBillingProfileData,
} from '../api/commissions.api'
import * as api from '../api/commissions.api'

export function useBillingProfiles() {
  return useQuery({
    queryKey: ['billing-profiles'],
    queryFn: api.getBillingProfiles,
  })
}

export function useBillingProfile(id: string) {
  return useQuery({
    queryKey: ['billing-profiles', id],
    queryFn: () => api.getBillingProfile(id),
    enabled: !!id,
  })
}

export function useCreateBillingProfile() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: (data: BillingProfileFormData) =>
      api.createBillingProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success(t('commissions.toast.createSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUpdateBillingProfile() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateBillingProfileData
    }) => api.updateBillingProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success(t('commissions.toast.updateSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useDeleteBillingProfile() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: (id: string) => api.deleteBillingProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success(t('commissions.toast.deleteSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useAssignClient() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({
      clientId,
      profileId,
    }: {
      clientId: string
      profileId: string
    }) => api.assignClient(clientId, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success(t('commissions.toast.assignSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export function useUnassignClient() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: (clientId: string) => api.unassignClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success(t('commissions.toast.unassignSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
