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
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem value="VEHICLE">Vehículo</SelectItem>
          <SelectItem value="TRANSPORTER_PROFILE">Perfil</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Buscar por nombre..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
