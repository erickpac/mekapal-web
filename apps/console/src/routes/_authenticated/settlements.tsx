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
import { formatCurrency, formatDate } from '@/shared/utils/format'

export const Route = createFileRoute('/_authenticated/settlements')({
  component: SettlementsPage,
})

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
      <h1 className="text-2xl font-bold">Liquidaciones</h1>

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
        Volver a la lista
      </Button>

      {isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Detalles de liquidación</h2>
            <Badge variant={data.status === 'PAID' ? 'default' : 'secondary'}>
              {data.status}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalles</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">ID de orden</dt>
                <dd className="font-mono text-xs">{data.orderId}</dd>
                <dt className="text-muted-foreground">ID del transportista</dt>
                <dd className="font-mono text-xs">{data.transporterId}</dd>
                <dt className="text-muted-foreground">Monto</dt>
                <dd className="font-medium">{formatCurrency(data.amount)}</dd>
                <dt className="text-muted-foreground">Creado</dt>
                <dd>{formatDate(data.createdAt)}</dd>
              </dl>
            </CardContent>
          </Card>

          {data.status === 'PAID' && (
            <Card>
              <CardHeader>
                <CardTitle>Info de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {data.transferDate && (
                    <>
                      <dt className="text-muted-foreground">Fecha de transferencia</dt>
                      <dd>{formatDate(data.transferDate)}</dd>
                    </>
                  )}
                  {data.transactionNumber && (
                    <>
                      <dt className="text-muted-foreground">Transacción #</dt>
                      <dd className="font-mono text-xs">
                        {data.transactionNumber}
                      </dd>
                    </>
                  )}
                  {data.bankAccountId && (
                    <>
                      <dt className="text-muted-foreground">Cuenta bancaria</dt>
                      <dd className="font-mono text-xs">
                        {data.bankAccountId}
                      </dd>
                    </>
                  )}
                  {data.paidAt && (
                    <>
                      <dt className="text-muted-foreground">Pagado el</dt>
                      <dd>
                        {formatDate(data.paidAt)}
                      </dd>
                    </>
                  )}
                  {data.comment && (
                    <>
                      <dt className="text-muted-foreground">Comentario</dt>
                      <dd>{data.comment}</dd>
                    </>
                  )}
                  {data.screenshotUrl && (
                    <>
                      <dt className="text-muted-foreground">Captura de pantalla</dt>
                      <dd>
                        <a
                          href={data.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          Ver
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
                Registrar pago
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
