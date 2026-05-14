import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('auth.login.appName')}
          </CardTitle>
          <CardDescription>{t('auth.login.cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={() => navigate({ to: '/dashboard' })} />
        </CardContent>
      </Card>
    </div>
  )
}
