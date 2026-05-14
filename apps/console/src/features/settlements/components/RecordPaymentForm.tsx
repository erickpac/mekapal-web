import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
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
import type { RecordPaymentData } from '../api/settlements.api'

const createPaymentSchema = (t: TFunction) =>
  z.object({
    transferDate: z
      .string()
      .min(1, t('settlements.recordPayment.validation.transferDateRequired')),
    transactionNumber: z
      .string()
      .min(
        1,
        t('settlements.recordPayment.validation.transactionNumberRequired'),
      )
      .max(100),
    comment: z.string().max(500).optional(),
    screenshotUrl: z.string().url().optional().or(z.literal('')),
    bankAccountId: z.string().optional(),
  })

type PaymentFormValues = z.infer<ReturnType<typeof createPaymentSchema>>

interface RecordPaymentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RecordPaymentData) => void
  isSubmitting?: boolean
}

export function RecordPaymentForm({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: RecordPaymentFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(createPaymentSchema(t)),
  })

  const handleFormSubmit = (values: PaymentFormValues) => {
    onSubmit({
      transferDate: values.transferDate,
      transactionNumber: values.transactionNumber,
      comment: values.comment?.trim() || undefined,
      screenshotUrl: values.screenshotUrl?.trim() || undefined,
      bankAccountId: values.bankAccountId?.trim() || undefined,
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('settlements.recordPayment.title')}</DialogTitle>
          <DialogDescription>
            {t('settlements.recordPayment.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="transferDate">
              {t('settlements.recordPayment.transferDateLabel')}
            </Label>
            <Input
              id="transferDate"
              type="date"
              {...register('transferDate')}
            />
            {errors.transferDate && (
              <p className="text-destructive text-sm">
                {errors.transferDate.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transactionNumber">
              {t('settlements.recordPayment.transactionNumberLabel')}
            </Label>
            <Input
              id="transactionNumber"
              placeholder={t(
                'settlements.recordPayment.transactionNumberPlaceholder',
              )}
              {...register('transactionNumber')}
            />
            {errors.transactionNumber && (
              <p className="text-destructive text-sm">
                {errors.transactionNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bankAccountId">
              {t('settlements.recordPayment.bankAccountIdLabel')}
            </Label>
            <Input
              id="bankAccountId"
              placeholder={t(
                'settlements.recordPayment.bankAccountIdPlaceholder',
              )}
              {...register('bankAccountId')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="screenshotUrl">
              {t('settlements.recordPayment.screenshotUrlLabel')}
            </Label>
            <Input
              id="screenshotUrl"
              placeholder="https://..."
              {...register('screenshotUrl')}
            />
            {errors.screenshotUrl && (
              <p className="text-destructive text-sm">
                {errors.screenshotUrl.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comment">
              {t('settlements.recordPayment.commentLabel')}
            </Label>
            <Input
              id="comment"
              placeholder={t('settlements.recordPayment.commentPlaceholder')}
              {...register('comment')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t('settlements.recordPayment.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
