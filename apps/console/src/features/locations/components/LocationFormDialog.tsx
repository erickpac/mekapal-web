import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import type { Resolver } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
import type { LocationItem } from '../api/locations.api'

const optionalNumber = z.preprocess(
  (v) => (v === '' || v === undefined || Number.isNaN(v) ? undefined : Number(v)),
  z.number().optional(),
)

const createLocationSchema = (t: TFunction) =>
  z.object({
    name: z.string().min(1, t('locations.form.validation.nameRequired')),
    code: z.string().min(1, t('locations.form.validation.codeRequired')),
    latitude: optionalNumber,
    longitude: optionalNumber,
  })

type LocationFormValues = z.infer<ReturnType<typeof createLocationSchema>>

interface LocationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  levelLabel: string
  codeLabel?: string
  getCode?: (item: LocationItem) => string
  showCoordinates?: boolean
  item?: LocationItem | null
  onSubmit: (data: LocationFormValues) => void
  isSubmitting?: boolean
}

export function LocationFormDialog({
  open,
  onOpenChange,
  levelLabel,
  codeLabel,
  getCode,
  showCoordinates,
  item,
  onSubmit,
  isSubmitting,
}: LocationFormDialogProps) {
  const { t } = useTranslation()
  const isEditing = !!item
  const resolvedCodeLabel = codeLabel ?? t('locations.form.code')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(
      createLocationSchema(t),
    ) as Resolver<LocationFormValues>,
    defaultValues: { name: '', code: '' },
  })

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        code: getCode ? getCode(item) : 'code' in item ? item.code : '',
        latitude:
          'latitude' in item && item.latitude != null
            ? (item.latitude as number)
            : undefined,
        longitude:
          'longitude' in item && item.longitude != null
            ? (item.longitude as number)
            : undefined,
      })
    } else {
      reset({ name: '', code: '' })
    }
  }, [item, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t('locations.form.editTitle', { level: levelLabel })
              : t('locations.form.createTitle', { level: levelLabel })}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((v: LocationFormValues) => onSubmit(v))}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="loc-name">{t('locations.form.name')}</Label>
            <Input id="loc-name" {...register('name')} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="loc-code">{resolvedCodeLabel}</Label>
            <Input id="loc-code" {...register('code')} />
            {errors.code && (
              <p className="text-destructive text-sm">{errors.code.message}</p>
            )}
          </div>

          {showCoordinates && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="loc-lat">
                  {t('locations.form.latitude')}
                </Label>
                <Input
                  id="loc-lat"
                  type="number"
                  step="any"
                  {...register('latitude')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="loc-lng">
                  {t('locations.form.longitude')}
                </Label>
                <Input
                  id="loc-lng"
                  type="number"
                  step="any"
                  {...register('longitude')}
                />
              </div>
            </>
          )}

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
              {isEditing
                ? t('common.actions.save')
                : t('common.actions.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
