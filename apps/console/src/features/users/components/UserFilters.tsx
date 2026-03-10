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
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Select
        value={role ?? 'all'}
        onValueChange={(v) =>
          onRoleChange(v === 'all' ? undefined : (v as UserRole))
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Todos los roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="BACKOFFICE">Backoffice</SelectItem>
          <SelectItem value="CLIENT">Cliente</SelectItem>
          <SelectItem value="TRANSPORTER">Transportista</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => onSortChange(v as 'recent' | 'oldest')}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Recientes</SelectItem>
          <SelectItem value="oldest">Antiguos</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Buscar por nombre o correo..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
