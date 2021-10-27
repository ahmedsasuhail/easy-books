package controllers

import (
	"net/http"

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

	for _, record := range records {
		if record.Returned {
			totalReturned += record.Price

			returned = append(returned, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
				"returned":  record.Returned,
				"part_name": record.Inventory.PartName,
			})
		} else {
			totalSales += record.Price

			sales = append(sales, map[string]interface{}{
				"id":        record.ID,
				"price":     record.Price,
				"date":      record.Date,
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
		"sales_returned":       returned,
		"sales_total":          totalSales,
		"sales_returned_total": totalReturned,
		"total":                totalSales - record.Purchases.Price,
	})
}
