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
  const action = isActive ? 'Desactivar' : 'Activar'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {action} {levelLabel}
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas {action.toLowerCase()}{' '}
            <strong>{itemName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
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
