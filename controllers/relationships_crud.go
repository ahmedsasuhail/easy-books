package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateRelationships creates a record in the `eb_relationships` table.
func CreateRelationships(c *gin.Context) {
	// Read and parse request body.
	var record models.Relationships
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
		"id":           record.ID,
		"name":         record.Name,
		"phone_number": record.PhoneNumber,
		"address":      record.Address,
	})
}

// UpdateRelationships updates a record in the `eb_relationships` table.
func UpdateRelationships(c *gin.Context) {
	// Read and parse request body.
	var record models.Relationships
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

	pgClient.First(&record)
	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":           record.ID,
		"name":         record.Name,
		"phone_number": record.PhoneNumber,
		"address":      record.Address,
	})
}

// ReadRelationships returns a paginated list of results from the `eb_relationships`
// table.
func ReadRelationships(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Relationships
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
		result = queryBuilder.Model(&models.Relationships{}).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":           record.ID,
			"name":         record.Name,
			"phone_number": record.PhoneNumber,
			"address":      record.Address,
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

// DeleteRelationships deletes a record from the `eb_relationships` table.
func DeleteRelationships(c *gin.Context) {
	// Read and parse request body.
	var record models.Relationships
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
			"name":         record.Name,
			"phone_number": record.PhoneNumber,
			"address":      record.Address,
		})
	}
}
