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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RejectionReason } from '../api/validations.api'

const REJECTION_CATEGORIES = [
  { value: 'poor_quality_photo', label: 'Poor quality photo' },
  { value: 'expired_document', label: 'Expired document' },
  { value: 'info_mismatch', label: 'Information mismatch' },
  { value: 'other', label: 'Other' },
] as const

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (reason: RejectionReason) => void
  isSubmitting?: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: RejectDialogProps) {
  const [category, setCategory] = useState<RejectionReason['category']>()
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    if (!category) return
    onSubmit({ category, notes: notes.trim() || undefined })
    setCategory(undefined)
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Validation</DialogTitle>
          <DialogDescription>
            Select a reason for rejecting this validation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                setCategory(v as RejectionReason['category'])
              }
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
            <Label>Notes (optional)</Label>
            <Input
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!category || isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
