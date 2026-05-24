package handler

import (
	"cloud-functions/internal/service"
	"net/http"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
)

type HealthHandler struct {
	svc *service.HealthService
}

func NewHealthHandler(svc *service.HealthService) *HealthHandler {
	return &HealthHandler{svc: svc}
}

func (h *HealthHandler) Health(c *gin.Context) {
	RespondSuccess(c, http.StatusOK, gin.H{
		"status":    "ok",
		"runtime":   "go",
		"version":   runtime.Version(),
		"framework": "gin",
		"timestamp": time.Now().UTC().Format(time.RFC3339),
	})
}
