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
import { Textarea } from '@/components/ui/textarea'
import type { IncidentResolution, UserAction } from '@/shared/types'
import type { ResolveIncidentData } from '../api/incidents.api'

const resolveSchema = z.object({
  resolution: z.enum([
    'RESOLVED_SATISFACTORILY',
    'CLOSED_WITHOUT_RESOLUTION',
  ]),
  resolutionNotes: z.string().min(100, 'Minimum 100 characters required'),
  refundAmount: z.number().min(0).optional(),
  userAction: z
    .enum(['NONE', 'WARNING', 'SUSPENSION', 'BAN'])
    .optional(),
})

type ResolveFormValues = z.infer<typeof resolveSchema>

const RESOLUTIONS: { value: IncidentResolution; label: string }[] = [
  { value: 'RESOLVED_SATISFACTORILY', label: 'Resolved satisfactorily' },
  { value: 'CLOSED_WITHOUT_RESOLUTION', label: 'Closed without resolution' },
]

const USER_ACTIONS: { value: UserAction; label: string }[] = [
  { value: 'NONE', label: 'None' },
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

  const resolution = watch('resolution')
  const userAction = watch('userAction')

  const handleFormSubmit = (values: ResolveFormValues) => {
    onSubmit({
      resolution: values.resolution,
      resolutionNotes: values.resolutionNotes,
      refundAmount: values.refundAmount,
      userAction: values.userAction,
    })
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
            <Label>Resolution</Label>
            <Select
              value={resolution}
              onValueChange={(v) =>
                setValue('resolution', v as IncidentResolution)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resolution..." />
              </SelectTrigger>
              <SelectContent>
                {RESOLUTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.resolution && (
              <p className="text-destructive text-sm">
                {errors.resolution.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="resolutionNotes">Resolution Notes</Label>
            <Textarea
              id="resolutionNotes"
              placeholder="Describe the resolution in detail..."
              rows={4}
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
            <Label>User Action (optional)</Label>
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
