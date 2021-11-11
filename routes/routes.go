// routes contains the router and router group configurations.
package routes

import (
	"os"

	"github.com/ahmedsasuhail/easy-books/controllers"
	"github.com/ahmedsasuhail/easy-books/middleware"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

// Get returns a gin router with the configured routes and router groups.
func Get() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.CORSMiddleware())

	// Serve UI at app root.
	// The absolute path to the UI static directory must be set in the
	// EB_FRONTEND_PATH environment variable.
	uiPath := os.Getenv("EB_FRONTEND_PATH")

	router.Use(
		static.Serve("/", static.LocalFile(
			uiPath,
			true,
		)),
	)

	// `/eb` is the Easy-Books API root.
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
			miscellaneous.POST("/", controllers.CreateMiscellaneous)
			miscellaneous.PATCH("/", controllers.UpdateMiscellaneous)
			miscellaneous.GET("/", controllers.ReadMiscellaneous)
			miscellaneous.DELETE("/", controllers.DeleteMiscellaneous)
		}

		relationships := app.Group("/relationships")
		relationships.Use(middleware.ValidateJWT())
		{
			relationships.POST("/", controllers.CreateRelationships)
			relationships.PATCH("/", controllers.UpdateRelationships)
			relationships.GET("/", controllers.ReadRelationships)
			relationships.DELETE("/", controllers.DeleteRelationships)
		}

		purchases := app.Group("/purchases")
		purchases.Use(middleware.ValidateJWT())
		{
			purchases.POST("/", controllers.CreatePurchases)
			purchases.PATCH("/", controllers.UpdatePurchases)
			purchases.GET("/", controllers.ReadPurchases)
			purchases.DELETE("/", controllers.DeletePurchases)
		}

		inventory := app.Group("/inventory")
		inventory.Use(middleware.ValidateJWT())
		{
			inventory.POST("/", controllers.CreateInventory)
			inventory.PATCH("/", controllers.UpdateInventory)
			inventory.GET("/", controllers.ReadInventory)
			inventory.DELETE("/", controllers.DeleteInventory)

			inventory.POST("/get_by_purchase", controllers.GetInventoryByPurchaseID)
		}

		sales := app.Group("/sales")
		sales.Use(middleware.ValidateJWT())
		{
			sales.POST("/", controllers.CreateSales)
			sales.PATCH("/", controllers.UpdateSales)
			sales.GET("/", controllers.ReadSales)
			sales.DELETE("/", controllers.DeleteSales)
		}

		reports := app.Group("/reports")
		reports.Use(middleware.ValidateJWT())
		{
			reports.POST("/by_purchase", controllers.ReportByPurchaseID)
			reports.POST("/by_relationship", controllers.ReportByRelationshipID)
		}
	}

	return router
}
