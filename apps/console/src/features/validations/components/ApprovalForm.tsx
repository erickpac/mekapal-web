import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { RejectDialog } from './RejectDialog'
import type { RejectValidationData } from '../api/validations.api'

interface ApprovalFormProps {
  onApprove: () => void
  onReject: (payload: RejectValidationData) => void
  isApproving?: boolean
  isRejecting?: boolean
}

export function ApprovalForm({
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ApprovalFormProps) {
  const { t } = useTranslation()
  const [rejectOpen, setRejectOpen] = useState(false)

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        onClick={onApprove}
        disabled={isApproving || isRejecting}
      >
        <CheckCircle className="size-4" />
        {t('validations.approval.approve')}
      </Button>
      <Button
        variant="destructive"
        onClick={() => setRejectOpen(true)}
        disabled={isApproving || isRejecting}
      >
        <XCircle className="size-4" />
        {t('validations.approval.reject')}
      </Button>

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSubmit={(payload) => {
          onReject(payload)
          setRejectOpen(false)
        }}
        isSubmitting={isRejecting}
      />
    </div>
  )
}
