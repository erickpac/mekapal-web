import { ChevronRight, Pencil, Trash2 } from 'lucide-react'
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
import type { LocationItem } from '../api/locations.api'

interface LocationTableProps {
  data: LocationItem[]
  loading?: boolean
  hasChildren?: boolean
  onDrillDown?: (item: LocationItem) => void
  onEdit: (item: LocationItem) => void
  onDelete: (item: LocationItem) => void
}

export function LocationTable({
  data,
  loading,
  hasChildren,
  onDrillDown,
  onEdit,
  onDelete,
}: LocationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 3 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.map((item) => (
              <TableRow
                key={item.id}
                className={hasChildren ? 'cursor-pointer' : undefined}
                onClick={() => hasChildren && onDrillDown?.(item)}
              >
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant={item.active ? 'default' : 'secondary'}>
                    {item.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(item)
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(item)
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                    {hasChildren && (
                      <ChevronRight className="text-muted-foreground ml-1 size-4 self-center" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
        {!loading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={3}
              className="text-muted-foreground text-center"
            >
              No items found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
