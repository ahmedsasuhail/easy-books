// routes contains the router and router group configurations.
package routes

import (
	"github.com/ahmedsasuhail/easy-books/controllers"
	"github.com/ahmedsasuhail/easy-books/middleware"
	"github.com/gin-gonic/gin"
)

// Get returns a gin router with the configured routes and router groups.
func Get() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	router.GET("/", controllers.Forbidden)

	// `/eb` is the Easy-Books app root.
	app := router.Group("/eb")
	{
		app.GET("/", controllers.AppInit)

		auth := app.Group("/auth")
		{
			auth.POST("/login", controllers.Login)
		}
	}

	return router
}
