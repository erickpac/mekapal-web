import { useState } from 'react'
import type { TFunction } from 'i18next'
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
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type {
  RejectionCategory,
  RejectValidationData,
} from '../api/validations.api'

const getRejectionCategories = (
  t: TFunction,
): { value: RejectionCategory; label: string }[] => [
  {
    value: 'POOR_QUALITY_PHOTOS',
    label: t('validations.reject.categories.poorQualityPhotos'),
  },
  {
    value: 'EXPIRED_DOCUMENTS',
    label: t('validations.reject.categories.expiredDocuments'),
  },
  {
    value: 'INFORMATION_MISMATCH',
    label: t('validations.reject.categories.informationMismatch'),
  },
  {
    value: 'ADDITIONAL_DOCUMENTATION_REQUIRED',
    label: t('validations.reject.categories.additionalDocumentationRequired'),
  },
  { value: 'OTHER', label: t('validations.reject.categories.other') },
]

const MIN_DETAILS_LENGTH = 50

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: RejectValidationData) => void
  isSubmitting?: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: RejectDialogProps) {
  const { t } = useTranslation()
  const [category, setCategory] = useState<RejectionCategory>()
  const [details, setDetails] = useState('')

  const rejectionCategories = getRejectionCategories(t)
  const isValid = category && details.trim().length >= MIN_DETAILS_LENGTH

  const handleSubmit = () => {
    if (!category || !isValid) return
    onSubmit({ category, details: details.trim() })
    setCategory(undefined)
    setDetails('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('validations.reject.title')}</DialogTitle>
          <DialogDescription>
            {t('validations.reject.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>{t('validations.reject.reasonLabel')}</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as RejectionCategory)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('validations.reject.reasonPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {rejectionCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{t('validations.reject.detailsLabel')}</Label>
            <Textarea
              placeholder={t('validations.reject.detailsPlaceholder')}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
            <p className="text-muted-foreground text-xs">
              {t('validations.reject.detailsCount', {
                current: details.trim().length,
                min: MIN_DETAILS_LENGTH,
              })}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.actions.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {t('validations.reject.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
