package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateMiscellaneous creates a record in the `eb_miscellaneous` table.
func CreateMiscellaneous(c *gin.Context) {
	// Read and parse request body.
	var record models.Miscellaneous
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

	pgClient.First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":          record.ID,
		"description": record.Description,
		"price":       record.Price,
		"date":        record.Date,
	})
}

// UpdateMiscellaneous creates or updates a record in the `eb_miscellaneous`
// table.
func UpdateMiscellaneous(c *gin.Context) {
	// Read and parse request body.
	var record models.Miscellaneous
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

	pgClient.First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":          record.ID,
		"description": record.Description,
		"price":       record.Price,
		"date":        record.Date,
	})
}

// ReadMiscellaneous returns a paginated list of results from the `eb_miscellaneous`
// table.
func ReadMiscellaneous(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Miscellaneous
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
		result = queryBuilder.Model(&models.Miscellaneous{}).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":          record.ID,
			"description": record.Description,
			"price":       record.Price,
			"date":        record.Date,
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

// DeleteMiscellaneous deletes a record from the `eb_miscellaneous` table.
func DeleteMiscellaneous(c *gin.Context) {
	// Read and parse request body.
	var record models.Miscellaneous
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
			"id":          record.ID,
			"description": record.Description,
			"price":       record.Price,
			"date":        record.Date,
		})
	}
}
