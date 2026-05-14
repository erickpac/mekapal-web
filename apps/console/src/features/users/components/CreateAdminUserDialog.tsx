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
import type { CreateAdminUserData } from '../api/users.api'

const createUserSchema = (t: TFunction) =>
  z.object({
    firstName: z
      .string()
      .min(1, t('users.createDialog.validation.firstNameRequired')),
    lastName: z
      .string()
      .min(1, t('users.createDialog.validation.lastNameRequired')),
    email: z.string().email(t('users.createDialog.validation.emailInvalid')),
    role: z.enum(['ADMIN', 'BACKOFFICE']),
    phone: z.string().optional(),
    temporaryPassword: z
      .string()
      .min(8, t('users.createDialog.validation.passwordMin'))
      .optional()
      .or(z.literal('')),
  })

type CreateUserFormValues = z.infer<ReturnType<typeof createUserSchema>>

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
  const { t } = useTranslation()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema(t)),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'BACKOFFICE',
      phone: '',
      temporaryPassword: '',
    },
  })

  const role = useWatch({ control, name: 'role' })

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
    if (values.temporaryPassword)
      payload.temporaryPassword = values.temporaryPassword
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.createDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('users.createDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-first-name">
                {t('users.createDialog.firstName')}
              </Label>
              <Input id="user-first-name" {...register('firstName')} />
              {errors.firstName && (
                <p className="text-destructive text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-last-name">
                {t('users.createDialog.lastName')}
              </Label>
              <Input id="user-last-name" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-destructive text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-email">{t('users.createDialog.email')}</Label>
            <Input id="user-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-phone">{t('users.createDialog.phone')}</Label>
            <Input id="user-phone" type="tel" {...register('phone')} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-password">
              {t('users.createDialog.temporaryPassword')}
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder={t('users.createDialog.temporaryPasswordPlaceholder')}
              {...register('temporaryPassword')}
            />
            {errors.temporaryPassword && (
              <p className="text-destructive text-sm">
                {errors.temporaryPassword.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>{t('users.createDialog.role')}</Label>
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
                <SelectItem value="ADMIN">{t('common.roles.ADMIN')}</SelectItem>
                <SelectItem value="BACKOFFICE">
                  {t('common.roles.BACKOFFICE')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {t('users.createDialog.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
