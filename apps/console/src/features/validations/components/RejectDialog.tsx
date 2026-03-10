import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type {
  RejectionCategory,
  RejectValidationData,
} from '../api/validations.api'

const REJECTION_CATEGORIES: { value: RejectionCategory; label: string }[] = [
  { value: 'POOR_QUALITY_PHOTOS', label: 'Poor quality photos' },
  { value: 'EXPIRED_DOCUMENTS', label: 'Expired documents' },
  { value: 'INFORMATION_MISMATCH', label: 'Information mismatch' },
  {
    value: 'ADDITIONAL_DOCUMENTATION_REQUIRED',
    label: 'Additional documentation required',
  },
  { value: 'OTHER', label: 'Other' },
]

const MIN_DETAILS_LENGTH = 50

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: RejectValidationData) => void
  isSubmitting?: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: RejectDialogProps) {
  const [category, setCategory] = useState<RejectionCategory>()
  const [details, setDetails] = useState('')

  const isValid = category && details.trim().length >= MIN_DETAILS_LENGTH

  const handleSubmit = () => {
    if (!category || !isValid) return
    onSubmit({ category, details: details.trim() })
    setCategory(undefined)
    setDetails('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Validation</DialogTitle>
          <DialogDescription>
            Select a reason and provide details for rejecting this validation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as RejectionCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {REJECTION_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Details</Label>
            <Textarea
              placeholder="Provide detailed information about the rejection reason..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
            <p className="text-muted-foreground text-xs">
              {details.trim().length}/{MIN_DETAILS_LENGTH} characters minimum
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
