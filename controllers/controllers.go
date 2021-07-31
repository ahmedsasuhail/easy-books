// controllers contains the endpoint handlers for the backend app.
package controllers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/ahmedsasuhail/easy-books/auth"
	"github.com/ahmedsasuhail/easy-books/db"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/sha3"
)

// Forbidden is a convenience handler that can be used to return the HTTP
// Status "Forbidden" for a particular route.
func Forbidden(c *gin.Context) {
	c.AbortWithStatus(http.StatusForbidden)
}

// AppInit initializes the backend app and displays a JSON message.
func AppInit(c *gin.Context) {
	// TODO: Add some actual initialization stuff.
	c.JSON(http.StatusOK, models.Response{
		Status:  "success",
		Code:    http.StatusOK,
		Message: "App initialized.",
	})
}

// Login checks the provided credentials and returns a response containing
// a JWT auth token for the provided credentials.
func Login(c *gin.Context) {
	email := c.GetHeader("email")
	password := c.GetHeader("password")

	// TODO: try using global DB connection, rather than creating a new local one.
	postgresURI := os.Getenv("EB_POSTGRES_URI")
	pgClient, err := db.ConnectPostgres(postgresURI)
	if err != nil {
		panic(err)
	}
	defer pgClient.Disconnect()

	// Read user from DB.
	user, err := pgClient.GetUser(email)
	if err != nil {
		// TODO: check whether 404 is appropriate status code for this response.
		c.JSON(http.StatusNotFound, models.Response{
			Status:  "fail",
			Code:    http.StatusNotFound,
			Message: fmt.Sprintf("The email %s does not exist", email),
		})
	} else {
		hash := sha3.New512()
		hash.Write([]byte(password))
		hashedPassword := hash.Sum(nil)

		// Validate credentials and return generated JWT token.
		// TODO: find a better way to perform the comparison.
		if fmt.Sprintf("%x", hashedPassword) == user.Password {
			secretKey := os.Getenv("EB_SECRET_KEY")

			token, err := auth.JWTAuthService(
				secretKey,
				"Easy-Books",
			).GenerateToken(user.ID, user.Name, user.Email)
			if err != nil {
				// ? Maybe this should return an error response instead.
				panic(err)
			}

			c.JSON(http.StatusOK, models.Response{
				Status:  "success",
				Code:    http.StatusOK,
				Message: "User successfully logged in.",
				Data: map[string]string{
					"name":  user.Name,
					"email": user.Email,
					"token": token,
				},
			})
		} else {
			c.JSON(http.StatusUnauthorized, models.Response{
				Status:  "fail",
				Code:    http.StatusUnauthorized,
				Message: "Provided password is incorrect.",
			})
		}
	}
}
