// controllers contains the endpoint handlers for the backend app.
package controllers

import (
	"encoding/hex"
	"fmt"
	"net/http"
	"os"

	"github.com/ahmedsasuhail/easy-books/auth"
	"github.com/ahmedsasuhail/easy-books/db"
	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
	"github.com/meilisearch/meilisearch-go"
	"golang.org/x/crypto/sha3"
)

var pgClient *db.PostgresClient
var msClient = newMeilisearchClient()

// InitDB initializes a database connection and migrates the specified models.
func InitDB(models []interface{}) error {
	var err error
	pgClient, err = db.ConnectPostgres(os.Getenv("DATABASE_URL"))
	if err != nil {
		return err
	}

	pgClient.Migrate(models)

	return nil
}

func newMeilisearchClient() *meilisearch.Client {
	return meilisearch.NewClient(meilisearch.ClientConfig{
		Host:   os.Getenv("MEILISEARCH_HOST"),
		APIKey: os.Getenv("MEILISEARCH_API_KEY"),
	})
}

// InitMeilisearch clears Meilisearch's indeces and repopulates them with the
// latest data from the PostgreSQL database.
func InitMeilisearch() {
	var inventoryTable []models.Inventory
	var miscellaneousTable []models.Miscellaneous
	var purchasesTable []models.Purchases
	var relationshipsTable []models.Relationships
	var salesTable []models.Sales

	pgClient.Preload(
		"Purchases",
	).Preload(
		"Purchases.Relationships",
	).Find(&inventoryTable)

	pgClient.Find(&miscellaneousTable)

	pgClient.Preload(
		"Relationships",
	).Find(&purchasesTable)

	pgClient.Find(&relationshipsTable)

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
	).Find(&salesTable)

	var filteredInventory []map[string]interface{}
	var filteredMiscellaneous []map[string]interface{}
	var filteredPurchases []map[string]interface{}
	var filteredRelationships []map[string]interface{}
	var filteredSales []map[string]interface{}

	for _, record := range inventoryTable {
		filteredInventory = append(filteredInventory, map[string]interface{}{
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
		})
	}

	for _, record := range miscellaneousTable {
		filteredMiscellaneous = append(filteredMiscellaneous, map[string]interface{}{
			"id":          record.ID,
			"description": record.Description,
			"price":       record.Price,
			"date":        record.Date,
		})
	}

	for _, record := range purchasesTable {
		filteredPurchases = append(filteredPurchases, map[string]interface{}{
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

	for _, record := range relationshipsTable {
		filteredRelationships = append(filteredRelationships, map[string]interface{}{
			"id":           record.ID,
			"name":         record.Name,
			"phone_number": record.PhoneNumber,
			"address":      record.Address,
		})
	}

	for _, record := range salesTable {
		filteredSales = append(filteredSales, map[string]interface{}{
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

	indeces := map[string]models.MeiliIndexConfig{
		models.InventoryTableName: {
			Document:   filteredInventory,
			PrimaryKey: "id",
			SortableAttributes: []string{
				"id",
				"part_name",
				"date",
				"purchases.company_name",
				"purchases.vehicle_name",
			},
			SearchableAttributes: []string{
				"part_name",
				"purchases.company_name",
				"purchases.vehicle_name",
			},
			FilterableAttributes: []string{
				"purchase_id",
			},
		},
		models.MiscellaneousTableName: {
			Document:   filteredMiscellaneous,
			PrimaryKey: "id",
			SortableAttributes: []string{
				"id",
				"price",
				"date",
			},
			SearchableAttributes: []string{
				"description",
			},
		},
		models.PurchasesTableName: {
			Document:   filteredPurchases,
			PrimaryKey: "id",
			SortableAttributes: []string{
				"id",
				"company_name",
				"vehicle_name",
				"price",
				"date",
				"relationships.name",
			},
			SearchableAttributes: []string{
				"company_name",
				"vehicle_name",
				"relationships.name",
			},
		},
		models.RelationshipsTableName: {
			Document:   filteredRelationships,
			PrimaryKey: "id",
			SortableAttributes: []string{
				"id",
				"name",
			},
			SearchableAttributes: []string{
				"name",
				"phone_number",
				"address",
			},
		},
		models.SalesTableName: {
			Document:   filteredSales,
			PrimaryKey: "id",
			SortableAttributes: []string{
				"id",
				"price",
				"date",
				"relationships.name",
				"purchases.company_name",
				"purchases.vehicle_name",
				"inventory.part_name",
			},
			SearchableAttributes: []string{
				"relationships.name",
				"purchases.company_name",
				"purchases.vehicle_name",
				"inventory.part_name",
			},
		},
	}

	for index, config := range indeces {
		msClient.DeleteIndexIfExists(index)
		msClient.Index(index).AddDocumentsWithPrimaryKey(
			config.Document,
			config.PrimaryKey,
		)
		msClient.Index(index).UpdateSortableAttributes(&config.SortableAttributes)
		msClient.Index(index).UpdateSearchableAttributes(&config.SearchableAttributes)
		msClient.Index(index).UpdateFilterableAttributes(&config.FilterableAttributes)
	}
}

// AppInit initializes the backend app and displays a JSON message.
func AppInit(c *gin.Context) {
	// TODO: Add some actual initialization stuff.
	successResponse(c, http.StatusOK, "App initialized.", nil)
}

// Login checks the provided credentials and returns a response containing
// a JWT auth token for the provided credentials.
func Login(c *gin.Context) {
	// Read and parse request body.
	var jsonBody map[string]string
	err := parseRequestBody(c, &jsonBody)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	// TODO: Add proper error handling for missing keys.
	email := jsonBody["email"]
	password := jsonBody["password"]

	// Read user from DB.
	user, err := pgClient.GetUser(email)
	if err != nil {
		// TODO: check whether 404 is appropriate status code for this response.
		failResponse(
			c,
			http.StatusNotFound,
			fmt.Sprintf("The email %s does not exist.", email),
		)

		return
	} else {
		hash := sha3.New512()
		hash.Write([]byte(password))
		hashedPassword := hash.Sum(nil)

		// Validate credentials and return generated JWT token.
		// TODO: find a better way to perform the comparison.
		if fmt.Sprintf("%x", hashedPassword) == user.Password {
			token, err := auth.GenerateToken(user.Email)
			if err != nil {
				errorResponse(c, http.StatusInternalServerError, err.Error())

				return
			} else {
				successResponse(
					c,
					http.StatusOK,
					"",
					map[string]interface{}{
						"user": map[string]string{
							"name":  user.Name,
							"email": user.Email,
						},
						"auth": token,
					},
				)
			}
		} else {
			failResponse(
				c,
				http.StatusUnauthorized,
				"Provided password is incorrect.",
			)

			return
		}
	}
}

// Register adds a new user to the database.
func Register(c *gin.Context) {
	// Read and parse request body.
	var jsonBody map[string]string
	err := parseRequestBody(c, &jsonBody)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())

		return
	}

	// TODO: Add proper error handling for missing keys.
	name := jsonBody["name"]
	email := jsonBody["email"]
	password := jsonBody["password"]

	// Check if user already exists.
	_, err = pgClient.GetUser(email)
	if err == nil {
		failResponse(c,
			http.StatusBadRequest,
			fmt.Sprintf("User with email %s already exists.", email),
		)

		return
	} else {
		hash := sha3.New512()
		hash.Write([]byte(password))
		hashedPassword := hex.EncodeToString(hash.Sum(nil))

		user := &models.Users{
			Name:     name,
			Email:    email,
			Password: hashedPassword,
		}

		// If there was an error while creating the user, return an error response
		// with the DB error message.
		createdUser := pgClient.Create(user)
		if createdUser.Error != nil {
			errorResponse(
				c,
				http.StatusInternalServerError,
				createdUser.Error.Error(),
			)

			return
		} else {
			successResponse(
				c,
				http.StatusOK,
				"",
				map[string]string{
					"name":  name,
					"email": email,
				},
			)
		}
	}
}
