import { useState } from "react"
import { Loader2, Play } from "lucide-react"

import { ResponsePreview } from "@/components/response-preview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import type { ApiEndpoint } from "@/data/endpoints"
import { callApi } from "@/lib/api"

type EndpointCardProps = {
  endpoint: ApiEndpoint
  index: number
}

export function EndpointCard({ endpoint, index }: EndpointCardProps) {
  const [loading, setLoading] = useState(false)
  const [showResponse, setShowResponse] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ status: number; duration: number } | null>(
    null
  )

  async function handleCall() {
    setLoading(true)
    setError(null)
    setResult(null)
    setMeta(null)
    setShowResponse(true)
    setFullscreen(false)

    try {
      const response = await callApi(endpoint.path, {
        method: endpoint.method,
        body: endpoint.body,
      })

      setMeta({ status: response.status, duration: response.duration })
      setResult(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className="api-endpoint-card group border-border/70 transition-all duration-300 hover:border-[#00ADD8]/40 hover:shadow-lg hover:shadow-[#00ADD8]/5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <CardHeader className="gap-3">
        <EndpointActions
          endpoint={endpoint}
          loading={loading}
          onCall={handleCall}
        />
        <CardDescription>{endpoint.description}</CardDescription>
      </CardHeader>

      {endpoint.body ? (
        <CardContent className="pt-0">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Request Body
          </p>
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
            <code>{endpoint.body}</code>
          </pre>
        </CardContent>
      ) : null}

      {showResponse ? (
        <CardContent className="border-t border-border/60 pt-4">
          <ResponsePreview
            result={result}
            error={error}
            meta={meta}
            loading={loading}
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
          />
        </CardContent>
      ) : null}
    </Card>
  )
}

function EndpointActions({
  endpoint,
  loading,
  onCall,
}: {
  endpoint: ApiEndpoint
  loading: boolean
  onCall: () => void
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <Badge variant={endpoint.method === "GET" ? "get" : "post"}>
          {endpoint.method}
        </Badge>
        <code className="truncate font-mono text-sm text-foreground/90">
          {endpoint.path}
        </code>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onCall}
        disabled={loading}
        className="shrink-0 border-[#00ADD8]/30 bg-[#00ADD8]/5 text-[#00ADD8] hover:bg-[#00ADD8]/15 hover:text-[#00ADD8] dark:text-[#5dccf0]"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Play className="fill-current" />
        )}
        Call
      </Button>
    </div>
  )
}
