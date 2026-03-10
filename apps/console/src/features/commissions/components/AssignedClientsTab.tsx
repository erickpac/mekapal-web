import { useState } from 'react'
import { Loader2 } from 'lucide-react'

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
import { Label } from '@/components/ui/label'
import { useAssignClient, useUnassignClient } from '../hooks/useCommissions'

interface AssignedClientsTabProps {
  profileId: string
}

export function AssignedClientsTab({ profileId }: AssignedClientsTabProps) {
  const assign = useAssignClient()
  const unassign = useUnassignClient()
  const [assignOpen, setAssignOpen] = useState(false)
  const [unassignOpen, setUnassignOpen] = useState(false)
  const [clientId, setClientId] = useState('')

  const handleAssign = () => {
    if (!clientId.trim()) return
    assign.mutate(
      { clientId: clientId.trim(), profileId },
      {
        onSuccess: () => {
          setAssignOpen(false)
          setClientId('')
        },
      },
    )
  }

  const handleUnassign = () => {
    if (!clientId.trim()) return
    unassign.mutate(clientId.trim(), {
      onSuccess: () => {
        setUnassignOpen(false)
        setClientId('')
      },
    })
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Assign or remove clients from this billing profile by entering their
        client ID.
      </p>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setAssignOpen(true)}>
          Assign Client
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUnassignOpen(true)}
        >
          Remove Client
        </Button>
      </div>

      <Dialog
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open)
          if (!open) setClientId('')
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Client</DialogTitle>
            <DialogDescription>
              Enter the client ID to assign to this billing profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="assign-client-id">Client ID</Label>
            <Input
              id="assign-client-id"
              placeholder="Client UUID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!clientId.trim() || assign.isPending}
            >
              {assign.isPending && <Loader2 className="animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={unassignOpen}
        onOpenChange={(open) => {
          setUnassignOpen(open)
          if (!open) setClientId('')
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Client</DialogTitle>
            <DialogDescription>
              Enter the client ID to remove their billing profile assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="unassign-client-id">Client ID</Label>
            <Input
              id="unassign-client-id"
              placeholder="Client UUID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnassignOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnassign}
              disabled={!clientId.trim() || unassign.isPending}
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
