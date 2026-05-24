export type ApiResult = {
  ok: boolean
  status: number
  duration: number
  data: unknown
}

export async function callApi(
  path: string,
  options?: {
    method?: "GET" | "POST"
    body?: string
  }
): Promise<ApiResult> {
  const started = performance.now()
  const method = options?.method ?? "GET"

  const response = await fetch(path, {
    method,
    headers:
      method === "POST"
        ? { "Content-Type": "application/json" }
        : undefined,
    body: method === "POST" ? options?.body : undefined,
  })

  const duration = Math.round(performance.now() - started)
  const contentType = response.headers.get("content-type") ?? ""

  let data: unknown
  if (contentType.includes("application/json")) {
    data = await response.json()
  } else {
    data = await response.text()
  }

  return {
    ok: response.ok,
    status: response.status,
    duration,
    data,
  }
}
