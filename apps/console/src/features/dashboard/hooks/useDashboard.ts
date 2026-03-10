import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../api/dashboard.api'

export function useDashboard(fromDate: string, toDate: string) {
  return useQuery({
    queryKey: ['dashboard', fromDate, toDate],
    queryFn: () => getDashboard(fromDate, toDate),
  })
}
