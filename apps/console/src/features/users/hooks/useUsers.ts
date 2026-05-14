import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useLocalizedError } from '@/shared/api/useLocalizedError'
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
  const { t } = useTranslation()
  const { getErrorMessage } = useLocalizedError()

  return useMutation({
    mutationFn: (data: CreateAdminUserData) => api.createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(t('users.toast.createSuccess'))
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })
}
