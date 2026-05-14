import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SettlementStatus } from '@/shared/types'
import type { Settlement } from '@/features/settlements/api/settlements.api'
import { RecordPaymentForm } from '@/features/settlements/components/RecordPaymentForm'
import { SettlementFilters } from '@/features/settlements/components/SettlementFilters'
import { SettlementsTable } from '@/features/settlements/components/SettlementsTable'
import {
  useRecordPayment,
  useSettlement,
  useSettlements,
} from '@/features/settlements/hooks/useSettlements'
import { formatCurrency, formatDate } from '@/shared/utils/format'

export const Route = createFileRoute('/_authenticated/settlements')({
  component: SettlementsPage,
})

function SettlementsPage() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<SettlementStatus>()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const [selected, setSelected] = useState<Settlement | null>(null)

  const { data, isLoading } = useSettlements({
    status,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  })

  if (selected) {
    return (
      <SettlementDetailView item={selected} onBack={() => setSelected(null)} />
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t('settlements.page.title')}</h1>

      <SettlementFilters
        status={status}
        fromDate={fromDate}
        toDate={toDate}
        onStatusChange={setStatus}
        onDateChange={(f, t) => {
          setFromDate(f)
          setToDate(t)
        }}
      />

      <SettlementsTable
        data={data ?? []}
        loading={isLoading}
        onRowClick={setSelected}
      />
    </div>
  )
}

function SettlementDetailView({
  item,
  onBack,
}: {
  item: Settlement
  onBack: () => void
}) {
  const { t } = useTranslation()
  const { data, isLoading } = useSettlement(item.id)
  const recordPayment = useRecordPayment()
  const [paymentOpen, setPaymentOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="size-4" />
        {t('settlements.page.backToList')}
      </Button>

      {isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t('settlements.detail.title')}
            </h2>
            <Badge variant={data.status === 'PAID' ? 'default' : 'secondary'}>
              {data.status}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('settlements.detail.detailsCardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">
                  {t('settlements.detail.orderId')}
                </dt>
                <dd className="font-mono text-xs">{data.orderId}</dd>
                <dt className="text-muted-foreground">
                  {t('settlements.detail.transporterId')}
                </dt>
                <dd className="font-mono text-xs">{data.transporterId}</dd>
                <dt className="text-muted-foreground">
                  {t('settlements.detail.amount')}
                </dt>
                <dd className="font-medium">{formatCurrency(data.amount)}</dd>
                <dt className="text-muted-foreground">
                  {t('settlements.detail.createdAt')}
                </dt>
                <dd>{formatDate(data.createdAt)}</dd>
              </dl>
            </CardContent>
          </Card>

          {data.status === 'PAID' && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {t('settlements.detail.paymentInfoTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {data.transferDate && (
                    <>
                      <dt className="text-muted-foreground">
                        {t('settlements.detail.transferDate')}
                      </dt>
                      <dd>{formatDate(data.transferDate)}</dd>
                    </>
                  )}
                  {data.transactionNumber && (
                    <>
                      <dt className="text-muted-foreground">
                        {t('settlements.detail.transactionNumber')}
                      </dt>
                      <dd className="font-mono text-xs">
                        {data.transactionNumber}
                      </dd>
                    </>
                  )}
                  {data.bankAccountId && (
                    <>
                      <dt className="text-muted-foreground">
                        {t('settlements.detail.bankAccount')}
                      </dt>
                      <dd className="font-mono text-xs">
                        {data.bankAccountId}
                      </dd>
                    </>
                  )}
                  {data.paidAt && (
                    <>
                      <dt className="text-muted-foreground">
                        {t('settlements.detail.paidAt')}
                      </dt>
                      <dd>{formatDate(data.paidAt)}</dd>
                    </>
                  )}
                  {data.comment && (
                    <>
                      <dt className="text-muted-foreground">
                        {t('settlements.detail.comment')}
                      </dt>
                      <dd>{data.comment}</dd>
                    </>
                  )}
                  {data.screenshotUrl && (
                    <>
                      <dt className="text-muted-foreground">
                        {t('settlements.detail.screenshot')}
                      </dt>
                      <dd>
                        <a
                          href={data.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          {t('settlements.detail.viewScreenshot')}
                        </a>
                      </dd>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {data.status === 'PENDING' && (
            <>
              <Button onClick={() => setPaymentOpen(true)}>
                {t('settlements.detail.recordPayment')}
              </Button>
              <RecordPaymentForm
                open={paymentOpen}
                onOpenChange={setPaymentOpen}
                onSubmit={(paymentData) =>
                  recordPayment.mutate(
                    { id: item.id, data: paymentData },
                    {
                      onSuccess: () => {
                        setPaymentOpen(false)
                        onBack()
                      },
                    },
                  )
                }
                isSubmitting={recordPayment.isPending}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
