import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        value={status ?? 'all'}
        onValueChange={(v) =>
          onStatusChange(v === 'all' ? undefined : (v as IncidentStatus))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('incidents.filters.allStatuses')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('incidents.filters.allStatuses')}
          </SelectItem>
          <SelectItem value="OPEN">
            {t('incidents.filters.statusOpen')}
          </SelectItem>
          <SelectItem value="INVESTIGATING">
            {t('incidents.filters.statusInvestigating')}
          </SelectItem>
          <SelectItem value="RESOLVED">
            {t('incidents.filters.statusResolved')}
          </SelectItem>
          <SelectItem value="CLOSED">
            {t('incidents.filters.statusClosed')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={severity ?? 'all'}
        onValueChange={(v) =>
          onSeverityChange(v === 'all' ? undefined : (v as IncidentSeverity))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t('incidents.filters.allSeverities')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('incidents.filters.allSeverities')}
          </SelectItem>
          <SelectItem value="LOW">
            {t('incidents.filters.severityLow')}
          </SelectItem>
          <SelectItem value="MEDIUM">
            {t('incidents.filters.severityMedium')}
          </SelectItem>
          <SelectItem value="HIGH">
            {t('incidents.filters.severityHigh')}
          </SelectItem>
          <SelectItem value="CRITICAL">
            {t('incidents.filters.severityCritical')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={type ?? 'all'}
        onValueChange={(v) =>
          onTypeChange(v === 'all' ? undefined : (v as IncidentType))
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder={t('incidents.filters.allTypes')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('incidents.filters.allTypes')}</SelectItem>
          <SelectItem value="DAMAGE">
            {t('incidents.filters.typeDamage')}
          </SelectItem>
          <SelectItem value="DELAY">
            {t('incidents.filters.typeDelay')}
          </SelectItem>
          <SelectItem value="LOSS">
            {t('incidents.filters.typeLoss')}
          </SelectItem>
          <SelectItem value="FRAUD">
            {t('incidents.filters.typeFraud')}
          </SelectItem>
          <SelectItem value="OTHER">
            {t('incidents.filters.typeOther')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
