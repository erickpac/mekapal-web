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
        Asigna o elimina clientes de este perfil de facturación ingresando su
        ID de cliente.
      </p>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setAssignOpen(true)}>
          Asignar cliente
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUnassignOpen(true)}
        >
          Eliminar cliente
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
            <DialogTitle>Asignar cliente</DialogTitle>
            <DialogDescription>
              Ingresa el ID del cliente para asignar a este perfil de facturación.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="assign-client-id">ID del cliente</Label>
            <Input
              id="assign-client-id"
              placeholder="UUID del cliente"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!clientId.trim() || assign.isPending}
            >
              {assign.isPending && <Loader2 className="animate-spin" />}
              Asignar
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
            <DialogTitle>Eliminar cliente</DialogTitle>
            <DialogDescription>
              Ingresa el ID del cliente para eliminar su asignación de perfil de facturación.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="unassign-client-id">ID del cliente</Label>
            <Input
              id="unassign-client-id"
              placeholder="UUID del cliente"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnassignOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnassign}
              disabled={!clientId.trim() || unassign.isPending}
            >
              {unassign.isPending && <Loader2 className="animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
