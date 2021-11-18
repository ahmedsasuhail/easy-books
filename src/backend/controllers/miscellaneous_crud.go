package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"github.com/meilisearch/meilisearch-go"
	"gorm.io/gorm"
)

// Meilisearch index.
var miscellaneousIndex = msClient.Index(models.MiscellaneousTableName)

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
	filteredRecord := map[string]interface{}{
		"id":          record.ID,
		"description": record.Description,
		"price":       record.Price,
		"date":        record.Date,
	}

	_, err = miscellaneousIndex.AddDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
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

	// Update record in table and update Meilisearch index.
	err = pgClient.Model(&record).Updates(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.First(&record)
	filteredRecord := map[string]interface{}{
		"id":          record.ID,
		"description": record.Description,
		"price":       record.Price,
		"date":        record.Date,
	}

	_, err = miscellaneousIndex.UpdateDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
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
		"page":                pagination.Page,
		"page_limit":          pagination.PageLimit,
		"order_by":            pagination.OrderBy,
		"sort_order":          pagination.SortOrder,
		"total_count":         pgClient.Find(&records).RowsAffected,
		"records":             filteredRecords,
		"total_matched_count": len(filteredRecords),
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
	}

	filteredRecord := map[string]interface{}{
		"id":          record.ID,
		"description": record.Description,
		"price":       record.Price,
		"date":        record.Date,
	}

	_, err = miscellaneousIndex.DeleteDocument(fmt.Sprint(record.ID))
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "Deleted record.", filteredRecord)
}

// SearchMiscellaneous returns a paginated list of records based on a specified
// search term.
func SearchMiscellaneous(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var searchRequest models.SearchRequest
	err = parseRequestBody(c, &searchRequest)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	offset := (pagination.Page - 1) * pagination.PageLimit

	searchRes, err := miscellaneousIndex.Search(
		searchRequest.SearchTerm,
		&meilisearch.SearchRequest{
			Limit:  int64(pagination.PageLimit),
			Offset: int64(offset),
			Sort: []string{
				fmt.Sprintf("%s:%s", pagination.OrderBy, pagination.SortOrder),
			},
		},
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	stats, err := miscellaneousIndex.GetStats()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":                pagination.Page,
		"page_limit":          pagination.PageLimit,
		"order_by":            pagination.OrderBy,
		"sort_order":          pagination.SortOrder,
		"total_count":         stats.NumberOfDocuments,
		"records":             searchRes.Hits,
		"total_matched_count": len(searchRes.Hits),
	})
}
