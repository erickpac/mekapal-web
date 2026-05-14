import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { Loader2 } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
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

const createResolveSchema = (t: TFunction) =>
  z.object({
    resolution: z.enum([
      'RESOLVED_SATISFACTORILY',
      'CLOSED_WITHOUT_RESOLUTION',
    ]),
    resolutionNotes: z
      .string()
      .min(100, t('incidents.resolveForm.validation.resolutionNotesMin')),
    refundAmount: z.number().min(0).optional(),
    userAction: z.enum(['NONE', 'WARNING', 'SUSPENSION', 'BAN']).optional(),
  })

type ResolveFormValues = z.infer<ReturnType<typeof createResolveSchema>>

const getResolutions = (
  t: TFunction,
): { value: IncidentResolution; label: string }[] => [
  {
    value: 'RESOLVED_SATISFACTORILY',
    label: t('incidents.resolveForm.resolutionResolved'),
  },
  {
    value: 'CLOSED_WITHOUT_RESOLUTION',
    label: t('incidents.resolveForm.resolutionClosed'),
  },
]

const getUserActions = (
  t: TFunction,
): { value: UserAction; label: string }[] => [
  { value: 'NONE', label: t('incidents.resolveForm.userActionNone') },
  { value: 'WARNING', label: t('incidents.resolveForm.userActionWarning') },
  {
    value: 'SUSPENSION',
    label: t('incidents.resolveForm.userActionSuspension'),
  },
  { value: 'BAN', label: t('incidents.resolveForm.userActionBan') },
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
  const { t } = useTranslation()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ResolveFormValues>({
    resolver: zodResolver(createResolveSchema(t)),
  })

  const resolutions = getResolutions(t)
  const userActions = getUserActions(t)

  const resolution = useWatch({ control, name: 'resolution' })
  const userAction = useWatch({ control, name: 'userAction' })

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
          <DialogTitle>{t('incidents.resolveForm.title')}</DialogTitle>
          <DialogDescription>
            {t('incidents.resolveForm.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label>{t('incidents.resolveForm.resolutionLabel')}</Label>
            <Select
              value={resolution}
              onValueChange={(v) =>
                setValue('resolution', v as IncidentResolution)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('incidents.resolveForm.resolutionPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {resolutions.map((r) => (
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
            <Label htmlFor="resolutionNotes">
              {t('incidents.resolveForm.resolutionNotesLabel')}
            </Label>
            <Textarea
              id="resolutionNotes"
              placeholder={t(
                'incidents.resolveForm.resolutionNotesPlaceholder',
              )}
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
            <Label htmlFor="refundAmount">
              {t('incidents.resolveForm.refundAmountLabel')}
            </Label>
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
            <Label>{t('incidents.resolveForm.userActionLabel')}</Label>
            <Select
              value={userAction}
              onValueChange={(v) => setValue('userAction', v as UserAction)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('incidents.resolveForm.userActionPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {userActions.map((action) => (
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
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t('incidents.resolveForm.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
