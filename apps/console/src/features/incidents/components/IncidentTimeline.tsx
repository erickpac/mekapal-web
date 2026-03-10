import { Badge } from '@/components/ui/badge'
import type { TimelineEntry } from '../api/incidents.api'

interface IncidentTimelineProps {
  entries: TimelineEntry[]
}

export function IncidentTimeline({ entries }: IncidentTimelineProps) {
  if (entries.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Timeline</h3>
      <ol className="border-muted relative border-l pl-4">
        {entries.map((entry) => (
          <li key={entry.id} className="mb-4 last:mb-0">
            <span className="bg-border absolute -left-1.5 mt-1.5 size-3 rounded-full" />
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {entry.status}
              </Badge>
              <span className="text-muted-foreground text-xs">
                {new Date(entry.createdAt).toLocaleString('es-GT')}
              </span>
            </div>
            <p className="mt-1 text-sm">{entry.note}</p>
            <p className="text-muted-foreground text-xs">
              by {entry.createdBy}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}
