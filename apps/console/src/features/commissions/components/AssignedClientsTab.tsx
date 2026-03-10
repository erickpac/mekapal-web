import { useState } from 'react'
import { Loader2, Trash2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useAssignClient,
  useAssignedClients,
  useSearchClients,
  useUnassignClient,
} from '../hooks/useCommissions'

interface AssignedClientsTabProps {
  profileId: string
}

export function AssignedClientsTab({ profileId }: AssignedClientsTabProps) {
  const { data: clients, isLoading } = useAssignedClients(profileId)
  const unassign = useUnassignClient()
  const [assignOpen, setAssignOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAssignOpen(true)}>
          <UserPlus className="size-4" />
          Assign Client
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {new Date(client.assignedAt).toLocaleDateString('es-GT')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setRemoveTarget({ id: client.id, name: client.name })
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          {!isLoading && clients?.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground text-center"
              >
                No clients assigned.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AssignClientDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        profileId={profileId}
      />

      <Dialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Client</DialogTitle>
            <DialogDescription>
              Remove <strong>{removeTarget?.name}</strong> from this billing
              profile?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={unassign.isPending}
              onClick={() => {
                if (removeTarget) {
                  unassign.mutate(
                    { clientId: removeTarget.id, profileId },
                    { onSuccess: () => setRemoveTarget(null) },
                  )
                }
              }}
            >
              {unassign.isPending && <Loader2 className="animate-spin" />}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AssignClientDialog({
  open,
  onOpenChange,
  profileId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileId: string
}) {
  const [query, setQuery] = useState('')
  const { data: results, isLoading } = useSearchClients(query)
  const assign = useAssignClient()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Client</DialogTitle>
          <DialogDescription>
            Search for a client to assign to this billing profile.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="max-h-48 overflow-y-auto">
          {isLoading && (
            <div className="space-y-2 py-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          )}
          {results?.map((client) => (
            <button
              key={client.id}
              className="hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-sm"
              disabled={assign.isPending}
              onClick={() =>
                assign.mutate(
                  { clientId: client.id, profileId },
                  {
                    onSuccess: () => {
                      onOpenChange(false)
                      setQuery('')
                    },
                  },
                )
              }
            >
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-muted-foreground text-xs">{client.email}</p>
              </div>
              {assign.isPending && <Loader2 className="size-4 animate-spin" />}
            </button>
          ))}
          {query.length >= 2 && !isLoading && results?.length === 0 && (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No clients found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
