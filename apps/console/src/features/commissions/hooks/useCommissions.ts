import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
  return useMutation({
    mutationFn: (data: BillingProfileFormData) =>
      api.createBillingProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success('Billing profile created')
    },
    onError: () => {
      toast.error('Failed to create billing profile')
    },
  })
}

export function useUpdateBillingProfile() {
  const queryClient = useQueryClient()
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
      toast.success('Billing profile updated')
    },
    onError: () => {
      toast.error('Failed to update billing profile')
    },
  })
}

export function useDeleteBillingProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteBillingProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success('Billing profile deleted')
    },
    onError: () => {
      toast.error('Failed to delete billing profile')
    },
  })
}

export function useAssignClient() {
  const queryClient = useQueryClient()
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
      toast.success('Client assigned')
    },
    onError: () => {
      toast.error('Failed to assign client')
    },
  })
}

export function useUnassignClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (clientId: string) => api.unassignClient(clientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-profiles'] })
      toast.success('Client removed')
    },
    onError: () => {
      toast.error('Failed to remove client')
    },
  })
}
