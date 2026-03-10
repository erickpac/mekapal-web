import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { CreateAdminUserData, UserListQuery } from '../api/users.api'
import * as api from '../api/users.api'

export function useUsers(query: UserListQuery) {
  return useQuery({
    queryKey: ['users', query],
    queryFn: () => api.getUsers(query),
  })
}

export function useCreateAdminUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAdminUserData) => api.createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: () => {
      toast.error('Failed to create user')
    },
  })
}
