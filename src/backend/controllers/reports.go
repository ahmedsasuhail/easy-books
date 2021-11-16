package controllers

import (
	"net/http"
	"strings"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ReportByPurchaseID retrieves a list of sales records matching a specified
// purchase ID.
func ReportByPurchaseID(c *gin.Context) {
	var record models.Sales
	var records []models.Sales
	var result *gorm.DB
	var totalSales float64
	var totalReturned float64
	var totalCredit float64

	err := parseRequestBody(c, &record)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	result = pgClient.Where(
		"purchase_id = ?",
		record.PurchaseID,
	).Preload(
		"Purchases",
	).Preload(
		"Inventory",
	).First(&record)

	if result.Error != nil {
		successResponse(c, http.StatusOK, "", map[string]interface{}{
			"id":                   record.Purchases.ID,
			"company_name":         record.Purchases.CompanyName,
			"vehicle_name":         record.Purchases.VehicleName,
			"price":                record.Purchases.Price,
			"sales":                nil,
			"sales_returned":       nil,
			"sales_total":          nil,
			"sales_returned_total": nil,
			"credited_sales_total": nil,
			"total":                nil,
		})

		return
	}

	result = pgClient.Where(
		"purchase_id = ?",
		record.PurchaseID,
	).Preload(
		"Purchases",
	).Preload(
		"Inventory",
	).Find(&records)

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var sales []map[string]interface{}
	var returned []map[string]interface{}
	var credit []map[string]interface{}

	for _, record := range records {
		if record.Returned {
			totalReturned += record.Price

			returned = append(returned, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"returned":  record.Returned,
				"part_name": record.Inventory.PartName,
				"credit":    record.Credit,
			})
		} else if record.Credit {
			totalCredit += record.Price

			credit = append(credit, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"credit":    record.Credit,
				"returned":  record.Returned,
				"part_name": record.Inventory.PartName,
			})
		} else {
			totalSales += record.Price

			sales = append(sales, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"credit":    record.Credit,
				"returned":  record.Returned,
				"part_name": record.Inventory.PartName,
			})
		}
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":                   record.Purchases.ID,
		"company_name":         record.Purchases.CompanyName,
		"vehicle_name":         record.Purchases.VehicleName,
		"price":                record.Purchases.Price,
		"sales":                sales,
		"credited_sales":       credit,
		"sales_returned":       returned,
		"sales_total":          totalSales,
		"credited_sales_total": totalCredit,
		"sales_returned_total": totalReturned,
		"total":                totalSales - record.Purchases.Price,
	})
}

// ReportByRelationshipID retrieves a list of purchase and sales records matching
// a specified relationship ID.
func ReportByRelationshipID(c *gin.Context) {
	type reportRequest struct {
		RelationshipID uint64 `json:"relationship_id"`
		DateRange      string `json:"date_range"`
	}

	var purchases []models.Purchases
	var sales []models.Sales
	var request reportRequest
	var relationship models.Relationships
	var result *gorm.DB
	var totalSales float64
	var totalPurchased float64
	var totalReturned float64
	var totalCredit float64

	err := parseRequestBody(c, &request)
	if err != nil {
		errorResponse(c, http.StatusBadRequest, err.Error())

		return
	}

	result = pgClient.Where(
		"id = ?",
		request.RelationshipID,
	).Find(&relationship)

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	dateRange := strings.Split(request.DateRange, "|")
	if len(dateRange) != 2 {
		errorResponse(
			c,
			http.StatusBadRequest,
			"Please specify a date range.",
		)

		return
	}

	result = pgClient.Where(
		"relationship_id = ? AND date BETWEEN ? AND ?",
		relationship.ID,
		dateRange[0],
		dateRange[1],
	).Find(&purchases)

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	result = pgClient.Where(
		"relationship_id = ? AND date BETWEEN ? AND ?",
		relationship.ID,
		dateRange[0],
		dateRange[1],
	).Preload("Inventory").Find(&sales)

	if result.Error != nil {
		errorResponse(c, http.StatusInternalServerError, result.Error.Error())

		return
	}

	var filteredPurchases []map[string]interface{}
	var filteredSales []map[string]interface{}
	var filteredCredit []map[string]interface{}
	var filteredReturned []map[string]interface{}

	for _, record := range purchases {
		totalPurchased += record.Price

		filteredPurchases = append(filteredPurchases, map[string]interface{}{
			"id":           record.ID,
			"company_name": record.CompanyName,
			"vehicle_name": record.VehicleName,
			"price":        record.Price,
			"date":         record.Date,
		})
	}

	for _, record := range sales {
		if record.Returned {
			totalReturned += record.Price

			filteredReturned = append(filteredReturned, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"part_name": record.Inventory.PartName,
				"credit":    record.Credit,
			})
		} else if record.Credit {
			totalCredit += record.Price

			filteredCredit = append(filteredCredit, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"part_name": record.Inventory.PartName,
			})
		} else {
			totalSales += record.Price

			filteredSales = append(filteredSales, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"part_name": record.Inventory.PartName,
			})
		}
	}

	successResponse(c, http.StatusOK, "", map[string]interface{}{
		"id":                   relationship.ID,
		"name":                 relationship.Name,
		"purchases":            filteredPurchases,
		"purchased_total":      totalPurchased,
		"sales":                filteredSales,
		"credited_sales":       filteredCredit,
		"sales_returned":       filteredReturned,
		"sales_total":          totalSales,
		"sales_returned_total": totalReturned,
		"credited_sales_total": totalCredit,
	})
}
