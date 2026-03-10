import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { requireModule } from '@/shared/utils/route-guard'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { BillingProfile } from '@/features/commissions/api/commissions.api'
import { AssignedClientsTab } from '@/features/commissions/components/AssignedClientsTab'
import { BillingProfileFormDialog } from '@/features/commissions/components/BillingProfileFormDialog'
import { BillingProfilesTable } from '@/features/commissions/components/BillingProfilesTable'
import { DeleteProfileDialog } from '@/features/commissions/components/DeleteProfileDialog'
import {
  useBillingProfiles,
  useCreateBillingProfile,
  useDeleteBillingProfile,
  useUpdateBillingProfile,
} from '@/features/commissions/hooks/useCommissions'

export const Route = createFileRoute('/_authenticated/commissions')({
  beforeLoad: requireModule('commissions'),
  component: CommissionsPage,
})

function CommissionsPage() {
  const { data, isLoading } = useBillingProfiles()
  const createProfile = useCreateBillingProfile()
  const updateProfile = useUpdateBillingProfile()
  const deleteProfile = useDeleteBillingProfile()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<BillingProfile | null>(null)
  const [deleting, setDeleting] = useState<BillingProfile | null>(null)
  const [selected, setSelected] = useState<BillingProfile | null>(null)

  if (selected) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="size-4" />
          Back to list
        </Button>

        <h2 className="text-lg font-semibold">{selected.name}</h2>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <dl className="grid max-w-md grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Type</dt>
              <dd>{selected.type}</dd>
              <dt className="text-muted-foreground">Value</dt>
              <dd>
                {selected.type === 'PERCENTAGE'
                  ? `${selected.value}%`
                  : `Q${selected.value.toFixed(2)}`}
              </dd>
              <dt className="text-muted-foreground">Min Amount</dt>
              <dd>
                {selected.minAmount != null
                  ? `Q${selected.minAmount.toFixed(2)}`
                  : '—'}
              </dd>
              <dt className="text-muted-foreground">Max Amount</dt>
              <dd>
                {selected.maxAmount != null
                  ? `Q${selected.maxAmount.toFixed(2)}`
                  : '—'}
              </dd>
              <dt className="text-muted-foreground">Tax</dt>
              <dd>{selected.taxPercentage}%</dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd>{selected.active ? 'Active' : 'Inactive'}</dd>
            </dl>
          </TabsContent>

          <TabsContent value="clients" className="mt-4">
            <AssignedClientsTab profileId={selected.id} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Commissions</h1>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="size-4" />
          New Profile
        </Button>
      </div>

      <BillingProfilesTable
        data={data ?? []}
        loading={isLoading}
        onEdit={(p) => {
          setEditing(p)
          setFormOpen(true)
        }}
        onDelete={setDeleting}
        onRowClick={setSelected}
      />

      <BillingProfileFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        profile={editing}
        onSubmit={(formData) => {
          if (editing) {
            updateProfile.mutate(
              { id: editing.id, data: formData },
              {
                onSuccess: () => {
                  setFormOpen(false)
                  setEditing(null)
                },
              },
            )
          } else {
            createProfile.mutate(formData, {
              onSuccess: () => setFormOpen(false),
            })
          }
        }}
        isSubmitting={createProfile.isPending || updateProfile.isPending}
      />

      <DeleteProfileDialog
        open={!!deleting}
        onOpenChange={() => setDeleting(null)}
        profileName={deleting?.name ?? ''}
        onConfirm={() => {
          if (deleting) {
            deleteProfile.mutate(deleting.id, {
              onSuccess: () => setDeleting(null),
            })
          }
        }}
        isDeleting={deleteProfile.isPending}
      />
    </div>
  )
}
