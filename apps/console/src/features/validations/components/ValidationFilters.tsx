import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ValidationType } from '../api/validations.api'

interface ValidationFiltersProps {
  type: ValidationType | undefined
  search: string
  onTypeChange: (type: ValidationType | undefined) => void
  onSearchChange: (search: string) => void
}

export function ValidationFilters({
  type,
  search,
  onTypeChange,
  onSearchChange,
}: ValidationFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        value={type ?? 'all'}
        onValueChange={(v) =>
          onTypeChange(v === 'all' ? undefined : (v as ValidationType))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="VEHICLE">Vehicle</SelectItem>
          <SelectItem value="TRANSPORTER_PROFILE">Profile</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
