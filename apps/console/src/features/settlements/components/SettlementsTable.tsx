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
import type { SettlementItem } from '../api/settlements.api'

function formatQ(value: number) {
  return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`
}

interface SettlementsTableProps {
  data: SettlementItem[]
  loading?: boolean
  onRowClick: (item: SettlementItem) => void
}

export function SettlementsTable({
  data,
  loading,
  onRowClick,
}: SettlementsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transporter</TableHead>
          <TableHead>Order ID</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Commission</TableHead>
          <TableHead className="text-right">Net Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
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
                <TableCell className="font-medium">
                  {item.transporterName}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {item.orderId}
                </TableCell>
                <TableCell className="text-right">
                  {formatQ(item.amount)}
                </TableCell>
                <TableCell className="text-right">
                  {formatQ(item.commission)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatQ(item.netAmount)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === 'PAID' ? 'default' : 'secondary'}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(item.date).toLocaleDateString('es-GT')}
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-muted-foreground text-center"
            >
              No settlements found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
