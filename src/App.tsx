import { EndpointCard } from "@/components/endpoint-card"
import { API_ENDPOINTS } from "@/data/endpoints"

export function App() {
  return (
    <div className="relative min-h-svh">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,173,216,0.15),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,173,216,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,173,216,0.03)_1px,transparent_1px)] bg-size-[48px_48px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section className="api-fade-in space-y-5">
          <h2 className="font-heading text-2xl font-semibold">API Endpoints</h2>
          <div className="grid gap-4">
            {API_ENDPOINTS.map((endpoint, index) => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
