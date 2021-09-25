// routes contains the router and router group configurations.
package routes

import (
	"os"

	"github.com/ahmedsasuhail/easy-books/controllers"
	"github.com/ahmedsasuhail/easy-books/middleware"
	"github.com/gin-gonic/gin"
)

// Get returns a gin router with the configured routes and router groups.
func Get() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// `/eb` is the Easy-Books app root.
	app := router.Group("/eb")
	{
		app.GET("/", controllers.AppInit)

		auth := app.Group("/auth")
		{
			auth.POST("/login", controllers.Login)
			auth.POST("/register", controllers.Register)
		}

		miscellaneous := app.Group("/miscellaneous")
		miscellaneous.Use(middleware.ValidateJWT(os.Getenv("EB_SECRET"), "easy-books"))
		{
			miscellaneous.PUT("/", controllers.CreateOrUpdateMiscellaneous)
			miscellaneous.GET("/", controllers.ReadMiscellaneous)
			miscellaneous.DELETE("/", controllers.DeleteMiscellaneous)
		}
	}

	return router
}
