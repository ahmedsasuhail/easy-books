package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateSales creates a new record in the `eb_sales` table.
func CreateSales(c *gin.Context) {
	// Read and parse request body.
	var record models.Sales
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
		"Relationships",
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Preload(
		"Inventory",
	).Preload(
		"Inventory.Purchases.Relationships",
	).First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":       record.ID,
		"price":    record.Price,
		"date":     record.Date,
		"returned": record.Returned,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
			"price":        record.Purchases.Price,
		},
		"inventory": map[string]interface{}{
			"id":        record.Inventory.ID,
			"part_name": record.Inventory.PartName,
			"quantity":  record.Inventory.Quantity,
		},
	})
}

// UpdateSales updates a record in the `eb_sales` table.
func UpdateSales(c *gin.Context) {
	// Read and parse request body.
	var record models.Sales
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
		"Relationships",
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Preload(
		"Inventory",
	).Preload(
		"Inventory.Purchases",
	).Preload(
		"Inventory.Purchases.Relationships",
	).First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":       record.ID,
		"price":    record.Price,
		"date":     record.Date,
		"returned": record.Returned,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
			"price":        record.Purchases.Price,
		},
		"inventory": map[string]interface{}{
			"id":        record.Inventory.ID,
			"part_name": record.Inventory.PartName,
			"quantity":  record.Inventory.Quantity,
		},
	})
}

// ReadSales returns a paginated list of results from the `eb_sales`
// table.
func ReadSales(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Sales
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
			"Relationships",
		).Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Preload(
			"Inventory",
		).Preload(
			"Inventory.Purchases",
		).Preload(
			"Inventory.Purchases.Relationships",
		).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":       record.ID,
			"price":    record.Price,
			"date":     record.Date,
			"returned": record.Returned,
			"relationships": map[string]interface{}{
				"id":   record.Relationships.ID,
				"name": record.Relationships.Name,
			},
			"purchases": map[string]interface{}{
				"id":           record.Purchases.ID,
				"company_name": record.Purchases.CompanyName,
				"vehicle_name": record.Purchases.VehicleName,
				"price":        record.Purchases.Price,
			},
			"inventory": map[string]interface{}{
				"id":        record.Inventory.ID,
				"part_name": record.Inventory.PartName,
				"quantity":  record.Inventory.Quantity,
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

// DeleteSales deletes a record from the `eb_sales` table.
func DeleteSales(c *gin.Context) {
	// Read and parse request body.
	var record models.Sales
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
			"id":    record.ID,
			"price": record.Price,
			"date":  record.Date,
			"relationships": map[string]interface{}{
				"id":   record.Relationships.ID,
				"name": record.Relationships.Name,
			},
			"purchases": map[string]interface{}{
				"id":           record.Purchases.ID,
				"company_name": record.Purchases.CompanyName,
				"vehicle_name": record.Purchases.VehicleName,
				"price":        record.Purchases.Price,
			},
			"inventory": map[string]interface{}{
				"id":        record.Inventory.ID,
				"part_name": record.Inventory.PartName,
				"quantity":  record.Inventory.Quantity,
			},
		})
	}
}
