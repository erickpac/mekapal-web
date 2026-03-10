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
import type {
  IncidentItem,
  IncidentSeverity,
  IncidentStatus,
} from '../api/incidents.api'

const severityColors: Record<IncidentSeverity, string> = {
  LOW: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  MEDIUM:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  CRITICAL: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const statusVariant: Record<
  IncidentStatus,
  'default' | 'secondary' | 'outline'
> = {
  OPEN: 'secondary',
  INVESTIGATING: 'outline',
  RESOLVED: 'default',
}

interface IncidentsTableProps {
  data: IncidentItem[]
  loading?: boolean
  onRowClick: (item: IncidentItem) => void
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
          <TableHead>Severity</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Reported By</TableHead>
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
                <TableCell>{item.reportedBy}</TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString('es-GT')}
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
