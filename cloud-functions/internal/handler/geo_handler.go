package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type GeoHandler struct{}

func NewGeoHandler() *GeoHandler {
	return &GeoHandler{}
}

func (h *GeoHandler) Geo(c *gin.Context) {
	ip := clientIP(c)
	country := clientCountry(c)

	RespondSuccess(c, http.StatusOK, gin.H{
		"ip":      ip,
		"country": country,
	})
}

func clientIP(c *gin.Context) string {
	for _, key := range []string{"EO-Client-IP"} {
		if value := strings.TrimSpace(c.GetHeader(key)); value != "" {
			if key == "X-Forwarded-For" {
				return strings.TrimSpace(strings.Split(value, ",")[0])
			}
			return value
		}
	}

	return c.ClientIP()
}

func clientCountry(c *gin.Context) gin.H {
	code := firstHeader(c, "EO-Client-IPCountry", "X-EO-Geo-Country-Code-Alpha2", "CF-IPCountry")

	name := firstHeader(c, "EO-Client-IPCountryName", "X-EO-Geo-Country-Name")

	region := firstHeader(c, "EO-Client-IPRegion", "X-EO-Geo-Region-Name")
	city := firstHeader(c, "EO-Client-IPCity", "X-EO-Geo-City-Name")

	return gin.H{
		"code":   code,
		"name":   name,
		"region": region,
		"city":   city,
	}
}

func firstHeader(c *gin.Context, keys ...string) string {
	for _, key := range keys {
		if value := strings.TrimSpace(c.GetHeader(key)); value != "" {
			return value
		}
	}
	return ""
}
