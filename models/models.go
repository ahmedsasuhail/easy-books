// models contains the model definitions for the backend database and responses.
package models

import (
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
)

// Response represents a well structured JSON response.
type Response struct {
	Status  string      `json:"status"`
	Code    uint        `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// User represents a table containing user data.
type User struct {
	gorm.Model

	Name     string
	Email    string `gorm:"type:varchar(100);unique_index"`
	Password string `json:"Password"`
}

// Token represents a JWT token.
type Token struct {
	UserID uint
	Name   string
	Email  string
	*jwt.StandardClaims
}

// Exception represents a JSON error response.
type Exception struct {
	Message string `json:"message"`
}
