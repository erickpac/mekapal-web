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
import type { ResolveIncidentData, UserAction } from '../api/incidents.api'

const resolveSchema = z.object({
  resolutionNotes: z.string().min(1, 'Resolution notes are required'),
  refundAmount: z.number().positive().optional(),
  userAction: z.enum(['WARNING', 'SUSPENSION', 'BAN']),
})

type ResolveFormValues = z.infer<typeof resolveSchema>

const USER_ACTIONS: { value: UserAction; label: string }[] = [
  { value: 'WARNING', label: 'Warning' },
  { value: 'SUSPENSION', label: 'Suspension' },
  { value: 'BAN', label: 'Ban' },
]

interface ResolveIncidentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ResolveIncidentData) => void
  isSubmitting?: boolean
}

export function ResolveIncidentForm({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: ResolveIncidentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResolveFormValues>({
    resolver: zodResolver(resolveSchema),
  })

  const userAction = watch('userAction')

  const handleFormSubmit = (values: ResolveFormValues) => {
    onSubmit(values)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve Incident</DialogTitle>
          <DialogDescription>
            Provide resolution details and any action to take.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="resolutionNotes">Resolution Notes</Label>
            <Input
              id="resolutionNotes"
              placeholder="Describe the resolution..."
              {...register('resolutionNotes')}
            />
            {errors.resolutionNotes && (
              <p className="text-destructive text-sm">
                {errors.resolutionNotes.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="refundAmount">Refund Amount (optional)</Label>
            <Input
              id="refundAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('refundAmount', { valueAsNumber: true })}
            />
            {errors.refundAmount && (
              <p className="text-destructive text-sm">
                {errors.refundAmount.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>User Action</Label>
            <Select
              value={userAction}
              onValueChange={(v) => setValue('userAction', v as UserAction)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action..." />
              </SelectTrigger>
              <SelectContent>
                {USER_ACTIONS.map((action) => (
                  <SelectItem key={action.value} value={action.value}>
                    {action.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userAction && (
              <p className="text-destructive text-sm">
                {errors.userAction.message}
              </p>
            )}
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
              Resolve
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
