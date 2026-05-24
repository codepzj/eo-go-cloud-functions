package main

import (
	"cloud-functions/conf"
	"cloud-functions/internal/handler"
	"cloud-functions/internal/service"
	"cloud-functions/pkg/logger"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	config := conf.GetConfig()

	// 初始化基础设施
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

	healthSvc := service.NewHealthService()
	healthHandler := handler.NewHealthHandler(healthSvc)
	demoHandler := handler.NewDemoHandler()

	// 注册路由
	r := gin.Default()
	r.GET("/health", healthHandler.Health)

	v1 := r.Group("/v1")
	{
		v1.GET("/hello", demoHandler.Hello)
		v1.GET("/health", demoHandler.Health)

		users := v1.Group("/users")
		{
			users.GET("", demoHandler.ListUsers)
			users.GET("/:id", demoHandler.GetUser)
			users.POST("", demoHandler.CreateUser)
		}

		posts := v1.Group("/posts")
		{
			posts.GET("", demoHandler.ListPosts)
			posts.GET("/:id", demoHandler.GetPost)
		}
	}

	go func() {
		r.Run(fmt.Sprintf(":%d", config.Port))
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	logger.Info("server shutdown gracefully...")
}
