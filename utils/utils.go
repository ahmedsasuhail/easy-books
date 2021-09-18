// utils contains basic convenience functions and utilities.
package utils

import "os"

// Setenv sets the shell environment with the specified map of keys and values.
func Setenv(env map[string]string) {
	for key, val := range env {
		os.Setenv(key, val)
	}
}

// Getenv retrieves a list of shell environment variables and returns it as a map.
func Getenv(keys []string) map[string]string {
	env := make(map[string]string)

	for _, key := range keys {
		env[key] = os.Getenv(key)
	}

	return env
}
