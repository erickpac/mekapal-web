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

interface ToggleStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  levelLabel: string
  itemName: string
  isActive: boolean
  onConfirm: () => void
  isPending?: boolean
}

export function ToggleStatusDialog({
  open,
  onOpenChange,
  levelLabel,
  itemName,
  isActive,
  onConfirm,
  isPending,
}: ToggleStatusDialogProps) {
  const { t } = useTranslation()
  const action = isActive
    ? t('locations.toggle.deactivate')
    : t('locations.toggle.activate')
  const actionLower = isActive
    ? t('locations.toggle.deactivateLower')
    : t('locations.toggle.activateLower')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {t('locations.toggle.title', { action, level: levelLabel })}
          </DialogTitle>
          <DialogDescription>
            {t('locations.toggle.confirmPrefix', { action: actionLower })}
            <strong>{itemName}</strong>
            {t('locations.toggle.confirmSuffix')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.actions.cancel')}
          </Button>
          <Button
            variant={isActive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
