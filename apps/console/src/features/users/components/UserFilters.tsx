import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UserRole } from '@/shared/types'

interface UserFiltersProps {
  role: UserRole | undefined
  search: string
  sort: 'recent' | 'oldest'
  onRoleChange: (role: UserRole | undefined) => void
  onSearchChange: (search: string) => void
  onSortChange: (sort: 'recent' | 'oldest') => void
}

export function UserFilters({
  role,
  search,
  sort,
  onRoleChange,
  onSearchChange,
  onSortChange,
}: UserFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Select
        value={role ?? 'all'}
        onValueChange={(v) =>
          onRoleChange(v === 'all' ? undefined : (v as UserRole))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder={t('users.filters.allRoles')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('users.filters.allRoles')}</SelectItem>
          <SelectItem value="ADMIN">{t('common.roles.ADMIN')}</SelectItem>
          <SelectItem value="BACKOFFICE">
            {t('common.roles.BACKOFFICE')}
          </SelectItem>
          <SelectItem value="CLIENT">{t('common.roles.CLIENT')}</SelectItem>
          <SelectItem value="TRANSPORTER">
            {t('common.roles.TRANSPORTER')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(v) => onSortChange(v as 'recent' | 'oldest')}
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">
            {t('users.filters.sortRecent')}
          </SelectItem>
          <SelectItem value="oldest">
            {t('users.filters.sortOldest')}
          </SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder={t('users.filters.searchPlaceholder')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
