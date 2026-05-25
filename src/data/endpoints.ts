export type HttpMethod = "GET" | "POST"

export type ApiEndpoint = {
  id: string
  method: HttpMethod
  path: string
  description: string
  body?: string
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "health",
    method: "GET",
    path: "/api/v1/health",
    description: "Health check with Go version and server timestamp",
  },
  {
    id: "geo",
    method: "GET",
    path: "/api/v1/geo",
    description:
      "Client IP and geo location from EdgeOne headers (EO-Client-IP, EO-Connecting-Geo)",
  },
]
