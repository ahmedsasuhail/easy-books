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

	_, err = purchasesIndex.AddDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
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

	_, err = purchasesIndex.UpdateDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
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

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":           record.ID,
			"company_name": record.CompanyName,
			"vehicle_name": record.VehicleName,
			"price":        record.Price,
			"date":         record.Date,
			"relationships": map[string]interface{}{
				"id":   record.Relationships.ID,
				"name": record.Relationships.Name,
			},
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

	searchRes, err := purchasesIndex.Search(
		searchRequest.SearchTerm,
		&meilisearch.SearchRequest{
			Limit: int64(searchRequest.Limit),
		},
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":                pagination.Page,
		"page_limit":          pagination.PageLimit,
		"order_by":            pagination.OrderBy,
		"sort_order":          pagination.SortOrder,
		"total_count":         nil, // TODO: implement.
		"records":             searchRes.Hits,
		"total_matched_count": len(searchRes.Hits),
	})
}
