import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

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

export const Route = createFileRoute('/_authenticated/settlements')({
  component: SettlementsPage,
})

function formatQ(value: number) {
  return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2 })}`
}

function SettlementsPage() {
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
      <h1 className="text-2xl font-bold">Settlements</h1>

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
  const { data, isLoading } = useSettlement(item.id)
  const recordPayment = useRecordPayment()
  const [paymentOpen, setPaymentOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="size-4" />
        Back to list
      </Button>

      {isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settlement Details</h2>
            <Badge variant={data.status === 'PAID' ? 'default' : 'secondary'}>
              {data.status}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Order ID</dt>
                <dd className="font-mono text-xs">{data.orderId}</dd>
                <dt className="text-muted-foreground">Transporter ID</dt>
                <dd className="font-mono text-xs">{data.transporterId}</dd>
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium">{formatQ(data.amount)}</dd>
                <dt className="text-muted-foreground">Created</dt>
                <dd>
                  {new Date(data.createdAt).toLocaleDateString('es-GT')}
                </dd>
              </dl>
            </CardContent>
          </Card>

          {data.status === 'PAID' && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {data.transferDate && (
                    <>
                      <dt className="text-muted-foreground">Transfer Date</dt>
                      <dd>
                        {new Date(data.transferDate).toLocaleDateString(
                          'es-GT',
                        )}
                      </dd>
                    </>
                  )}
                  {data.transactionNumber && (
                    <>
                      <dt className="text-muted-foreground">Transaction #</dt>
                      <dd className="font-mono text-xs">
                        {data.transactionNumber}
                      </dd>
                    </>
                  )}
                  {data.bankAccountId && (
                    <>
                      <dt className="text-muted-foreground">Bank Account</dt>
                      <dd className="font-mono text-xs">
                        {data.bankAccountId}
                      </dd>
                    </>
                  )}
                  {data.paidAt && (
                    <>
                      <dt className="text-muted-foreground">Paid At</dt>
                      <dd>
                        {new Date(data.paidAt).toLocaleDateString('es-GT')}
                      </dd>
                    </>
                  )}
                  {data.comment && (
                    <>
                      <dt className="text-muted-foreground">Comment</dt>
                      <dd>{data.comment}</dd>
                    </>
                  )}
                  {data.screenshotUrl && (
                    <>
                      <dt className="text-muted-foreground">Screenshot</dt>
                      <dd>
                        <a
                          href={data.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          View
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
                Record Payment
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
