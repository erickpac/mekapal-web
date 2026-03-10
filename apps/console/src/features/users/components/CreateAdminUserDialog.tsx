import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Copy, Loader2 } from 'lucide-react'
import { useState } from 'react'
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
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  role: z.enum(['ADMIN', 'BACKOFFICE']),
})

type CreateUserFormValues = z.infer<typeof createUserSchema>

interface CreateAdminUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateAdminUserData) => Promise<string>
  isSubmitting?: boolean
}

export function CreateAdminUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateAdminUserDialogProps) {
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', password: '', role: 'BACKOFFICE' },
  })

  const role = watch('role')

  function handleClose() {
    setTempPassword(null)
    setCopied(false)
    reset()
    onOpenChange(false)
  }

  async function handleFormSubmit(values: CreateUserFormValues) {
    const password = await onSubmit(values)
    setTempPassword(password)
  }

  async function handleCopy() {
    if (!tempPassword) return
    await navigator.clipboard.writeText(tempPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (tempPassword) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Created</DialogTitle>
            <DialogDescription>
              The user has been created. Share the temporary password below. The
              user must change it on first login.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Input value={tempPassword} readOnly className="font-mono" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={handleClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid gap-4 py-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="user-name">Full Name</Label>
            <Input id="user-name" {...register('name')} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-email">Email</Label>
            <Input id="user-email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="user-password">Temporary Password</Label>
            <Input
              id="user-password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
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
