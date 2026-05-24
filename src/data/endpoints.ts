export type HttpMethod = "GET" | "POST"

export type ApiEndpoint = {
  id: string
  method: HttpMethod
  path: string
  description: string
  body?: string
}

export const ROUTE_CODE = `package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default()

    // REST API v1 group
    v1 := r.Group("/api/v1")
    {
        v1.GET("/hello", helloHandler)
        v1.GET("/health", healthHandler)

        // Users group
        users := v1.Group("/users")
        {
            users.GET("", listUsersHandler)
            users.GET("/:id", getUserHandler)
            users.POST("", createUserHandler)
        }

        // Posts group
        posts := v1.Group("/posts")
        {
            posts.GET("", listPostsHandler)
            posts.GET("/:id", getPostHandler)
        }
    }

    r.Run(":2574")
}`

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: "hello",
    method: "GET",
    path: "/api/v1/hello",
    description: "Simple GET route returning a welcome message",
  },
  {
    id: "health",
    method: "GET",
    path: "/api/v1/health",
    description: "Health check endpoint with Go runtime info",
  },
  {
    id: "users-list",
    method: "GET",
    path: "/api/v1/users",
    description: "GET route with JSON array response",
  },
  {
    id: "users-get",
    method: "GET",
    path: "/api/v1/users/42",
    description: 'Dynamic route parameter with c.Param("id")',
  },
  {
    id: "users-create",
    method: "POST",
    path: "/api/v1/users",
    description: "POST route with JSON request body binding",
    body: JSON.stringify(
      { name: "Alice", email: "alice@example.com" },
      null,
      2
    ),
  },
  {
    id: "posts-list",
    method: "GET",
    path: "/api/v1/posts",
    description: "Another resource group demonstrating route organization",
  },
  {
    id: "posts-get",
    method: "GET",
    path: "/api/v1/posts/7",
    description: "Dynamic param in posts group",
  },
]

export const FEATURES = [
  {
    title: "Routing Groups",
    description: "Organize APIs with nested route groups and middleware",
  },
  {
    title: "JSON Binding",
    description: "Automatic request body parsing with struct validation",
  },
  {
    title: "Middleware Support",
    description: "Custom middleware for logging, auth, and more",
  },
]
