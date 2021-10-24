package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// CreateOrUpdateSalesReturns creates or updates a record in the `eb_sales_returns`
// table.
func CreateOrUpdateSalesReturns(c *gin.Context) {
	// Read and parse request body.
	var record models.SalesReturns
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
		pgClient.Preload("Sales").First(&record)
		successResponse(c, http.StatusOK, "", &record)
	}
}

// ReadSalesReturns returns a paginated list of results from the `eb_sales_returns`
// table.
func ReadSalesReturns(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.SalesReturns
	var result *gorm.DB

	if pagination.GetAll {
		result = pgClient.Preload("Sales").Find(&records)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Preload("Sales").Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":        pagination.Page,
		"page_limit":  pagination.PageLimit,
		"order_by":    pagination.OrderBy,
		"sort_order":  pagination.SortOrder,
		"total_count": pgClient.Find(&records).RowsAffected,
		"records":     records,
	})
}

// DeleteSalesReturns deletes a record from the `eb_sales_returns` table.
func DeleteSalesReturns(c *gin.Context) {
	// Read and parse request body.
	var record models.SalesReturns
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
