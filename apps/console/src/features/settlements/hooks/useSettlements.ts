import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type {
  RecordPaymentData,
  SettlementFilters,
} from '../api/settlements.api'
import * as api from '../api/settlements.api'

export function useSettlements(filters: SettlementFilters) {
  return useQuery({
    queryKey: ['settlements', filters],
    queryFn: () => api.getSettlements(filters),
  })
}

export function useSettlement(id: string) {
  return useQuery({
    queryKey: ['settlements', id],
    queryFn: () => api.getSettlement(id),
    enabled: !!id,
  })
}

export function useRecordPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordPaymentData }) =>
      api.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] })
      toast.success('Payment recorded successfully')
    },
    onError: () => {
      toast.error('Failed to record payment')
    },
  })
}
