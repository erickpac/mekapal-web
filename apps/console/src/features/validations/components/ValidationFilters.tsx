import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        value={type ?? 'all'}
        onValueChange={(v) =>
          onTypeChange(v === 'all' ? undefined : (v as ValidationType))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('validations.filters.allTypes')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t('validations.filters.allTypes')}
          </SelectItem>
          <SelectItem value="VEHICLE">
            {t('validations.filters.typeVehicle')}
          </SelectItem>
          <SelectItem value="TRANSPORTER_PROFILE">
            {t('validations.filters.typeProfile')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder={t('validations.filters.searchPlaceholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
