import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
        {t('commissions.clients.instructions')}
      </p>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setAssignOpen(true)}>
          {t('commissions.clients.assignButton')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUnassignOpen(true)}
        >
          {t('commissions.clients.unassignButton')}
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
            <DialogTitle>{t('commissions.clients.assignTitle')}</DialogTitle>
            <DialogDescription>
              {t('commissions.clients.assignDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="assign-client-id">
              {t('commissions.clients.clientIdLabel')}
            </Label>
            <Input
              id="assign-client-id"
              placeholder={t('commissions.clients.clientIdPlaceholder')}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!clientId.trim() || assign.isPending}
            >
              {assign.isPending && <Loader2 className="animate-spin" />}
              {t('common.actions.assign')}
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
            <DialogTitle>{t('commissions.clients.unassignTitle')}</DialogTitle>
            <DialogDescription>
              {t('commissions.clients.unassignDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="unassign-client-id">
              {t('commissions.clients.clientIdLabel')}
            </Label>
            <Input
              id="unassign-client-id"
              placeholder={t('commissions.clients.clientIdPlaceholder')}
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnassignOpen(false)}>
              {t('common.actions.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnassign}
              disabled={!clientId.trim() || unassign.isPending}
            >
              {unassign.isPending && <Loader2 className="animate-spin" />}
              {t('common.actions.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
