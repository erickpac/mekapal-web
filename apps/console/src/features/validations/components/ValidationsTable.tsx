import { useTranslation } from 'react-i18next'
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

const TYPE_LABEL_KEYS: Record<ValidationType, string> = {
  VEHICLE: 'validations.table.typeVehicle',
  TRANSPORTER_PROFILE: 'validations.table.typeProfile',
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
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('validations.table.type')}</TableHead>
          <TableHead>{t('validations.table.transporter')}</TableHead>
          <TableHead>{t('validations.table.summary')}</TableHead>
          <TableHead>{t('validations.table.submittedAt')}</TableHead>
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
                  <Badge variant="outline">
                    {t(TYPE_LABEL_KEYS[item.type])}
                  </Badge>
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
              {t('validations.table.empty')}
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
