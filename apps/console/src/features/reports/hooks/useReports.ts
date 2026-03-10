import { useQuery } from '@tanstack/react-query'
import type { ReportQuery } from '../api/reports.api'
import * as api from '../api/reports.api'

export function useFinancialSummary(params: ReportQuery) {
  return useQuery({
    queryKey: ['reports', 'financial-summary', params],
    queryFn: () => api.getFinancialSummary(params),
    enabled: !!(params.fromDate && params.toDate) || !!params.preset,
  })
}
