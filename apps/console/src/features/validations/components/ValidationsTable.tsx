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
import { formatDate } from '@/shared/utils/format'
import type { ValidationItem, ValidationType } from '../api/validations.api'

const typeLabels: Record<ValidationType, string> = {
  VEHICLE: 'Vehículo',
  TRANSPORTER_PROFILE: 'Perfil',
}

interface ValidationsTableProps {
  data: ValidationItem[]
  loading?: boolean
  onRowClick: (item: ValidationItem) => void
}

export function ValidationsTable({
  data,
  loading,
  onRowClick,
}: ValidationsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo</TableHead>
          <TableHead>Transportista</TableHead>
          <TableHead>Resumen</TableHead>
          <TableHead>Fecha de envío</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              </TableRow>
            ))
          : data.map((item) => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => onRowClick(item)}
              >
                <TableCell>
                  <Badge variant="outline">{typeLabels[item.type]}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {item.transporter.firstName} {item.transporter.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatSummary(item)}
                </TableCell>
                <TableCell>
                  {formatDate(item.createdAt)}
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-muted-foreground text-center"
            >
              No se encontraron validaciones.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

function formatSummary(item: ValidationItem): string {
  const s = item.summary
  if (item.type === 'VEHICLE') {
    return [s.brand, s.model, s.year, s.licensePlate]
      .filter(Boolean)
      .join(' · ')
  }
  return [s.licenseNumber, s.city, s.state].filter(Boolean).join(' · ')
}
