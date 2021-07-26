// db contains database functions and operations.
package db

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

// PostgresClient represents a PostgreSQL database connection client.
type PostgresClient struct {
	*gorm.DB
}

// Migrate applies the database migration for the specified models.
func (db *PostgresClient) Migrate(models []interface{}) {
	for _, model := range models {
		db.AutoMigrate(model)
	}
}

// Disconnect closes a PostgreSQL database connection.
func (db *PostgresClient) Disconnect() {
	db.Close()
}

// ConnectPostgres establishes a PostgreSQL database connection and returns the
// connection client.
func ConnectPostgres(uri string) (*PostgresClient, error) {
	db, err := gorm.Open("postgres", uri)
	if err != nil {
		return nil, err
	}

	return &PostgresClient{db}, nil
}
