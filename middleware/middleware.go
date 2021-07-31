package middleware

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/auth"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// ValidateJWT is a middleware that validates a provided JWT authentication token.
func ValidateJWT(secret, issuer string) gin.HandlerFunc {
	return func(c *gin.Context) {
		const BEARER_SCHEMA = "Bearer"
		authHeader := c.GetHeader("Authorization")
		tokenString := authHeader[len(BEARER_SCHEMA):]
		token, err := auth.JWTAuthService(secret, issuer).ValidateToken(tokenString)

		if token.Valid {
			claims := token.Claims.(jwt.MapClaims)
			fmt.Println(claims)
		} else {
			fmt.Println(err)
			c.JSON(http.StatusUnauthorized, models.Response{
				Status:  "fail",
				Code:    http.StatusUnauthorized,
				Message: "Invalid auth token.",
			})
		}
	}
}
