import { ROUTE_CODE } from "@/data/endpoints"

export function CodePreview() {
  return (
    <div className="api-code-panel overflow-hidden rounded-xl border border-border/80 bg-[#0d1117] shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-white/50">
          cloud-functions/index.go
        </span>
      </div>
      <pre className="max-h-[420px] overflow-auto p-5 font-mono text-[13px] leading-relaxed text-[#e6edf3]">
        <code>{ROUTE_CODE}</code>
      </pre>
    </div>
  )
}
