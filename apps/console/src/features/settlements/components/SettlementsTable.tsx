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
import { formatCurrency, formatDate } from '@/shared/utils/format'
import type { Settlement } from '../api/settlements.api'

interface SettlementsTableProps {
  data: Settlement[]
  loading?: boolean
  onRowClick: (item: Settlement) => void
}

export function SettlementsTable({
  data,
  loading,
  onRowClick,
}: SettlementsTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('settlements.table.transporterId')}</TableHead>
          <TableHead>{t('settlements.table.orderId')}</TableHead>
          <TableHead className="text-right">
            {t('settlements.table.amount')}
          </TableHead>
          <TableHead>{t('settlements.table.status')}</TableHead>
          <TableHead>{t('settlements.table.createdAt')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
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
                  {item.transporterId.slice(0, 8)}…
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {item.orderId.slice(0, 8)}…
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.amount)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === 'PAID' ? 'default' : 'secondary'}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(item.createdAt)}
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-muted-foreground text-center"
            >
              {t('settlements.table.empty')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
