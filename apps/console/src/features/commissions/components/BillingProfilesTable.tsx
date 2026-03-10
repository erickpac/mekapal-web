import { Pencil, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BillingProfile } from '../api/commissions.api'

interface BillingProfilesTableProps {
  data: BillingProfile[]
  loading?: boolean
  onEdit: (profile: BillingProfile) => void
  onDelete: (profile: BillingProfile) => void
  onRowClick: (profile: BillingProfile) => void
}

export function BillingProfilesTable({
  data,
  loading,
  onEdit,
  onDelete,
  onRowClick,
}: BillingProfilesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-right">Mín</TableHead>
          <TableHead className="text-right">Máx</TableHead>
          <TableHead className="text-right">Imp. %</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((profile) => (
              <TableRow
                key={profile.id}
                className="cursor-pointer"
                onClick={() => onRowClick(profile)}
              >
                <TableCell className="font-medium">
                  {profile.name}
                  {profile.isDefault && (
                    <Badge variant="outline" className="ml-2">
                      Predeterminado
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{profile.commissionType}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {profile.commissionType === 'PERCENTAGE'
                    ? `${profile.commissionValue}%`
                    : `Q${profile.commissionValue.toFixed(2)}`}
                </TableCell>
                <TableCell className="text-right">
                  {profile.commissionMinimum != null
                    ? `Q${profile.commissionMinimum.toFixed(2)}`
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  {profile.commissionMaximum != null
                    ? `Q${profile.commissionMaximum.toFixed(2)}`
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  {profile.taxPercent}%
                </TableCell>
                <TableCell>
                  <Badge
                    variant={profile.isActive ? 'default' : 'secondary'}
                  >
                    {profile.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(profile)
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(profile)
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-muted-foreground text-center"
            >
              No se encontraron perfiles de facturación.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
