package main

import (
	"github.com/ahmedsasuhail/easy-books/server"
)

func main() {
	r := server.Init()
	server.Run(r)
}
