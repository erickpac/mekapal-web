import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { RevenueBreakdownItem } from '../api/reports.api'

const Q = (v: number) =>
  v.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ' })

interface RevenueBreakdownTableProps {
  data: RevenueBreakdownItem[]
  loading?: boolean
}

export function RevenueBreakdownTable({
  data,
  loading,
}: RevenueBreakdownTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Commissions</TableHead>
          <TableHead className="text-right">Tax</TableHead>
          <TableHead className="text-right">Orders</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((item) => (
              <TableRow key={item.category}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell className="text-right">
                  {Q(item.totalRevenue)}
                </TableCell>
                <TableCell className="text-right">
                  {Q(item.totalCommissions)}
                </TableCell>
                <TableCell className="text-right">{Q(item.totalTax)}</TableCell>
                <TableCell className="text-right">
                  {item.orderCount.toLocaleString('es-GT')}
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-muted-foreground text-center"
            >
              No data available for the selected period.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
