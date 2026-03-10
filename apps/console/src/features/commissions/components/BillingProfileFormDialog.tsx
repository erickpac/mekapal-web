import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import type { CommissionType } from '@/shared/types'
import type {
  BillingProfile,
  BillingProfileFormData,
} from '../api/commissions.api'

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().positive('Value must be positive'),
  minAmount: z.number().nonnegative().nullable().optional(),
  maxAmount: z.number().nonnegative().nullable().optional(),
  taxPercentage: z.number().min(0).max(100),
  active: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface BillingProfileFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile?: BillingProfile | null
  onSubmit: (data: BillingProfileFormData) => void
  isSubmitting?: boolean
}

export function BillingProfileFormDialog({
  open,
  onOpenChange,
  profile,
  onSubmit,
  isSubmitting,
}: BillingProfileFormDialogProps) {
  const isEditing = !!profile

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      type: 'PERCENTAGE',
      value: 0,
      minAmount: null,
      maxAmount: null,
      taxPercentage: 0,
      active: true,
    },
  })

  const commissionType = watch('type')
  const active = watch('active')

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        type: profile.type,
        value: profile.value,
        minAmount: profile.minAmount,
        maxAmount: profile.maxAmount,
        taxPercentage: profile.taxPercentage,
        active: profile.active,
      })
    } else {
      reset({
        name: '',
        type: 'PERCENTAGE',
        value: 0,
        minAmount: null,
        maxAmount: null,
        taxPercentage: 0,
        active: true,
      })
    }
  }, [profile, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Billing Profile' : 'Create Billing Profile'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((v) => onSubmit(v))}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="bp-name">Name</Label>
            <Input id="bp-name" {...register('name')} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Commission Type</Label>
            <Select
              value={commissionType}
              onValueChange={(v) => setValue('type', v as CommissionType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bp-value">
              Value {commissionType === 'PERCENTAGE' ? '(%)' : '(Q)'}
            </Label>
            <Input
              id="bp-value"
              type="number"
              step="0.01"
              {...register('value', { valueAsNumber: true })}
            />
            {errors.value && (
              <p className="text-destructive text-sm">{errors.value.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="bp-min">Min Amount (Q)</Label>
              <Input
                id="bp-min"
                type="number"
                step="0.01"
                placeholder="Optional"
                {...register('minAmount', { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bp-max">Max Amount (Q)</Label>
              <Input
                id="bp-max"
                type="number"
                step="0.01"
                placeholder="Optional"
                {...register('maxAmount', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bp-tax">Tax Percentage (%)</Label>
            <Input
              id="bp-tax"
              type="number"
              step="0.01"
              {...register('taxPercentage', { valueAsNumber: true })}
            />
            {errors.taxPercentage && (
              <p className="text-destructive text-sm">
                {errors.taxPercentage.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              role="switch"
              aria-checked={active}
              onClick={() => setValue('active', !active)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                active ? 'bg-primary' : 'bg-input'
              }`}
            >
              <span
                className={`pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  active ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <Label>{active ? 'Active' : 'Inactive'}</Label>
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
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
