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
		miscellaneous.Use(middleware.ValidateJWT())
		{
			miscellaneous.PUT("/", controllers.CreateOrUpdateMiscellaneous)
			miscellaneous.GET("/", controllers.ReadMiscellaneous)
			miscellaneous.DELETE("/", controllers.DeleteMiscellaneous)
		}

		relationships := app.Group("/relationships")
		relationships.Use(middleware.ValidateJWT())
		{
			relationships.PUT("/", controllers.CreateOrUpdateRelationships)
			relationships.GET("/", controllers.ReadRelationships)
			relationships.DELETE("/", controllers.DeleteRelationships)
		}

		purchases := app.Group("/purchases")
		purchases.Use(middleware.ValidateJWT())
		{
			purchases.PUT("/", controllers.CreateOrUpdatePurchases)
			purchases.GET("/", controllers.ReadPurchases)
			purchases.DELETE("/", controllers.DeletePurchases)
		}

		inventory := app.Group("/inventory")
		inventory.Use(middleware.ValidateJWT())
		{
			inventory.PUT("/", controllers.CreateOrUpdateInventory)
			inventory.GET("/", controllers.ReadInventory)
			inventory.DELETE("/", controllers.DeleteInventory)
		}

		sales := app.Group("/sales")
		sales.Use(middleware.ValidateJWT())
		{
			sales.PUT("/", controllers.CreateOrUpdateSales)
			sales.GET("/", controllers.ReadSales)
			sales.DELETE("/", controllers.DeleteSales)
		}

		salesReturns := app.Group("/sales_returns")
		salesReturns.Use(middleware.ValidateJWT())
		{
			salesReturns.PUT("/", controllers.CreateOrUpdateSalesReturns)
			salesReturns.GET("/", controllers.ReadSalesReturns)
			salesReturns.DELETE("/", controllers.DeleteSalesReturns)
		}
	}

	return router
}
