// server contains the Easy-Books application server functions.
package server

import (
	"errors"
	"os"

	"github.com/ahmedsasuhail/easy-books/db"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/ahmedsasuhail/easy-books/routes"
	"github.com/gin-gonic/gin"
)

// Init initializes the webserver and returns the router.
func Init() *gin.Engine {
	// TODO: add more initialization (environment configuration, db connections, etc.).
	// TODO: add some init logging.
	// TODO: gracefully handle termination (Ctrl-C).

	// Try retrieving Postgres URI from environment and panic if not found.
	postgresURI, exists := os.LookupEnv("EB_POSTGRES_URI")
	if !exists {
		panic(errors.New("variable $EB_POSTGRES_URI not found in current environment"))
	}

	// Try connecting to the PostgreSQL database.
	pgClient, err := db.ConnectPostgres(postgresURI)
	if err != nil {
		panic(err)
	}
	defer pgClient.Disconnect()

	// Migrate required models.
	models := []interface{}{
		models.User{},
	}
	pgClient.Migrate(models)

	return routes.Get()
}

// Run runs the webserver using the specified router.
func Run(router *gin.Engine) {
	router.Run()
}
