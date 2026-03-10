import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { SettlementStatus } from '@/shared/types'
import type { SettlementItem } from '@/features/settlements/api/settlements.api'
import { RecordPaymentForm } from '@/features/settlements/components/RecordPaymentForm'
import { SettlementFilters } from '@/features/settlements/components/SettlementFilters'
import { SettlementsTable } from '@/features/settlements/components/SettlementsTable'
import { Pagination } from '@/features/validations/components/Pagination'
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

const LIMIT = 20

function SettlementsPage() {
  const [status, setStatus] = useState<SettlementStatus>()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)

  const [selected, setSelected] = useState<SettlementItem | null>(null)

  const { data, isLoading } = useSettlements({
    status,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    search: search || undefined,
    limit: LIMIT,
    offset,
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
        startDate={startDate}
        endDate={endDate}
        search={search}
        onStatusChange={(s) => {
          setStatus(s)
          setOffset(0)
        }}
        onDateChange={(s, e) => {
          setStartDate(s)
          setEndDate(e)
          setOffset(0)
        }}
        onSearchChange={(s) => {
          setSearch(s)
          setOffset(0)
        }}
      />

      <SettlementsTable
        data={data ?? []}
        loading={isLoading}
        onRowClick={setSelected}
      />

      {data && (
        <Pagination
          offset={offset}
          limit={LIMIT}
          count={data.length}
          onOffsetChange={setOffset}
        />
      )}
    </div>
  )
}

function SettlementDetailView({
  item,
  onBack,
}: {
  item: SettlementItem
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
            <h2 className="text-lg font-semibold">
              Settlement — {data.transporterName}
            </h2>
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
                <dt className="text-muted-foreground">Amount</dt>
                <dd>{formatQ(data.amount)}</dd>
                <dt className="text-muted-foreground">Commission</dt>
                <dd>{formatQ(data.commission)}</dd>
                <dt className="text-muted-foreground">Net Amount</dt>
                <dd className="font-medium">{formatQ(data.netAmount)}</dd>
                <dt className="text-muted-foreground">Date</dt>
                <dd>{new Date(data.date).toLocaleDateString('es-GT')}</dd>
              </dl>
            </CardContent>
          </Card>

          {data.paymentInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Transfer Date</dt>
                  <dd>
                    {new Date(data.paymentInfo.transferDate).toLocaleDateString(
                      'es-GT',
                    )}
                  </dd>
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd>{formatQ(data.paymentInfo.transferAmount)}</dd>
                  <dt className="text-muted-foreground">Transaction #</dt>
                  <dd className="font-mono text-xs">
                    {data.paymentInfo.transactionNumber}
                  </dd>
                  {data.paymentInfo.comments && (
                    <>
                      <dt className="text-muted-foreground">Comments</dt>
                      <dd>{data.paymentInfo.comments}</dd>
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
                bankAccounts={data.bankAccounts}
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
