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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { BankAccount, RecordPaymentData } from '../api/settlements.api'

const paymentSchema = z.object({
  transferDate: z.string().min(1, 'Transfer date is required'),
  transferAmount: z.number().positive('Amount must be positive'),
  transactionNumber: z.string().min(1, 'Transaction number is required'),
  bankAccountId: z.string().min(1, 'Bank account is required'),
  comments: z.string().optional(),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface RecordPaymentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bankAccounts: BankAccount[]
  onSubmit: (data: RecordPaymentData) => void
  isSubmitting?: boolean
}

export function RecordPaymentForm({
  open,
  onOpenChange,
  bankAccounts,
  onSubmit,
  isSubmitting,
}: RecordPaymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  })

  const bankAccountId = watch('bankAccountId')

  const handleFormSubmit = (values: PaymentFormValues) => {
    onSubmit({
      ...values,
      comments: values.comments?.trim() || undefined,
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
            <Label htmlFor="transferAmount">Transfer Amount (Q)</Label>
            <Input
              id="transferAmount"
              type="number"
              step="0.01"
              {...register('transferAmount', { valueAsNumber: true })}
            />
            {errors.transferAmount && (
              <p className="text-destructive text-sm">
                {errors.transferAmount.message}
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
            <Label>Bank Account</Label>
            <Select
              value={bankAccountId}
              onValueChange={(v) => setValue('bankAccountId', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account..." />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.bankName} — {account.accountNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bankAccountId && (
              <p className="text-destructive text-sm">
                {errors.bankAccountId.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comments">Comments (optional)</Label>
            <Input
              id="comments"
              placeholder="Additional notes..."
              {...register('comments')}
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
