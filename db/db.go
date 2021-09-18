// db contains database functions and operations.
package db

import (
	"github.com/ahmedsasuhail/easy-books/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
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

// ConnectPostgres establishes a PostgreSQL database connection and returns the
// connection client.
func ConnectPostgres(uri string) (*PostgresClient, error) {
	db, err := gorm.Open(postgres.Open(uri), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return &PostgresClient{db}, nil
}

// GetUser searches for a user in the database based on the provided email address.
// If the user does not exist, an error is returned. If the user exists, the user
// returned.
func (db *PostgresClient) GetUser(email string) (*models.User, error) {
	user := &models.User{}

	// Search the database.
	if err := db.Where("Email = ?", email).First(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}
