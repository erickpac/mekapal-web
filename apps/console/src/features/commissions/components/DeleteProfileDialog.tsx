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
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('commissions.delete.title')}</DialogTitle>
          <DialogDescription>
            {t('commissions.delete.confirmPrefix')}
            <strong>{profileName}</strong>
            {t('commissions.delete.confirmSuffix')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.actions.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="animate-spin" />}
            {t('common.actions.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
