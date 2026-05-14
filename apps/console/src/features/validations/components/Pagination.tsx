import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  offset: number
  limit: number
  count: number
  onOffsetChange: (offset: number) => void
}

export function Pagination({
  offset,
  limit,
  count,
  onOffsetChange,
}: PaginationProps) {
  const { t } = useTranslation()
  const page = Math.floor(offset / limit) + 1
  const hasMore = count === limit

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        {t('common.pagination.showing', { count })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={offset <= 0}
          onClick={() => onOffsetChange(Math.max(0, offset - limit))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm">{t('common.pagination.page', { page })}</span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!hasMore}
          onClick={() => onOffsetChange(offset + limit)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
