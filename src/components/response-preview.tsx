import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Check, Copy, Loader2, Maximize2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const responseSurfaceClass =
  "border border-border bg-white text-foreground dark:bg-card dark:text-card-foreground"

type ResponsePreviewProps = {
  result: string | null
  error: string | null
  meta: { status: number; duration: number } | null
  loading: boolean
  fullscreen: boolean
  onFullscreenChange: (open: boolean) => void
}

export function ResponsePreview({
  result,
  error,
  meta,
  loading,
  fullscreen,
  onFullscreenChange,
}: ResponsePreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const content = result ?? error

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!fullscreen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onFullscreenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [fullscreen, onFullscreenChange])

  useEffect(() => {
    setCopied(false)
  }, [content, fullscreen])

  async function handleCopy() {
    if (!content) {
      return
    }

    await navigator.clipboard.writeText(content)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const overlay =
    fullscreen && content ? (
      <div
        className="fixed inset-0 z-9999 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="API response preview"
      >
        <button
          type="button"
          aria-label="Close fullscreen preview"
          className="absolute inset-0 bg-black/60"
          onClick={() => onFullscreenChange(false)}
        />
        <div className="relative z-10 m-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl sm:m-6">
          <FullscreenHeader
            meta={meta}
            error={error}
            copied={copied}
            onCopy={handleCopy}
            onClose={() => onFullscreenChange(false)}
          />
          <pre
            className={cn(
              "min-h-0 flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed",
              responseSurfaceClass
            )}
          >
            <code>{content}</code>
          </pre>
        </div>
      </div>
    ) : null

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Response
          </p>
          {content ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onFullscreenChange(true)}
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Maximize2 className="size-3.5" />
              全屏预览
            </Button>
          ) : null}
        </div>

        {meta ? (
          <StatusLine
            className="flex gap-3 font-mono text-xs text-muted-foreground"
            meta={meta}
          />
        ) : null}

        {loading ? (
          <LoadingState />
        ) : content ? (
          <pre
            className={cn(
              "min-h-64 overflow-auto rounded-lg border p-3 font-mono text-xs leading-relaxed",
              error && !result
                ? "border-destructive/30 bg-destructive/5 text-destructive"
                : cn("max-h-80", responseSurfaceClass)
            )}
          >
            <code>{content}</code>
          </pre>
        ) : null}
      </div>

      {mounted && overlay ? createPortal(overlay, document.body) : null}
    </>
  )
}

function LoadingState() {
  return (
    <div
      className={cn(
        "flex min-h-64 items-center gap-2 rounded-lg border border-dashed border-border/60 p-3 text-xs text-muted-foreground",
        responseSurfaceClass
      )}
    >
      <Loader2 className="size-3.5 animate-spin" />
      Waiting for response...
    </div>
  )
}

function FullscreenHeader({
  meta,
  error,
  copied,
  onCopy,
  onClose,
}: {
  meta: { status: number; duration: number } | null
  error: string | null
  copied: boolean
  onCopy: () => void
  onClose: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {meta ? (
          <StatusLine
            className="flex items-center gap-3 font-mono text-xs text-muted-foreground"
            meta={meta}
          />
        ) : (
          <span className="text-sm text-muted-foreground">Response</span>
        )}
        {error ? <span className="text-sm text-destructive">{error}</span> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={onCopy} className="h-8 gap-1.5">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "已复制" : "复制"}
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onClose}
          aria-label="Close fullscreen preview"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function StatusLine({
  className,
  meta,
}: {
  className?: string
  meta: { status: number; duration: number }
}) {
  return (
    <div className={className}>
      <span
        className={cn(
          meta.status >= 200 && meta.status < 300
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-destructive"
        )}
      >
        {meta.status}
      </span>
      <span>{meta.duration}ms</span>
    </div>
  )
}
