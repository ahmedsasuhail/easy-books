// models contains the model definitions for the backend database and responses.
package models

import (
	"time"

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

// Pagination represents a pagination request.
type Pagination struct {
	Page      int    `json:"page"`
	PageLimit int    `json:"page_limit"`
	OrderBy   string `json:"order_by"`
	SortOrder string `json:"sort_order"` // Can either be `"asc"` or `"desc"`.
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
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	Name     string `json:"name"`
	Email    string `gorm:"type:varchar(100);unique_index;primaryKey" json:"email"`
	Password string `json:"password"`
}

func (Users) TableName() string {
	return "eb_users"
}

type Sales struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	ID             uint64         `gorm:"primaryKey" json:"id"`
	Price          float64        `sql:"type:decimal(8,2);" json:"price"`
	Data           datatypes.Date `json:"date"`
	RelationshipID uint64         `json:"relationship_id"`
	PurchaseID     uint64         `json:"purchase_id"`
	InventoryID    uint64         `json:"inventory_id"`
	Relationships  Relationships  `gorm:"foreignKey:RelationshipID" json:"relationships"`
	Purchases      Purchases      `gorm:"foreignKey:PurchaseID" json:"purchases"`
	Inventory      Inventory      `gorm:"foreignKey:InventoryID" json:"inventory"`
}

func (Sales) TableName() string {
	return "eb_sales"
}

type SalesReturns struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	ID      uint64         `gorm:"primaryKey" json:"id"`
	Date    datatypes.Date `json:"date"`
	SalesID uint64         `json:"sales_id"`
	Sales   Sales          `gorm:"foreignKey:SalesID" json:"sales"`
}

func (SalesReturns) TableName() string {
	return "eb_sales_returns"
}

type Purchases struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	ID             uint64         `gorm:"primaryKey" json:"id"`
	CompanyName    string         `json:"company_name"`
	VehicleName    string         `json:"vehicle_name"`
	Price          float64        `sql:"type:decimal(8,2);" json:"price"`
	Date           datatypes.Date `json:"date"`
	RelationshipID uint64         `json:"relationship_id"`
	Relationships  Relationships  `gorm:"foreignKey:RelationshipID" json:"relationships"`
}

func (Purchases) TableName() string {
	return "eb_purchases"
}

type Inventory struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	ID         uint64         `gorm:"primaryKey" json:"id"`
	PartName   string         `json:"part_name"`
	Quantity   uint32         `json:"quantity"`
	PurchaseID uint64         `json:"purchase_id"`
	Date       datatypes.Date `json:"date"`
	Purchases  Purchases      `gorm:"foreignKey:PurchaseID" json:"purchases"`
}

func (Inventory) TableName() string {
	return "eb_inventory"
}

type Relationships struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	ID          uint64 `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	PhoneNumber string `gorm:"unique_index" json:"phone_number"`
	Address     string `json:"address"`
}

func (Relationships) TableName() string {
	return "eb_relationships"
}

type Miscellaneous struct {
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	ID          uint64         `gorm:"primaryKey" json:"id"`
	Description string         `json:"description"`
	Price       float64        `sql:"type:decimal(8,2);" json:"price"`
	Date        datatypes.Date `json:"date"`
}

func (Miscellaneous) TableName() string {
	return "eb_miscellaneous"
}
