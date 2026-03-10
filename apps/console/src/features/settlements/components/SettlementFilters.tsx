import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SettlementStatus } from '@/shared/types'

interface SettlementFiltersProps {
  status: SettlementStatus | undefined
  fromDate: string
  toDate: string
  onStatusChange: (status: SettlementStatus | undefined) => void
  onDateChange: (fromDate: string, toDate: string) => void
}

export function SettlementFilters({
  status,
  fromDate,
  toDate,
  onStatusChange,
  onDateChange,
}: SettlementFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Select
        value={status ?? 'all'}
        onValueChange={(v) =>
          onStatusChange(v === 'all' ? undefined : (v as SettlementStatus))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="PAID">Paid</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid gap-1">
        <Label htmlFor="settle-from" className="text-xs">
          From
        </Label>
        <Input
          id="settle-from"
          type="date"
          value={fromDate}
          onChange={(e) => onDateChange(e.target.value, toDate)}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="settle-to" className="text-xs">
          To
        </Label>
        <Input
          id="settle-to"
          type="date"
          value={toDate}
          onChange={(e) => onDateChange(fromDate, e.target.value)}
        />
      </div>
    </div>
  )
}
