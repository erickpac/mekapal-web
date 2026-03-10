import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { UserRole } from '../api/users.api'

interface UserFiltersProps {
  role: UserRole | undefined
  search: string
  onRoleChange: (role: UserRole | undefined) => void
  onSearchChange: (search: string) => void
}

export function UserFilters({
  role,
  search,
  onRoleChange,
  onSearchChange,
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
          <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="BACKOFFICE">Backoffice</SelectItem>
          <SelectItem value="CLIENT">Client</SelectItem>
          <SelectItem value="TRANSPORTER">Transporter</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
    </div>
  )
}
