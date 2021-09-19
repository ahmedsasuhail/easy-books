// models contains the model definitions for the backend database and responses.
package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// ----------------------------------------------------------------------------
// API MODELS
// ----------------------------------------------------------------------------

// Response represents a well structured JSON response.
type Response struct {
	Status  string      `json:"status"`
	Code    uint        `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

// ----------------------------------------------------------------------------
// DATABASE MODELS
// ----------------------------------------------------------------------------

// Tabler is an interface that allows for custom names for tables.
type Tabler interface {
	TableName() string
}

// User represents a table containing user data.
type Users struct {
	gorm.Model

	Name     string
	Email    string `gorm:"type:varchar(100);unique_index"`
	Password string `json:"Password"`
}

func (Users) TableName() string {
	return "eb_users"
}

type Sales struct {
	gorm.Model

	ID             uint64  `gorm:"primaryKey"`
	Price          float64 `sql:"type:decimal(8,2);"`
	Data           datatypes.Date
	RelationshipID uint64
	PurchaseID     uint64
	InventoryID    uint64
	Relationships  Relationships `gorm:"foreignKey:RelationshipID"`
	Purchases      Purchases     `gorm:"foreignKey:PurchaseID"`
	Inventory      Inventory     `gorm:"foreignKey:InventoryID"`
}

func (Sales) TableName() string {
	return "eb_sales"
}

type SalesReturns struct {
	gorm.Model

	ID      uint64 `gorm:"primaryKey"`
	Date    datatypes.Date
	SalesID uint64
	Sales   Sales `gorm:"foreignKey:SalesID"`
}

func (SalesReturns) TableName() string {
	return "eb_sales_returns"
}

type Purchases struct {
	gorm.Model

	ID             uint64 `gorm:"primaryKey"`
	CompanyName    string
	VehicleName    string
	Price          float64 `sql:"type:decimal(8,2);"`
	Date           datatypes.Date
	RelationshipID uint64
	Relationships  Relationships `gorm:"foreignKey:RelationshipID"`
}

func (Purchases) TableName() string {
	return "eb_purchases"
}

type Inventory struct {
	gorm.Model

	ID         uint64 `gorm:"primaryKey"`
	PartName   string
	Quantity   uint32
	PurchaseID uint64
	Purchases  Purchases `gorm:"foreignKey:PurchaseID"`
}

func (Inventory) TableName() string {
	return "eb_inventory"
}

type Relationships struct {
	gorm.Model

	ID          uint64 `gorm:"primaryKey"`
	Name        string
	PhoneNumber string
	Address     string
}

func (Relationships) TableName() string {
	return "eb_relationships"
}

type Miscellaneous struct {
	gorm.Model

	ID          uint64 `gorm:"primaryKey"`
	Description string
	Price       float64 `sql:"type:decimal(8,2);"`
	Date        datatypes.Date
}

func (Miscellaneous) TableName() string {
	return "eb_miscellaneous"
}
