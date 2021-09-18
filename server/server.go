// server contains the Easy-Books application server functions.
package server

import (
	"fmt"
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

	// Retrieve required variables from environment and exit if any not found.
	env := []string{
		"EB_POSTGRES_URI",
		"EB_SECRET_KEY",
	}
	var missingEnv []string

	for _, key := range env {
		_, exists := os.LookupEnv(key)
		if !exists {
			missingEnv = append(missingEnv, key)
		}
	}

	if len(missingEnv) > 0 {
		fmt.Println("The following variables were not found in the current environment:")
		fmt.Println()

		for _, val := range missingEnv {
			fmt.Printf("$%s\n", val)
		}

		fmt.Println()
		os.Exit(1)
	}

	// Try connecting to the PostgreSQL database.
	pgClient, err := db.ConnectPostgres(os.Getenv("EB_POSTGRES_URI"))
	if err != nil {
		panic(err)
	}

	// Migrate required models.
	models := []interface{}{
		models.Users{},
		models.Inventory{},
		models.Purchases{},
		models.Relationships{},
		models.Sales{},
		models.SalesReturns{},
		models.Miscellaneous{},
	}
	pgClient.Migrate(models)

	return routes.Get()
}

// Run runs the webserver using the specified router.
func Run(router *gin.Engine) {
	router.Run()
}
