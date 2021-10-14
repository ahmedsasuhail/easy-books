package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// CreateOrUpdateInventory creates or updates a record in the `eb_inventory`
// table.
func CreateOrUpdateInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	// Create or update record in table.
	err = pgClient.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		UpdateAll: true,
	}).Create(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	} else {
		pgClient.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).First(&record)
		successResponse(c, http.StatusOK, "", &record)
	}
}

// ReadInventory returns a paginated list of results from the `eb_inventory`
// table.
func ReadInventory(c *gin.Context) {
	pagination := parsePaginationRequest(c)

	var records []models.Inventory
	var result *gorm.DB

	if pagination.GetAll {
		result = pgClient.Find(&records)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":    pagination.Page,
		"records": records,
	})
}

// DeleteInventory deletes a record from the `eb_inventory` table.
func DeleteInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	err = pgClient.Where("id = ?", record.ID).Delete(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	} else {
		successResponse(c, http.StatusOK, "Deleted record.", record)
	}
}

// GetInventoryFromPurchaseID retrieves a list of inventory records matching a
// specified purchase ID.
func GetInventoryFromPurchaseID(c *gin.Context) {
	pagination := parsePaginationRequest(c)

	var record models.Inventory
	var records []models.Inventory
	var result *gorm.DB

	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	if pagination.GetAll {
		result = pgClient.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Find(&records).Where("? = Purchases.ID", record.PurchaseID)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Find(&records).Where("? = Purchases.ID", record.PurchaseID)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":    pagination.Page,
		"records": records,
	})
}
