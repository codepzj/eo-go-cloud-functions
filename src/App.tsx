import { ExternalLink, Layers, Shield, Zap } from "lucide-react"

import { CodePreview } from "@/components/code-preview"
import { EndpointCard } from "@/components/endpoint-card"
import { Button } from "@/components/ui/button"
import { API_ENDPOINTS, FEATURES } from "@/data/endpoints"

const FEATURE_ICONS = [Layers, Zap, Shield] as const

export function App() {
  return (
    <div className="relative min-h-svh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,173,216,0.15),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,173,216,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,173,216,0.03)_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <header className="api-fade-in mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00ADD8]/20 bg-[#00ADD8]/5 px-3 py-1 text-xs font-medium text-[#00ADD8]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#00ADD8]" />
            Gin + EdgeOne Pages
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight md:text-5xl lg:text-6xl">
              Gin <span className="text-[#00ADD8]">+</span> EdgeOne Pages
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Build high-performance web applications with{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                Gin
              </code>{" "}
              framework. Call the API to inspect client IP, country, and service
              health powered by EdgeOne edge headers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[#00ADD8] text-white hover:bg-[#00ADD8]/90"
            >
              <a
                href="https://edgeone.ai/pages/new?from=github&template=go-gin-template"
                target="_blank"
                rel="noreferrer"
              >
                One-Click Deployment
                <ExternalLink />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://pages.edgeone.ai/document/go"
                target="_blank"
                rel="noreferrer"
              >
                View Documentation
                <ExternalLink />
              </a>
            </Button>
          </div>
        </header>

        <section className="api-fade-in mb-20 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <CodePreview />
          <div className="space-y-4 lg:pt-8">
            <h2 className="font-heading text-2xl font-semibold">API Endpoints</h2>
            <p className="text-sm text-muted-foreground">
              Click <strong className="text-foreground">Call</strong> on any
              endpoint to invoke the live API and inspect the JSON response.
            </p>
            <div className="rounded-lg border border-dashed border-[#00ADD8]/30 bg-[#00ADD8]/5 px-4 py-3 font-mono text-xs text-muted-foreground">
              API 路由：<span className="text-[#00ADD8]">/api/v1/*</span> → Gin
              function（<span className="text-foreground">make run</span> 由
              EdgeOne 代理）
            </div>
          </div>
        </section>

        <section className="mb-20 space-y-5">
          <div className="grid gap-4">
            {API_ENDPOINTS.map((endpoint, index) => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} index={index} />
            ))}
          </div>
        </section>

        <section className="api-fade-in mb-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[index] ?? Layers
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border/70 bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-[#00ADD8]/30"
              >
                <Icon className="mb-3 size-5 text-[#00ADD8]" />
                <h3 className="font-heading mb-1.5 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </section>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>
            Powered by{" "}
            <a
              href="https://edgeone.ai"
              target="_blank"
              rel="noreferrer"
              className="text-[#00ADD8] hover:underline"
            >
              EdgeOne
            </a>{" "}
            · EdgeOne Pages
          </span>
          <span className="font-mono">
            Press <kbd className="rounded border px-1.5 py-0.5">d</kbd> to
            toggle dark mode
          </span>
        </footer>
      </div>
    </div>
  )
}

export default App
