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
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['ADMIN', 'BACKOFFICE']),
  phone: z.string().optional(),
  temporaryPassword: z.string().min(8, 'Minimum 8 characters').optional().or(z.literal('')),
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
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create an admin or backoffice user. They will receive a temporary
            password via email if not provided.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-first-name">First Name</Label>
              <Input id="user-first-name" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-last-name">Last Name</Label>
              <Input id="user-last-name" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-phone">Phone (optional)</Label>
            <Input id="user-phone" type="tel" {...register('phone')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-password">
              Temporary Password (optional)
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder="Leave empty for auto-generated"
              {...register('temporaryPassword')}
            />
            {errors.temporaryPassword && (
              <p className="text-destructive text-sm">
                {errors.temporaryPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
