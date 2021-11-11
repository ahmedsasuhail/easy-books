package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreatePurchases creates a record in the `eb_purchases` table.
func CreatePurchases(c *gin.Context) {
	// Read and parse request body.
	var record models.Purchases
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

	pgClient.Preload("Relationships").First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":           record.ID,
		"company_name": record.CompanyName,
		"vehicle_name": record.VehicleName,
		"price":        record.Price,
		"date":         record.Date,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
	})
}

// UpdatePurchases updates a record in the `eb_purchases` table.
func UpdatePurchases(c *gin.Context) {
	// Read and parse request body.
	var record models.Purchases
	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	// Update record in table.
	err = pgClient.Model(&record).Updates(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.Preload("Relationships").First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":           record.ID,
		"company_name": record.CompanyName,
		"vehicle_name": record.VehicleName,
		"price":        record.Price,
		"date":         record.Date,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
	})
}

// ReadPurchases returns a paginated list of results from the `eb_purchases`
// table.
func ReadPurchases(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Purchases
	var result *gorm.DB

	if pagination.GetAll {
		result = pgClient.Preload("Relationships").Find(&records)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Preload("Relationships").Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":           record.ID,
			"company_name": record.CompanyName,
			"vehicle_name": record.VehicleName,
			"price":        record.Price,
			"date":         record.Date,
			"relationships": map[string]interface{}{
				"id":   record.Relationships.ID,
				"name": record.Relationships.Name,
			},
		})
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":                pagination.Page,
		"page_limit":          pagination.PageLimit,
		"order_by":            pagination.OrderBy,
		"sort_order":          pagination.SortOrder,
		"total_count":         pgClient.Find(&records).RowsAffected,
		"records":             filteredRecords,
		"total_matched_count": len(filteredRecords),
	})
}

// DeletePurchases deletes a record from the `eb_purchases` table.
func DeletePurchases(c *gin.Context) {
	// Read and parse request body.
	var record models.Purchases
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
			"id":           record.ID,
			"company_name": record.CompanyName,
			"vehicle_name": record.VehicleName,
			"price":        record.Price,
			"date":         record.Date,
			"relationships": map[string]interface{}{
				"id":   record.Relationships.ID,
				"name": record.Relationships.Name,
			},
		})
	}
}
