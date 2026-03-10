import { AlertTriangle, Archive, CheckCircle, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { IncidentStats } from '../api/incidents.api'

interface IncidentStatsCardsProps {
  stats?: IncidentStats
  loading?: boolean
}

export function IncidentStatsCards({
  stats,
  loading,
}: IncidentStatsCardsProps) {
  const items = [
    {
      label: 'Open',
      value: stats?.open ?? 0,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      label: 'Investigating',
      value: stats?.investigating ?? 0,
      icon: Eye,
      color: 'text-yellow-600',
    },
    {
      label: 'Resolved',
      value: stats?.resolved ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
    {
      label: 'Closed',
      value: stats?.closed ?? 0,
      icon: Archive,
      color: 'text-gray-600',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {items.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardHeader className="flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {label}
            </CardTitle>
            <Icon className={`size-5 ${color}`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold">{value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
