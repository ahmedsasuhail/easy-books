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
	var sales models.Sales
	var purchases models.Purchases
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

	// Update parent records.
	pgClient.Preload(
		"Relationships",
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Preload(
		"Inventory",
	).Preload(
		"Inventory.Purchases.Relationships",
	).First(&sales)
	filteredSales := map[string]interface{}{
		"id":                     sales.ID,
		"price":                  sales.Price,
		"date":                   sales.Date,
		"credit":                 sales.Credit,
		"returned":               sales.Returned,
		"quantity":               sales.Quantity,
		"relationships.name":     sales.Relationships.Name,
		"purchases.company_name": sales.Purchases.CompanyName,
		"purchases.vehicle_name": sales.Purchases.VehicleName,
		"inventory.part_name":    sales.Inventory.PartName,
		"relationships": map[string]interface{}{
			"id":   record.ID,
			"name": record.Name,
		},
		"purchases": map[string]interface{}{
			"id":           sales.Purchases.ID,
			"company_name": sales.Purchases.CompanyName,
			"vehicle_name": sales.Purchases.VehicleName,
			"price":        sales.Purchases.Price,
		},
		"inventory": map[string]interface{}{
			"id":        sales.Inventory.ID,
			"part_name": sales.Inventory.PartName,
			"quantity":  sales.Inventory.Quantity,
			"sold_out":  sales.Inventory.SoldOut,
			"date":      sales.Inventory.Date,
		},
	}

	_, err = salesIndex.UpdateDocuments(filteredSales)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	pgClient.Preload("Relationships").First(&purchases)
	filteredPurchases := map[string]interface{}{
		"id":                 purchases.ID,
		"company_name":       purchases.CompanyName,
		"vehicle_name":       purchases.VehicleName,
		"price":              purchases.Price,
		"date":               purchases.Date,
		"relationships.name": purchases.Relationships.Name,
		"relationships": map[string]interface{}{
			"id":   record.ID,
			"name": record.Name,
		},
	}

	_, err = purchasesIndex.UpdateDocuments(filteredPurchases)
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

	records, err := relationshipsIndex.Search(
		pagination.Query,
		&meilisearch.SearchRequest{
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
		"query":               pagination.Query,
		"total_count":         stats.NumberOfDocuments,
		"records":             records.Hits,
		"total_matched_count": records.NbHits,
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
