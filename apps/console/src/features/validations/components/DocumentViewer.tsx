import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DocumentViewerProps {
  images: string[]
  className?: string
}

export function DocumentViewer({ images, className }: DocumentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'text-muted-foreground flex h-48 items-center justify-center rounded-lg border border-dashed',
          className,
        )}
      >
        No documents available
      </div>
    )
  }

  const prev = () => setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1))
  const next = () => setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0))
  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))
  const rotate = () => setRotation((r) => (r + 90) % 360)
  const toggleFullscreen = () => {
    setFullscreen((f) => !f)
    setZoom(1)
    setRotation(0)
  }

  const viewer = (
    <div
      className={cn(
        'flex flex-col gap-2',
        fullscreen && 'bg-background fixed inset-0 z-50 p-4',
        !fullscreen && className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon-sm" onClick={zoomOut}>
            <ZoomOut className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={zoomIn}>
            <ZoomIn className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={rotate}>
            <RotateCw className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={toggleFullscreen}>
            {fullscreen ? (
              <Minimize className="size-4" />
            ) : (
              <Maximize className="size-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden rounded-lg border bg-neutral-50 dark:bg-neutral-900',
          fullscreen ? 'flex-1' : 'h-64',
        )}
      >
        {images.length > 1 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute left-2 z-10"
            onClick={prev}
          >
            <ChevronLeft className="size-4" />
          </Button>
        )}

        <img
          src={images[currentIndex]}
          alt={`Document ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain transition-transform"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        />

        {images.length > 1 && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 z-10"
            onClick={next}
          >
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'size-2 rounded-full transition-colors',
                i === currentIndex
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )

  return viewer
}
