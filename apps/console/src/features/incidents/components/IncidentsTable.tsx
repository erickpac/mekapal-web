import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { IncidentSeverity, IncidentStatus } from '@/shared/types'
import type { Incident } from '../api/incidents.api'

const severityColors: Record<IncidentSeverity, string> = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const statusVariant: Record<
  IncidentStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  OPEN: 'secondary',
  INVESTIGATING: 'outline',
  RESOLVED: 'default',
  CLOSED: 'destructive',
}

interface IncidentsTableProps {
  data: Incident[]
  loading?: boolean
  onRowClick: (item: Incident) => void
}

export function IncidentsTable({
  data,
  loading,
  onRowClick,
}: IncidentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Incident #</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => onRowClick(item)}
              >
                <TableCell className="font-mono text-xs">
                  {item.incidentNumber}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
                      severityColors[item.severity],
                    )}
                  >
                    {item.severity}
                  </span>
                </TableCell>
                <TableCell className="capitalize">
                  {item.type.toLowerCase()}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[item.status]}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-48 truncate">
                  {item.description}
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString('es-GT')}
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-muted-foreground text-center"
            >
              No incidents found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
