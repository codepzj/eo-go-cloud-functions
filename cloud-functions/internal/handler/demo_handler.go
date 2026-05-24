package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type DemoHandler struct{}

func NewDemoHandler() *DemoHandler {
	return &DemoHandler{}
}

func (h *DemoHandler) Hello(c *gin.Context) {
	RespondSuccess(c, http.StatusOK, gin.H{
		"message": "Hello from Gin on EdgeOne Pages!",
	})
}

func (h *DemoHandler) Health(c *gin.Context) {
	RespondSuccess(c, http.StatusOK, gin.H{
		"status":  "healthy",
		"runtime": "go",
	})
}

func (h *DemoHandler) ListUsers(c *gin.Context) {
	RespondSuccess(c, http.StatusOK, []gin.H{
		{"id": 1, "name": "Alice", "email": "alice@example.com"},
		{"id": 2, "name": "Bob", "email": "bob@example.com"},
	})
}

func (h *DemoHandler) GetUser(c *gin.Context) {
	id := c.Param("id")
	RespondSuccess(c, http.StatusOK, gin.H{
		"id":    id,
		"name":  "Alice",
		"email": "alice@example.com",
	})
}

type createUserRequest struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
}

func (h *DemoHandler) CreateUser(c *gin.Context) {
	var req createUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		RespondError(c, http.StatusBadRequest, err.Error())
		return
	}

	RespondSuccess(c, http.StatusCreated, gin.H{
		"id":    3,
		"name":  req.Name,
		"email": req.Email,
	})
}

func (h *DemoHandler) ListPosts(c *gin.Context) {
	RespondSuccess(c, http.StatusOK, []gin.H{
		{"id": 1, "title": "Getting Started with Gin"},
		{"id": 2, "title": "Deploying to EdgeOne Pages"},
	})
}

func (h *DemoHandler) GetPost(c *gin.Context) {
	id := c.Param("id")
	RespondSuccess(c, http.StatusOK, gin.H{
		"id":    id,
		"title": "Getting Started with Gin",
		"body":  "Build high-performance APIs with Gin framework.",
	})
}
