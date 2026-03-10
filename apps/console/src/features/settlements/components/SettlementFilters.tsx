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
  startDate: string
  endDate: string
  search: string
  onStatusChange: (status: SettlementStatus | undefined) => void
  onDateChange: (start: string, end: string) => void
  onSearchChange: (search: string) => void
}

export function SettlementFilters({
  status,
  startDate,
  endDate,
  search,
  onStatusChange,
  onDateChange,
  onSearchChange,
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
        <Label htmlFor="settle-start" className="text-xs">
          From
        </Label>
        <Input
          id="settle-start"
          type="date"
          value={startDate}
          onChange={(e) => onDateChange(e.target.value, endDate)}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="settle-end" className="text-xs">
          To
        </Label>
        <Input
          id="settle-end"
          type="date"
          value={endDate}
          onChange={(e) => onDateChange(startDate, e.target.value)}
        />
      </div>

      <Input
        placeholder="Search transporter..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
