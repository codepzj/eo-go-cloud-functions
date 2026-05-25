package main

import (
	"cloud-functions/conf"
	"cloud-functions/internal/handler"
	"cloud-functions/internal/service"
	"cloud-functions/pkg/logger"

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

	r.Run(":9000")
}
