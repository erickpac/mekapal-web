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
  transferDate: z.string().min(1, 'La fecha de transferencia es obligatoria'),
  transactionNumber: z
    .string()
    .min(1, 'El número de transacción es obligatorio')
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
          <DialogTitle>Registrar pago</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de la transferencia para esta liquidación.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="transferDate">Fecha de transferencia</Label>
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
            <Label htmlFor="transactionNumber">Número de transacción</Label>
            <Input
              id="transactionNumber"
              placeholder="ej. TXN-123456"
              {...register('transactionNumber')}
            />
            {errors.transactionNumber && (
              <p className="text-destructive text-sm">
                {errors.transactionNumber.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bankAccountId">ID de cuenta bancaria (opcional)</Label>
            <Input
              id="bankAccountId"
              placeholder="UUID de la cuenta bancaria"
              {...register('bankAccountId')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="screenshotUrl">URL de captura (opcional)</Label>
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
            <Label htmlFor="comment">Comentario (opcional)</Label>
            <Input
              id="comment"
              placeholder="Notas adicionales..."
              {...register('comment')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Registrar pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
