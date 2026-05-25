package handler

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

type GeoHandler struct{}

func NewGeoHandler() *GeoHandler {
	return &GeoHandler{}
}

func (h *GeoHandler) Geo(c *gin.Context) {
	ip := c.ClientIP()
	geo := c.Request.Header.Get("EO-Connecting-Geo")

	// 解码 geo header
	geoDecoded, err := url.QueryUnescape(geo)
	if err != nil {
		RespondError(c, http.StatusBadRequest, err.Error())
		return
	}

	// k1="v1" k2="v2" -> k1=v1&k2=v2
	urlQuery := strings.ReplaceAll(strings.ReplaceAll(geoDecoded, " ", "&"), "\"", "")

	// 解析 url query
	geoParsed, err := url.ParseQuery(urlQuery)
	if err != nil {
		RespondError(c, http.StatusBadRequest, err.Error())
		return
	}

	country := geoParsed.Get("nation_alpha2") // 首字母大写的国家代码
	region := geoParsed.Get("region_name")    // 地区名称
	city := geoParsed.Get("city_name")        // 城市名称
	latitude := geoParsed.Get("latitude")     // 纬度
	longitude := geoParsed.Get("longitude")   // 经度

	RespondSuccess(c, http.StatusOK, gin.H{
		"ip":        ip,
		"country":   country,
		"region":    region,
		"city":      city,
		"latitude":  latitude,
		"longitude": longitude,
	})
}
