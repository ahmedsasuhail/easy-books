package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"github.com/meilisearch/meilisearch-go"
)

// Meilisearch index.
var purchasesIndex = msClient.Index(models.PurchasesTableName)

// CreatePurchases creates a record in the `eb_purchases` table.
func CreatePurchases(c *gin.Context) {
	// Read and parse request body.
	var record models.Purchases
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

	pgClient.Preload("Relationships").First(&record)
	filteredRecord := map[string]interface{}{
		"id":           record.ID,
		"company_name": record.CompanyName,
		"vehicle_name": record.VehicleName,
		"price":        record.Price,
		"date":         record.Date,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
	}

	_, err = purchasesIndex.AddDocuments(filteredRecord)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
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

	// Update record in table and update Meilisearch index.
	err = pgClient.Model(&record).Updates(&record).Error
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.Preload("Relationships").First(&record)
	filteredRecord := map[string]interface{}{
		"id":           record.ID,
		"company_name": record.CompanyName,
		"vehicle_name": record.VehicleName,
		"price":        record.Price,
		"date":         record.Date,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
	}

	_, err = purchasesIndex.UpdateDocuments(filteredRecord)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
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

	offset := (pagination.Page - 1) * pagination.PageLimit
	stats, err := purchasesIndex.GetStats()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	records, err := purchasesIndex.Search("", &meilisearch.SearchRequest{
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
	}

	filteredRecord := map[string]interface{}{
		"id":           record.ID,
		"company_name": record.CompanyName,
		"vehicle_name": record.VehicleName,
		"price":        record.Price,
		"date":         record.Date,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
	}

	_, err = purchasesIndex.DeleteDocument(fmt.Sprint(record.ID))
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "Deleted record.", filteredRecord)
}

// SearchPurchases returns a paginated list of records based on a specified
// search term.
func SearchPurchases(c *gin.Context) {
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

	searchRes, err := purchasesIndex.Search(
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

	stats, err := purchasesIndex.GetStats()
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
