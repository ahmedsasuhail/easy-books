package main

import (
	"flag"

	"github.com/ahmedsasuhail/easy-books/server"
)

func main() {
	r := server.Init(&server.Config{
		EnvFile: flag.String("env", "", "The file containing environment variables to load"),
	})
	flag.Parse()
	server.Run(r)
}
