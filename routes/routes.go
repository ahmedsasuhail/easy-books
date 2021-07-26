// routes contains the router and router group configurations.
package routes

import (
	"github.com/ahmedsasuhail/easy-books/controllers"
	"github.com/gin-gonic/gin"
)

// Get returns a gin router with the configured routes and router groups.
func Get() *gin.Engine {
	// TODO: use custom middleware instead of default.
	router := gin.Default()

	router.GET("/", controllers.Forbidden)

	// `/eb` is the Easy-Books app root.
	app := router.Group("/eb")
	{
		app.GET("/", controllers.AppInit)
	}

	return router
}
