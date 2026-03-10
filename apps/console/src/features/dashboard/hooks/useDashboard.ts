import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../api/dashboard.api'

export function useDashboard(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['dashboard', startDate, endDate],
    queryFn: () => getDashboard(startDate, endDate),
  })
}
