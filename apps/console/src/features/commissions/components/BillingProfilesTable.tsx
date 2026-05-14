import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('commissions.table.name')}</TableHead>
          <TableHead>{t('commissions.table.type')}</TableHead>
          <TableHead className="text-right">
            {t('commissions.table.value')}
          </TableHead>
          <TableHead className="text-right">
            {t('commissions.table.min')}
          </TableHead>
          <TableHead className="text-right">
            {t('commissions.table.max')}
          </TableHead>
          <TableHead className="text-right">
            {t('commissions.table.taxPercent')}
          </TableHead>
          <TableHead>{t('commissions.table.status')}</TableHead>
          <TableHead className="text-right">
            {t('commissions.table.actions')}
          </TableHead>
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
                      {t('commissions.table.default')}
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
                    {profile.isActive
                      ? t('commissions.status.active')
                      : t('commissions.status.inactive')}
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
              {t('commissions.table.empty')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
