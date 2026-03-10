import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string
  trend: number
  icon: LucideIcon
  loading?: boolean
}

export function KpiCard({
  title,
  value,
  trend,
  icon: Icon,
  loading,
}: KpiCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="size-5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-1 h-7 w-32" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  const isPositive = trend >= 0

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="text-muted-foreground size-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={cn(
            'mt-1 flex items-center gap-1 text-xs',
            isPositive ? 'text-emerald-600' : 'text-red-600',
          )}
        >
          {isPositive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {trend.toFixed(1)}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
