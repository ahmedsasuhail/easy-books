package middleware

import (
	"net/http"

	"github.com/ahmedsasuhail/easy-books/auth"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware enables Cross-Origin requests.
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

// ValidateJWT validates a provided JWT authentication token.
func ValidateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Read and parse bearer token.
		token := c.GetHeader("Authorization")
		// Validate token.
		err := auth.ValidateToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, models.Response{
				Status:  "fail",
				Code:    http.StatusUnauthorized,
				Message: err.Error(),
			})
		}

		c.Next()
	}
}
