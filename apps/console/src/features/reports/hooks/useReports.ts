import { useQuery } from '@tanstack/react-query'

import * as api from '../api/reports.api'

export function useFinancialSummary(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['reports', 'financial-summary', startDate, endDate],
    queryFn: () => api.getFinancialSummary(startDate, endDate),
    enabled: !!startDate && !!endDate,
  })
}
