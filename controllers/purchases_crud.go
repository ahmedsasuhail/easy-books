package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// CreateOrUpdatePurchases creates or updates a record in the `eb_purchases`
// table.
func CreateOrUpdatePurchases(c *gin.Context) {
	// Read and parse request body.
	var record models.Purchases
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
		pgClient.Preload("Relationships").First(&record)
		successResponse(c, http.StatusOK, "", &record)
	}
}

// ReadPurchases returns a paginated list of results from the `eb_purchases`
// table.
func ReadPurchases(c *gin.Context) {
	pagination := parsePaginationRequest(c)

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

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":    pagination.Page,
		"records": records,
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
		successResponse(c, http.StatusOK, "Deleted record.", record)
	}
}
