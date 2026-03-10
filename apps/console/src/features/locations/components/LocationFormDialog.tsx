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
  active: z.boolean(),
})

type LocationFormValues = z.infer<typeof locationSchema>

interface LocationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  levelLabel: string
  item?: LocationItem | null
  onSubmit: (data: LocationFormValues) => void
  isSubmitting?: boolean
}

export function LocationFormDialog({
  open,
  onOpenChange,
  levelLabel,
  item,
  onSubmit,
  isSubmitting,
}: LocationFormDialogProps) {
  const isEditing = !!item

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { name: '', active: true },
  })

  const active = watch('active')

  useEffect(() => {
    if (item) {
      reset({ name: item.name, active: item.active })
    } else {
      reset({ name: '', active: true })
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
