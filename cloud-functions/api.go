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

	healthSvc := service.NewHealthService()
	healthHandler := handler.NewHealthHandler(healthSvc)
	demoHandler := handler.NewDemoHandler()

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
		// 本地 dev 不会剥离 /api 前缀，在 Gin 路由匹配前统一处理；
		// 生产环境 EdgeOne 已剥离，/v1/* 路径不受影响。
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
