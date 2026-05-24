package main

import (
	"cloud-functions/conf"
	"cloud-functions/internal/handler"
	"cloud-functions/internal/service"
	"cloud-functions/pkg/logger"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"

	"github.com/gin-gonic/gin"
)

func main() {
	config := conf.GetConfig()

	logger.NewLogger(&logger.Option{
		Format: config.Log.Format,
		Level:  config.Log.Level,
		Output: &logger.OutputConfig{
			EnableFile: config.Log.Output.EnableFile,
			FilePath:   config.Log.Output.FilePath,
			MaxAge:     config.Log.Output.MaxAge,
		},
	})
	defer logger.Sync()

	healthHandler := handler.NewHealthHandler(service.NewHealthService())
	geoHandler := handler.NewGeoHandler()

	r := gin.Default()

	v1 := r.Group("/v1")
	{
		v1.GET("/health", healthHandler.Health)
		v1.GET("/geo", geoHandler.Geo)
	}

	go func() {
		if err := http.ListenAndServe(
			fmt.Sprintf(":%d", config.Port),
			devAPIPrefixStrip(r),
		); err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	logger.Info("server shutdown gracefully...")
}

func devAPIPrefixStrip(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if path := r.URL.Path; path == "/api" || strings.HasPrefix(path, "/api/") {
			r.URL.Path = strings.TrimPrefix(path, "/api")
			if r.URL.Path == "" {
				r.URL.Path = "/"
			}
		}
		next.ServeHTTP(w, r)
	})
}
