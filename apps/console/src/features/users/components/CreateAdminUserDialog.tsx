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
import type { CreateAdminUserData } from '../api/users.api'

const createUserSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Correo electrónico inválido'),
  role: z.enum(['ADMIN', 'BACKOFFICE']),
  phone: z.string().optional(),
  temporaryPassword: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>

interface CreateAdminUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateAdminUserData) => void
  isSubmitting?: boolean
}

export function CreateAdminUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateAdminUserDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'BACKOFFICE',
      phone: '',
      temporaryPassword: '',
    },
  })

  const role = watch('role')

  function handleClose() {
    reset()
    onOpenChange(false)
  }

  function handleFormSubmit(values: CreateUserFormValues) {
    const payload: CreateAdminUserData = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
    }
    if (values.phone) payload.phone = values.phone
    if (values.temporaryPassword) payload.temporaryPassword = values.temporaryPassword
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear usuario</DialogTitle>
          <DialogDescription>
            Crea un usuario admin o backoffice. Recibirán una contraseña
            temporal por correo si no se proporciona.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-first-name">Nombre</Label>
              <Input id="user-first-name" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-last-name">Apellido</Label>
              <Input id="user-last-name" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-email">Correo electrónico</Label>
            <Input id="user-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-phone">Teléfono (opcional)</Label>
            <Input id="user-phone" type="tel" {...register('phone')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-password">
              Contraseña temporal (opcional)
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder="Dejar vacío para generar automáticamente"
              {...register('temporaryPassword')}
            />
            {errors.temporaryPassword && (
              <p className="text-destructive text-sm">
                {errors.temporaryPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Rol</Label>
            <Select
              value={role}
              onValueChange={(v) =>
                setValue('role', v as 'ADMIN' | 'BACKOFFICE')
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="BACKOFFICE">Backoffice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Crear
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
