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
import type { LocationItem } from '../api/locations.api'

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

type LocationFormValues = z.infer<typeof locationSchema>

interface LocationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  levelLabel: string
  showCoordinates?: boolean
  item?: LocationItem | null
  onSubmit: (data: LocationFormValues) => void
  isSubmitting?: boolean
}

export function LocationFormDialog({
  open,
  onOpenChange,
  levelLabel,
  showCoordinates,
  item,
  onSubmit,
  isSubmitting,
}: LocationFormDialogProps) {
  const isEditing = !!item

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { name: '', code: '' },
  })

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        code: item.code,
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
            {isEditing ? `Edit ${levelLabel}` : `Create ${levelLabel}`}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((v) => onSubmit(v))}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="loc-name">Name</Label>
            <Input id="loc-name" {...register('name')} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="loc-code">Code</Label>
            <Input id="loc-code" {...register('code')} />
            {errors.code && (
              <p className="text-destructive text-sm">{errors.code.message}</p>
            )}
          </div>

          {showCoordinates && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="loc-lat">Latitude</Label>
                <Input
                  id="loc-lat"
                  type="number"
                  step="any"
                  {...register('latitude')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="loc-lng">Longitude</Label>
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
