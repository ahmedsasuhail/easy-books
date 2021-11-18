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
var inventoryIndex = msClient.Index(models.InventoryTableName)

// CreateInventory creates a new record in the `eb_inventory` table.
func CreateInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
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

	pgClient.Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).First(&record)
	filteredRecord := map[string]interface{}{
		"id":        record.ID,
		"part_name": record.PartName,
		"quantity":  record.Quantity,
		"date":      record.Date,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	}

	_, err = inventoryIndex.AddDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
}

// UpdateInventory updates a record in the `eb_inventory` table.
func UpdateInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
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

	pgClient.Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).First(&record)
	filteredRecord := map[string]interface{}{
		"id":        record.ID,
		"part_name": record.PartName,
		"quantity":  record.Quantity,
		"date":      record.Date,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	}

	_, err = inventoryIndex.UpdateDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
}

// ReadInventory returns a paginated list of results from the `eb_inventory`
// table.
func ReadInventory(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Inventory
	var result *gorm.DB

	if pagination.GetAll {
		result = pgClient.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Find(&records)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":        record.ID,
			"part_name": record.PartName,
			"quantity":  record.Quantity,
			"date":      record.Date,
			"purchases": map[string]interface{}{
				"id":           record.Purchases.ID,
				"company_name": record.Purchases.CompanyName,
				"vehicle_name": record.Purchases.VehicleName,
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

// DeleteInventory deletes a record from the `eb_inventory` table.
func DeleteInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
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
		"id":        record.ID,
		"part_name": record.PartName,
		"quantity":  record.Quantity,
		"date":      record.Date,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	}

	_, err = inventoryIndex.DeleteDocument(fmt.Sprint(record.ID))
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "Deleted record.", filteredRecord)
}

// GetInventoryByPurchaseID retrieves a list of inventory records matching a
// specified purchase ID.
func GetInventoryByPurchaseID(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var record models.Inventory
	var records []models.Inventory
	var result *gorm.DB

	err = parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	if pagination.GetAll {
		result = pgClient.Where(
			"purchase_id = ?",
			record.PurchaseID,
		).Find(&records)
	} else {
		offset := (pagination.Page - 1) * pagination.PageLimit
		queryBuilder := pgClient.DB.Limit(
			int(pagination.PageLimit),
		).Offset(
			int(offset),
		).Order(
			fmt.Sprintf("%s %s", pagination.OrderBy, pagination.SortOrder),
		)
		result = queryBuilder.Where(
			"purchase_id = ?",
			record.PurchaseID,
		).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":        record.ID,
			"part_name": record.PartName,
			"quantity":  record.Quantity,
			"date":      record.Date,
		})
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"page":        pagination.Page,
		"page_limit":  pagination.PageLimit,
		"order_by":    pagination.OrderBy,
		"sort_order":  pagination.SortOrder,
		"total_count": pgClient.Find(&records).RowsAffected,
		"records":     filteredRecords,
		"total_matched_count": pgClient.Where(
			"purchase_id = ?",
			record.PurchaseID,
		).Find(&records).RowsAffected,
	})
}

// SearchInventory returns a paginated list of records based on a specified
// search term.
func SearchInventory(c *gin.Context) {
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

	searchRes, err := inventoryIndex.Search(
		searchRequest.SearchTerm,
		&meilisearch.SearchRequest{
			Limit: int64(searchRequest.Limit),
		},
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	stats, err := inventoryIndex.GetStats()
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
