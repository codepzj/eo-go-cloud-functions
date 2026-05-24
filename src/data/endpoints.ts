export type HttpMethod = "GET" | "POST"

export type ApiEndpoint = {
  id: string
  method: HttpMethod
  path: string
  description: string
  body?: string
}

export const ROUTE_CODE = `// cloud-functions/api.go
package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default()

    v1 := r.Group("/v1")
    {
        v1.GET("/health", healthHandler)
        v1.GET("/geo", geoHandler)
    }

    r.Run(":9000")
}`

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
      "Client IP and country from EdgeOne headers (EO-Client-IP, EO-Client-IPCountry)",
  },
]

export const FEATURES = [
  {
    title: "Client Geo",
    description:
      "Read client IP and country from EdgeOne origin-pull headers",
  },
  {
    title: "Health Check",
    description: "Service status with Go runtime version and UTC timestamp",
  },
  {
    title: "Gin Framework",
    description: "High-performance HTTP routing on EdgeOne Cloud Functions",
  },
]
