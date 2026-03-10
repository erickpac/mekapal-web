import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  IncidentSeverity,
  IncidentStatus,
  IncidentType,
} from '@/shared/types'

interface IncidentFiltersProps {
  status: IncidentStatus | undefined
  severity: IncidentSeverity | undefined
  type: IncidentType | undefined
  onStatusChange: (v: IncidentStatus | undefined) => void
  onSeverityChange: (v: IncidentSeverity | undefined) => void
  onTypeChange: (v: IncidentType | undefined) => void
}

export function IncidentFilters({
  status,
  severity,
  type,
  onStatusChange,
  onSeverityChange,
  onTypeChange,
}: IncidentFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        value={status ?? 'all'}
        onValueChange={(v) =>
          onStatusChange(v === 'all' ? undefined : (v as IncidentStatus))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="OPEN">Abierto</SelectItem>
          <SelectItem value="INVESTIGATING">En investigación</SelectItem>
          <SelectItem value="RESOLVED">Resuelto</SelectItem>
          <SelectItem value="CLOSED">Cerrado</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={severity ?? 'all'}
        onValueChange={(v) =>
          onSeverityChange(v === 'all' ? undefined : (v as IncidentSeverity))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Todas las severidades" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las severidades</SelectItem>
          <SelectItem value="LOW">Baja</SelectItem>
          <SelectItem value="MEDIUM">Media</SelectItem>
          <SelectItem value="HIGH">Alta</SelectItem>
          <SelectItem value="CRITICAL">Crítica</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={type ?? 'all'}
        onValueChange={(v) =>
          onTypeChange(v === 'all' ? undefined : (v as IncidentType))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem value="DAMAGE">Daño</SelectItem>
          <SelectItem value="DELAY">Retraso</SelectItem>
          <SelectItem value="LOSS">Pérdida</SelectItem>
          <SelectItem value="FRAUD">Fraude</SelectItem>
          <SelectItem value="OTHER">Otro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
