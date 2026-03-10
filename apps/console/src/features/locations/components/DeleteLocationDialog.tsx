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

interface DeleteLocationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  levelLabel: string
  itemName: string
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteLocationDialog({
  open,
  onOpenChange,
  levelLabel,
  itemName,
  onConfirm,
  isDeleting,
}: DeleteLocationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete {levelLabel}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{itemName}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
