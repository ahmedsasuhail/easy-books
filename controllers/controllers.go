// controllers contains the endpoint handlers for the backend app.
package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Forbidden is a convenience handler that can be used to return the HTTP
// Status "Forbidden" for a particular route.
func Forbidden(c *gin.Context) {
	c.AbortWithStatus(http.StatusForbidden)
}

// AppInit initializes the backend app and displays a JSON message.
func AppInit(c *gin.Context) {
	// TODO: Add some actual initialization stuff.
	c.JSON(http.StatusOK, gin.H{
		"message": "App initialized.",
	})
}
