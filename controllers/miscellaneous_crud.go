package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm/clause"
)

// CreateOrUpdateMiscellaneous creates or updates an entity in the `eb_miscellaneous`
// table.
func CreateOrUpdateMiscellaneous(c *gin.Context) {
	// Read and parse request body.
	var entity models.Miscellaneous
	err := parseRequestBody(c, &entity)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	// Create or update entity in table.
	err = pgClient.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "id"}},
		UpdateAll: true,
	}).Create(&entity).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	} else {
		pgClient.First(&entity)
		successResponse(c, http.StatusOK, "", &entity)
	}
}

// ReadMiscellaneous returns a paginated list of results from the `eb_miscellaneous`
// table.
func ReadMiscellaneous(c *gin.Context) {
	pagination := parsePaginationRequest(c)

	var records []models.Miscellaneous
	offset := (pagination.Page - 1) * pagination.PageLimit
	queryBuilder := pgClient.DB.Limit(
		int(pagination.PageLimit),
	).Offset(
		int(offset),
	).Order(
		fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
	)
	result := queryBuilder.Model(&models.Miscellaneous{}).Find(&records)

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	} else {
		successResponse(c, http.StatusOK, "", map[string]interface{}{
			"page":    pagination.Page,
			"records": records,
		})
	}
}

// DeleteMiscellaneous deletes an entity from the `eb_miscellaneous` table.
func DeleteMiscellaneous(c *gin.Context) {
	// Read and parse request body.
	var entity models.Miscellaneous
	err := parseRequestBody(c, &entity)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	err = pgClient.Where("id = ?", entity.ID).Delete(&entity).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	} else {
		successResponse(c, http.StatusOK, "Deleted record.", entity)
	}
}
