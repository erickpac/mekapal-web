import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  return (
    <div className="flex items-end gap-3">
      <div className="grid gap-1">
        <Label htmlFor="start-date" className="text-xs">
          From
        </Label>
        <Input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onChange(e.target.value, endDate)}
        />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="end-date" className="text-xs">
          To
        </Label>
        <Input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onChange(startDate, e.target.value)}
        />
      </div>
    </div>
  )
}
