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
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-right">Min</TableHead>
          <TableHead className="text-right">Max</TableHead>
          <TableHead className="text-right">Tax %</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="font-medium">{profile.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{profile.type}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {profile.type === 'PERCENTAGE'
                    ? `${profile.value}%`
                    : `Q${profile.value.toFixed(2)}`}
                </TableCell>
                <TableCell className="text-right">
                  {profile.minAmount != null
                    ? `Q${profile.minAmount.toFixed(2)}`
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  {profile.maxAmount != null
                    ? `Q${profile.maxAmount.toFixed(2)}`
                    : '—'}
                </TableCell>
                <TableCell className="text-right">
                  {profile.taxPercentage}%
                </TableCell>
                <TableCell>
                  <Badge variant={profile.active ? 'default' : 'secondary'}>
                    {profile.active ? 'Active' : 'Inactive'}
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
              No billing profiles found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
