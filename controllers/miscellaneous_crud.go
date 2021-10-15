package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// CreateOrUpdateMiscellaneous creates or updates a record in the `eb_miscellaneous`
// table.
func CreateOrUpdateMiscellaneous(c *gin.Context) {
	// Read and parse request body.
	var record models.Miscellaneous
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
		pgClient.First(&record)
		successResponse(c, http.StatusOK, "", map[string]interface{}{
			"id":          record.ID,
			"description": record.Description,
			"price":       record.Price,
			"date":        record.Date,
		})
	}
}

// ReadMiscellaneous returns a paginated list of results from the `eb_miscellaneous`
// table.
func ReadMiscellaneous(c *gin.Context) {
	pagination := parsePaginationRequest(c)

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
		"page":    pagination.Page,
		"records": filteredRecords,
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
