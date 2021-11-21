package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"github.com/meilisearch/meilisearch-go"
)

// Meilisearch index.
var relationshipsIndex = msClient.Index(models.RelationshipsTableName)

// CreateRelationships creates a record in the `eb_relationships` table.
func CreateRelationships(c *gin.Context) {
	// Read and parse request body.
	var record models.Relationships
	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	// Create record in table and add it to Meilisearch index.
	err = pgClient.Create(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.First(&record)
	filteredRecord := map[string]interface{}{
		"id":           record.ID,
		"name":         record.Name,
		"phone_number": record.PhoneNumber,
		"address":      record.Address,
	}

	_, err = relationshipsIndex.AddDocuments(filteredRecord)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
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

	// Update record in table and update Meilisearch index.
	err = pgClient.Model(&record).Updates(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.First(&record)
	filteredRecord := map[string]interface{}{
		"id":           record.ID,
		"name":         record.Name,
		"phone_number": record.PhoneNumber,
		"address":      record.Address,
	}

	_, err = relationshipsIndex.UpdateDocuments(filteredRecord)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
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

	offset := (pagination.Page - 1) * pagination.PageLimit
	stats, err := relationshipsIndex.GetStats()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	records, err := relationshipsIndex.Search("", &meilisearch.SearchRequest{
		Limit:  int64(pagination.PageLimit),
		Offset: int64(offset),
		Sort: []string{
			fmt.Sprintf("%s:%s", pagination.OrderBy, pagination.SortOrder),
		},
	})
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
		"records":             records.Hits,
		"total_matched_count": len(records.Hits),
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
	}
	filteredRecord := map[string]interface{}{
		"id":           record.ID,
		"name":         record.Name,
		"phone_number": record.PhoneNumber,
		"address":      record.Address,
	}

	_, err = relationshipsIndex.DeleteDocument(fmt.Sprint(record.ID))
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "Deleted record.", filteredRecord)
}

// SearchRelationships returns a paginated list of records based on a specified
// search term.
func SearchRelationships(c *gin.Context) {
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

	searchRes, err := relationshipsIndex.Search(
		searchRequest.SearchTerm,
		&meilisearch.SearchRequest{
			Limit:                 int64(pagination.PageLimit),
			Offset:                int64(offset),
			AttributesToHighlight: []string{"*"},
			Sort: []string{
				fmt.Sprintf("%s:%s", pagination.OrderBy, pagination.SortOrder),
			},
		},
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	stats, err := relationshipsIndex.GetStats()
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
