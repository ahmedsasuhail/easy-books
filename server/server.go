// server contains the Easy-Books application server functions.
package server

import (
	"github.com/ahmedsasuhail/easy-books/routes"
	"github.com/gin-gonic/gin"
)

// Init initializes the webserver and returns the router.
func Init() *gin.Engine {
	// TODO: add more initialization (environment configuration, db connections, etc.).
	return routes.Get()
}

// Run runs the webserver using the specified router.
func Run(router *gin.Engine) {
	router.Run()
}
