package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateInventory creates a new record in the `eb_inventory` table.
func CreateInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	// Create record in table.
	err = pgClient.Create(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":        record.ID,
		"part_name": record.PartName,
		"quantity":  record.Quantity,
		"date":      record.Date,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	})
}

// UpdateInventory updates a record in the `eb_inventory` table.
func UpdateInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	// Create or update record in table.
	err = pgClient.Model(&record).Updates(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":        record.ID,
		"part_name": record.PartName,
		"quantity":  record.Quantity,
		"date":      record.Date,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	})
}

// ReadInventory returns a paginated list of results from the `eb_inventory`
// table.
func ReadInventory(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Inventory
	var result *gorm.DB

	if pagination.GetAll {
		result = pgClient.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Find(&records)
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

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":        record.ID,
			"part_name": record.PartName,
			"quantity":  record.Quantity,
			"date":      record.Date,
			"purchases": map[string]interface{}{
				"id":           record.Purchases.ID,
				"company_name": record.Purchases.CompanyName,
				"vehicle_name": record.Purchases.VehicleName,
			},
		})
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":        pagination.Page,
		"page_limit":  pagination.PageLimit,
		"order_by":    pagination.OrderBy,
		"sort_order":  pagination.SortOrder,
		"total_count": pgClient.Find(&records).RowsAffected,
		"records":     filteredRecords,
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
		successResponse(c, http.StatusOK, "Deleted record.", map[string]interface{}{
			"id":        record.ID,
			"part_name": record.PartName,
			"quantity":  record.Quantity,
			"date":      record.Date,
			"purchases": map[string]interface{}{
				"id":           record.Purchases.ID,
				"company_name": record.Purchases.CompanyName,
				"vehicle_name": record.Purchases.VehicleName,
			},
		})
	}
}

// GetInventoryFromPurchaseID retrieves a list of inventory records matching a
// specified purchase ID.
func GetInventoryFromPurchaseID(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var record models.Inventory
	var records []models.Inventory
	var result *gorm.DB

	err = parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	if pagination.GetAll {
		result = pgClient.Where(
			"purchase_id = ?",
			record.PurchaseID,
		).Find(&records)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Where(
			"purchase_id = ?",
			record.PurchaseID,
		).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":        record.ID,
			"part_name": record.PartName,
			"quantity":  record.Quantity,
		})
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":       pagination.Page,
		"page_limit": pagination.PageLimit,
		"order_by":   pagination.OrderBy,
		"sort_order": pagination.SortOrder,
		"records":    filteredRecords,
	})
}
