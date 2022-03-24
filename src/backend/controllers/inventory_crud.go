package controllers

import (
	"fmt"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"github.com/meilisearch/meilisearch-go"
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
		"id":                     record.ID,
		"part_name":              record.PartName,
		"quantity":               record.Quantity,
		"date":                   record.Date,
		"purchase_id":            record.PurchaseID,
		"purchases.company_name": record.Purchases.CompanyName,
		"purchases.vehicle_name": record.Purchases.VehicleName,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	}

	_, err = inventoryIndex.AddDocuments(filteredRecord)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	// Remove unnecessary keys from response.
	delete(filteredRecord, "purchase_id")
	delete(filteredRecord, "purchases.company_name")
	delete(filteredRecord, "purchases.vehicle_name")

	successResponse(c, http.StatusOK, "", filteredRecord)
}

// UpdateInventory updates a record in the `eb_inventory` table.
func UpdateInventory(c *gin.Context) {
	// Read and parse request body.
	var record models.Inventory
	var sales []models.Sales
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
		"id":                     record.ID,
		"part_name":              record.PartName,
		"quantity":               record.Quantity,
		"date":                   record.Date,
		"purchase_id":            record.PurchaseID,
		"purchases.company_name": record.Purchases.CompanyName,
		"purchases.vehicle_name": record.Purchases.VehicleName,
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
		},
	}

	_, err = inventoryIndex.UpdateDocuments(filteredRecord)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	// Update parent records.
	pgClient.Where(
		"inventory_id = ?",
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
			"purchases.company_name": sale.Purchases.CompanyName,
			"purchases.vehicle_name": sale.Purchases.VehicleName,
			"inventory.part_name":    record.PartName,
			"relationships": map[string]interface{}{
				"id":   sale.Relationships.ID,
				"name": sale.Relationships.Name,
			},
			"purchases": map[string]interface{}{
				"id":           sale.Purchases.ID,
				"company_name": sale.Purchases.CompanyName,
				"vehicle_name": sale.Purchases.VehicleName,
				"price":        sale.Purchases.Price,
			},
			"inventory": map[string]interface{}{
				"id":        record.ID,
				"part_name": record.PartName,
				"quantity":  record.Quantity,
				"sold_out":  record.SoldOut,
				"date":      record.Date,
			},
		}

		_, err = salesIndex.UpdateDocuments(filteredSales)
		if err != nil {
			errorResponse(c, http.StatusInternalServerError, err.Error())

			return
		}
	}

	// Remove unnecessary keys from response.
	delete(filteredRecord, "purchase_id")
	delete(filteredRecord, "purchases.company_name")
	delete(filteredRecord, "purchases.vehicle_name")

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

	offset := (pagination.Page - 1) * pagination.PageLimit
	stats, err := inventoryIndex.GetStats()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	records, err := inventoryIndex.Search(
		pagination.Query,
		&meilisearch.SearchRequest{
			Limit:  int64(pagination.PageLimit),
			Offset: int64(offset),
			Sort: []string{
				fmt.Sprintf("%s:%s", pagination.OrderBy, pagination.SortOrder),
			},
			AttributesToRetrieve: []string{
				"id",
				"part_name",
				"quantity",
				"date",
				"purchases",
				"sold_out",
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
		"id":          record.ID,
		"part_name":   record.PartName,
		"quantity":    record.Quantity,
		"date":        record.Date,
		"purchase_id": record.PurchaseID,
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

	err = parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	offset := (pagination.Page - 1) * pagination.PageLimit
	stats, err := inventoryIndex.GetStats()
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	records, err := inventoryIndex.Search(
		pagination.Query,
		&meilisearch.SearchRequest{
			Limit:  int64(pagination.PageLimit),
			Offset: int64(offset),
			Sort: []string{
				fmt.Sprintf("%s:%s", pagination.OrderBy, pagination.SortOrder),
			},
			AttributesToRetrieve: []string{
				"id",
				"part_name",
				"quantity",
				"date",
				"purchases",
				"sold_out",
			},
			Filter: []string{
				fmt.Sprintf("purchase_id = \"%d\"", record.PurchaseID),
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
