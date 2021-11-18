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
var salesIndex = msClient.Index(models.SalesTableName)

// CreateSales creates a new record in the `eb_sales` table.
func CreateSales(c *gin.Context) {
	// Read and parse request body.
	var record models.Sales
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
		"Relationships",
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Preload(
		"Inventory",
	).Preload(
		"Inventory.Purchases.Relationships",
	).First(&record)
	filteredRecord := map[string]interface{}{
		"id":       record.ID,
		"price":    record.Price,
		"date":     record.Date,
		"credit":   record.Credit,
		"returned": record.Returned,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
			"price":        record.Purchases.Price,
		},
		"inventory": map[string]interface{}{
			"id":        record.Inventory.ID,
			"part_name": record.Inventory.PartName,
			"quantity":  record.Inventory.Quantity,
		},
	}

	_, err = salesIndex.AddDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
}

// UpdateSales updates a record in the `eb_sales` table.
func UpdateSales(c *gin.Context) {
	// Read and parse request body.
	var record models.Sales
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

	// Dirty fix to toggle boolean fields.
	if !record.Returned {
		err = pgClient.Model(&record).Select("Returned").Updates(
			models.Sales{Returned: false},
		).Error

		if err != nil {
			errorResponse(c, http.StatusInternalServerError, err.Error())

			return
		}
	}

	if !record.Credit {
		err = pgClient.Model(&record).Select("Credit").Updates(
			models.Sales{Credit: false},
		).Error

		if err != nil {
			errorResponse(c, http.StatusInternalServerError, err.Error())

			return
		}
	}

	pgClient.Preload(
		"Relationships",
	).Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Preload(
		"Inventory",
	).Preload(
		"Inventory.Purchases",
	).Preload(
		"Inventory.Purchases.Relationships",
	).First(&record)
	filteredRecord := map[string]interface{}{
		"id":       record.ID,
		"price":    record.Price,
		"date":     record.Date,
		"credit":   record.Credit,
		"returned": record.Returned,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
			"price":        record.Purchases.Price,
		},
		"inventory": map[string]interface{}{
			"id":        record.Inventory.ID,
			"part_name": record.Inventory.PartName,
			"quantity":  record.Inventory.Quantity,
		},
	}

	_, err = salesIndex.UpdateDocumentsWithPrimaryKey(
		filteredRecord,
		"id",
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "", filteredRecord)
}

// ReadSales returns a paginated list of results from the `eb_sales`
// table.
func ReadSales(c *gin.Context) {
	pagination, err := parsePaginationRequest(c)
	if err != nil {
		errorResponse(
			c,
			http.StatusBadRequest,
			err.Error(),
		)

		return
	}

	var records []models.Sales
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
		result = queryBuilder.Preload(
			"Relationships",
		).Preload(
			"Purchases",
		).Preload(
			"Purchases.Relationships",
		).Preload(
			"Inventory",
		).Preload(
			"Inventory.Purchases",
		).Preload(
			"Inventory.Purchases.Relationships",
		).Find(&records)
	}

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredRecords []map[string]interface{}

	for _, record := range records {
		filteredRecords = append(filteredRecords, map[string]interface{}{
			"id":       record.ID,
			"price":    record.Price,
			"date":     record.Date,
			"credit":   record.Credit,
			"returned": record.Returned,
			"relationships": map[string]interface{}{
				"id":   record.Relationships.ID,
				"name": record.Relationships.Name,
			},
			"purchases": map[string]interface{}{
				"id":           record.Purchases.ID,
				"company_name": record.Purchases.CompanyName,
				"vehicle_name": record.Purchases.VehicleName,
				"price":        record.Purchases.Price,
			},
			"inventory": map[string]interface{}{
				"id":        record.Inventory.ID,
				"part_name": record.Inventory.PartName,
				"quantity":  record.Inventory.Quantity,
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

// DeleteSales deletes a record from the `eb_sales` table.
func DeleteSales(c *gin.Context) {
	// Read and parse request body.
	var record models.Sales
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
		"id":       record.ID,
		"price":    record.Price,
		"date":     record.Date,
		"credit":   record.Credit,
		"returned": record.Returned,
		"relationships": map[string]interface{}{
			"id":   record.Relationships.ID,
			"name": record.Relationships.Name,
		},
		"purchases": map[string]interface{}{
			"id":           record.Purchases.ID,
			"company_name": record.Purchases.CompanyName,
			"vehicle_name": record.Purchases.VehicleName,
			"price":        record.Purchases.Price,
		},
		"inventory": map[string]interface{}{
			"id":        record.Inventory.ID,
			"part_name": record.Inventory.PartName,
			"quantity":  record.Inventory.Quantity,
		},
	}

	_, err = salesIndex.DeleteDocument(fmt.Sprint(record.ID))
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	successResponse(c, http.StatusOK, "Deleted record.", filteredRecord)
}

// SearchSales returns a paginated list of records based on a specified
// search term.
func SearchSales(c *gin.Context) {
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

	searchRes, err := salesIndex.Search(
		searchRequest.SearchTerm,
		&meilisearch.SearchRequest{
			Limit:                 int64(pagination.PageLimit),
			Offset:                int64(offset),
			AttributesToHighlight: []string{"*"},
		},
	)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	stats, err := salesIndex.GetStats()
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
