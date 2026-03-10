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
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  commissionType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  commissionValue: z.number().min(0, 'Value must be non-negative'),
  commissionMinimum: z.number().min(0).optional(),
  commissionMaximum: z.number().min(0).optional(),
  isCommissionExempt: z.boolean().optional(),
  taxPercent: z.number().min(0).max(100),
  isTaxExempt: z.boolean().optional(),
  isDefault: z.boolean().optional(),
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
      commissionType: 'PERCENTAGE',
      commissionValue: 0,
      taxPercent: 0,
      isCommissionExempt: false,
      isTaxExempt: false,
      isDefault: false,
    },
  })

  const commissionType = watch('commissionType')
  const isActive = profile?.isActive ?? true

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        description: profile.description ?? undefined,
        commissionType: profile.commissionType,
        commissionValue: profile.commissionValue,
        commissionMinimum: profile.commissionMinimum ?? undefined,
        commissionMaximum: profile.commissionMaximum ?? undefined,
        isCommissionExempt: profile.isCommissionExempt,
        taxPercent: profile.taxPercent,
        isTaxExempt: profile.isTaxExempt,
        isDefault: profile.isDefault,
      })
    } else {
      reset({
        name: '',
        commissionType: 'PERCENTAGE',
        commissionValue: 0,
        taxPercent: 0,
        isCommissionExempt: false,
        isTaxExempt: false,
        isDefault: false,
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
            <Label htmlFor="bp-desc">Description (optional)</Label>
            <Input id="bp-desc" {...register('description')} />
          </div>

          <div className="grid gap-2">
            <Label>Commission Type</Label>
            <Select
              value={commissionType}
              onValueChange={(v) =>
                setValue('commissionType', v as CommissionType)
              }
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
              {...register('commissionValue', { valueAsNumber: true })}
            />
            {errors.commissionValue && (
              <p className="text-destructive text-sm">
                {errors.commissionValue.message}
              </p>
            )}
          </div>

          {commissionType === 'PERCENTAGE' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="bp-min">Min Amount (Q)</Label>
                <Input
                  id="bp-min"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  {...register('commissionMinimum', { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bp-max">Max Amount (Q)</Label>
                <Input
                  id="bp-max"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  {...register('commissionMaximum', { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="bp-tax">Tax Percent (%)</Label>
            <Input
              id="bp-tax"
              type="number"
              step="0.01"
              {...register('taxPercent', { valueAsNumber: true })}
            />
            {errors.taxPercent && (
              <p className="text-destructive text-sm">
                {errors.taxPercent.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register('isCommissionExempt')}
                className="size-4"
              />
              Commission exempt
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register('isTaxExempt')}
                className="size-4"
              />
              Tax exempt
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register('isDefault')}
                className="size-4"
              />
              Default profile
            </label>
          </div>

          {isEditing && (
            <p className="text-muted-foreground text-xs">
              Status: {isActive ? 'Active' : 'Inactive'}
            </p>
          )}

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
