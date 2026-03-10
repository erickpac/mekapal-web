import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { RejectionReason, ValidationFilters } from '../api/validations.api'
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
  return useMutation({
    mutationFn: (id: string) => api.approveVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success('Vehicle approved')
    },
    onError: () => {
      toast.error('Failed to approve vehicle')
    },
  })
}

export function useRejectVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: RejectionReason }) =>
      api.rejectVehicle(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success('Vehicle rejected')
    },
    onError: () => {
      toast.error('Failed to reject vehicle')
    },
  })
}

export function useApproveProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.approveProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success('Profile approved')
    },
    onError: () => {
      toast.error('Failed to approve profile')
    },
  })
}

export function useRejectProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: RejectionReason }) =>
      api.rejectProfile(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] })
      toast.success('Profile rejected')
    },
    onError: () => {
      toast.error('Failed to reject profile')
    },
  })
}
