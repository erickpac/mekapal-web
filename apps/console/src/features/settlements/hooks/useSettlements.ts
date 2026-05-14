import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLocalizedError } from '@/shared/api/useLocalizedError'
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
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordPaymentData }) =>
      api.recordPayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] })
      toast.success(t('settlements.toast.recordPaymentSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
