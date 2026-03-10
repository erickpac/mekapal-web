import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
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

const paymentSchema = z.object({
  transferDate: z.string().min(1, 'Transfer date is required'),
  transactionNumber: z
    .string()
    .min(1, 'Transaction number is required')
    .max(100),
  comment: z.string().max(500).optional(),
  screenshotUrl: z.string().url().optional().or(z.literal('')),
  bankAccountId: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
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
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Enter the transfer details for this settlement.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="transferDate">Transfer Date</Label>
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
            <Label htmlFor="transactionNumber">Transaction Number</Label>
            <Input
              id="transactionNumber"
              placeholder="e.g. TXN-123456"
              {...register('transactionNumber')}
            />
            {errors.transactionNumber && (
              <p className="text-destructive text-sm">
                {errors.transactionNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bankAccountId">Bank Account ID (optional)</Label>
            <Input
              id="bankAccountId"
              placeholder="UUID of bank account"
              {...register('bankAccountId')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="screenshotUrl">Screenshot URL (optional)</Label>
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
            <Label htmlFor="comment">Comment (optional)</Label>
            <Input
              id="comment"
              placeholder="Additional notes..."
              {...register('comment')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
