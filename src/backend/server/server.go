// server contains the Easy-Books application server functions.
package server

import (
	"fmt"
	"os"

	"github.com/ahmedsasuhail/easy-books/controllers"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/ahmedsasuhail/easy-books/routes"
	"github.com/gin-gonic/gin"
)

// Init initializes the webserver and returns the router.
func Init() *gin.Engine {
	// TODO: add some init logging.
	// TODO: gracefully handle termination (Ctrl-C).

	// Retrieve required variables from environment and exit if any not found.
	env := []string{
		"DATABASE_URL",
		"PORT",
		"EB_SECRET_KEY",
		"EB_FRONTEND_PATH",
		"MEILISEARCH_HOST",
		"MEILISEARCH_API_KEY",
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

	// Required models to migrate.
	models := []interface{}{
		models.Users{},
		models.Inventory{},
		models.Purchases{},
		models.Relationships{},
		models.Sales{},
		models.Miscellaneous{},
	}

	// Try establishing a DB connection and migrate the models.
	err := controllers.InitDB(models)
	if err != nil {
		panic(err)
	}

	return routes.Get()
}

// Run runs the webserver using the specified router.
func Run(router *gin.Engine) {
	router.Run(
		fmt.Sprintf(":%s", os.Getenv("PORT")),
	)
}
