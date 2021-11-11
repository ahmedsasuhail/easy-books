// controllers contains the endpoint handlers for the backend app.
package controllers

import (
	"encoding/hex"
	"fmt"
	"net/http"
	"os"

	"github.com/ahmedsasuhail/easy-books/auth"
	"github.com/ahmedsasuhail/easy-books/db"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/sha3"
)

var pgClient *db.PostgresClient

// InitDB initializes a database connection and migrates the specified models.
func InitDB(models []interface{}) error {
	var err error
	pgClient, err = db.ConnectPostgres(os.Getenv("DATABASE_URL"))
	if err != nil {
		return err
	}

	pgClient.Migrate(models)

	return nil
}

// AppInit initializes the backend app and displays a JSON message.
func AppInit(c *gin.Context) {
	// TODO: Add some actual initialization stuff.
	successResponse(c, http.StatusOK, "App initialized.", nil)
}

// Login checks the provided credentials and returns a response containing
// a JWT auth token for the provided credentials.
func Login(c *gin.Context) {
	// Read and parse request body.
	var jsonBody map[string]string
	err := parseRequestBody(c, &jsonBody)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	// TODO: Add proper error handling for missing keys.
	email := jsonBody["email"]
	password := jsonBody["password"]

	// Read user from DB.
	user, err := pgClient.GetUser(email)
	if err != nil {
		// TODO: check whether 404 is appropriate status code for this response.
		failResponse(
			c,
			http.StatusNotFound,
			fmt.Sprintf("The email %s does not exist.", email),
		)

		return
	} else {
		hash := sha3.New512()
		hash.Write([]byte(password))
		hashedPassword := hash.Sum(nil)

		// Validate credentials and return generated JWT token.
		// TODO: find a better way to perform the comparison.
		if fmt.Sprintf("%x", hashedPassword) == user.Password {
			token, err := auth.GenerateToken(user.Email)
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, err.Error())

				return
			} else {
				successResponse(
					c,
					http.StatusOK,
					"",
					map[string]interface{}{
						"user": map[string]string{
							"name":  user.Name,
							"email": user.Email,
						},
						"auth": token,
					},
				)
			}
		} else {
			failResponse(
				c,
				http.StatusUnauthorized,
				"Provided password is incorrect.",
			)

			return
		}
	}
}

// Register adds a new user to the database.
func Register(c *gin.Context) {
	// Read and parse request body.
	var jsonBody map[string]string
	err := parseRequestBody(c, &jsonBody)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	// TODO: Add proper error handling for missing keys.
	name := jsonBody["name"]
	email := jsonBody["email"]
	password := jsonBody["password"]

	// Check if user already exists.
	_, err = pgClient.GetUser(email)
	if err == nil {
		failResponse(c,
			http.StatusBadRequest,
			fmt.Sprintf("User with email %s already exists.", email),
		)

		return
	} else {
		hash := sha3.New512()
		hash.Write([]byte(password))
		hashedPassword := hex.EncodeToString(hash.Sum(nil))

		user := &models.Users{
			Name:     name,
			Email:    email,
			Password: hashedPassword,
		}

		// If there was an error while creating the user, return an error response
		// with the DB error message.
		createdUser := pgClient.Create(user)
		if createdUser.Error != nil {
			errorResponse(
				c,
				http.StatusInternalServerError,
				createdUser.Error.Error(),
			)

			return
		} else {
			successResponse(
				c,
				http.StatusOK,
				"",
				map[string]string{
					"name":  name,
					"email": email,
				},
			)
		}
	}
}
