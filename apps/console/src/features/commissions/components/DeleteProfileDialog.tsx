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

interface DeleteProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileName: string
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteProfileDialog({
  open,
  onOpenChange,
  profileName,
  onConfirm,
  isDeleting,
}: DeleteProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Eliminar perfil de facturación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar <strong>{profileName}</strong>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
