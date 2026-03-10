import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateAdminUserData } from '../api/users.api'
import * as api from '../api/users.api'

export function useCreateAdminUser() {
  return useMutation({
    mutationFn: (data: CreateAdminUserData) => api.createAdminUser(data),
    onSuccess: () => {
      toast.success('User created successfully')
    },
    onError: () => {
      toast.error('Failed to create user')
    },
  })
}
