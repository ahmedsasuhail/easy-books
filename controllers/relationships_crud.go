package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// CreateOrUpdateRelationships creates or updates a record in the `eb_relationships`
// table.
func CreateOrUpdateRelationships(c *gin.Context) {
	// Read and parse request body.
	var record models.Relationships
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
		successResponse(c, http.StatusOK, "", &record)
	}
}

// ReadRelationships returns a paginated list of results from the `eb_relationships`
// table.
func ReadRelationships(c *gin.Context) {
	pagination := parsePaginationRequest(c)

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

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":    pagination.Page,
		"records": records,
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
		successResponse(c, http.StatusOK, "Deleted record.", record)
	}
}
