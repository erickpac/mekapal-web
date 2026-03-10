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
} from '../api/incidents.api'

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
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="OPEN">Open</SelectItem>
          <SelectItem value="INVESTIGATING">Investigating</SelectItem>
          <SelectItem value="RESOLVED">Resolved</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={severity ?? 'all'}
        onValueChange={(v) =>
          onSeverityChange(v === 'all' ? undefined : (v as IncidentSeverity))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="CRITICAL">Critical</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={type ?? 'all'}
        onValueChange={(v) =>
          onTypeChange(v === 'all' ? undefined : (v as IncidentType))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="DAMAGE">Damage</SelectItem>
          <SelectItem value="DELAY">Delay</SelectItem>
          <SelectItem value="LOSS">Loss</SelectItem>
          <SelectItem value="FRAUD">Fraud</SelectItem>
          <SelectItem value="OTHER">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
