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
		"id":                 record.ID,
		"company_name":       record.CompanyName,
		"vehicle_name":       record.VehicleName,
		"price":              record.Price,
		"date":               record.Date,
		"relationships.name": record.Relationships.Name,
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

	// Remove unnecessary keys from response.
	delete(filteredRecord, "relationships.name")

	successResponse(c, http.StatusOK, "", filteredRecord)
}

// UpdatePurchases updates a record in the `eb_purchases` table.
func UpdatePurchases(c *gin.Context) {
	// Read and parse request body.
	var record models.Purchases
	var sales []models.Sales
	var inventory []models.Inventory
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
		"id":                 record.ID,
		"company_name":       record.CompanyName,
		"vehicle_name":       record.VehicleName,
		"price":              record.Price,
		"date":               record.Date,
		"relationships.name": record.Relationships.Name,
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

	// Update parent records.
	pgClient.Where(
		"purchase_id = ?",
		record.ID,
	).Preload(
		"Relationships",
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Preload(
		"Inventory",
	).Preload(
		"Inventory.Purchases.Relationships",
	).Find(&sales)
	for _, sale := range sales {
		filteredSales := map[string]interface{}{
			"id":                     sale.ID,
			"price":                  sale.Price,
			"date":                   sale.Date,
			"credit":                 sale.Credit,
			"returned":               sale.Returned,
			"quantity":               sale.Quantity,
			"relationships.name":     sale.Relationships.Name,
			"purchases.company_name": record.CompanyName,
			"purchases.vehicle_name": record.VehicleName,
			"inventory.part_name":    sale.Inventory.PartName,
			"relationships": map[string]interface{}{
				"id":   sale.Relationships.ID,
				"name": sale.Relationships.Name,
			},
			"purchases": map[string]interface{}{
				"id":           record.ID,
				"company_name": record.CompanyName,
				"vehicle_name": record.VehicleName,
				"price":        record.Price,
			},
			"inventory": map[string]interface{}{
				"id":        sale.Inventory.ID,
				"part_name": sale.Inventory.PartName,
				"quantity":  sale.Inventory.Quantity,
				"sold_out":  sale.Inventory.SoldOut,
				"date":      sale.Inventory.Date,
			},
		}

		_, err = salesIndex.UpdateDocuments(filteredSales)
		if err != nil {
			errorResponse(c, http.StatusInternalServerError, err.Error())

			return
		}
	}

	pgClient.Where(
		"purchase_id = ?",
		record.ID,
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Find(&inventory)
	for _, inv := range inventory {
		filteredInventory := map[string]interface{}{
			"id":                     inv.ID,
			"part_name":              inv.PartName,
			"quantity":               inv.Quantity,
			"date":                   inv.Date,
			"purchase_id":            record.ID,
			"purchases.company_name": record.CompanyName,
			"purchases.vehicle_name": record.VehicleName,
			"purchases": map[string]interface{}{
				"id":           record.ID,
				"company_name": record.CompanyName,
				"vehicle_name": record.VehicleName,
			},
		}

		_, err = inventoryIndex.AddDocuments(filteredInventory)
		if err != nil {
			errorResponse(c, http.StatusInternalServerError, err.Error())

			return
		}
	}

	// Remove unnecessary keys from response.
	delete(filteredRecord, "relationships.name")

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

	records, err := purchasesIndex.Search(
		pagination.Query,
		&meilisearch.SearchRequest{
			Limit:  int64(pagination.PageLimit),
			Offset: int64(offset),
			Sort: []string{
				fmt.Sprintf("%s:%s", pagination.OrderBy, pagination.SortOrder),
			},
			AttributesToRetrieve: []string{
				"id",
				"company_name",
				"vehicle_name",
				"price",
				"date",
				"relationships",
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
