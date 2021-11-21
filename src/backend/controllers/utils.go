package controllers

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
)

// errorResponse is a convenience function that allows for writing an error response.
func errorResponse(c *gin.Context, code uint, msg string) {
	c.AbortWithStatusJSON(int(code), models.Response{
		Status:  "error",
		Code:    code,
		Message: msg,
	})
}

// failResponse is a convenience function that allows for writing a failed response.
func failResponse(c *gin.Context, code uint, msg string) {
	c.AbortWithStatusJSON(int(code), models.Response{
		Status:  "fail",
		Code:    code,
		Message: msg,
	})
}

// successResponse is a convenience function that allows for writing a success response.
func successResponse(c *gin.Context, code uint, msg string, data interface{}) {
	c.JSON(int(code), models.Response{
		Status:  "success",
		Code:    code,
		Message: msg,
		Data:    data,
	})
}

// parseRequestBody parses a request's JSON body onto an appropriate receiver.
// It triggers and internal server error response if an error is encountered.
func parseRequestBody(c *gin.Context, receiver interface{}) error {
	requestBody, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		return err
	}

	err = json.Unmarshal(requestBody, &receiver)
	if err != nil {
		return err
	}

	return nil
}

// parsePaginationRequest parses a URL query and maps it onto a `Pagination` structure.
func parsePaginationRequest(c *gin.Context) (models.Pagination, error) {
	query := c.Request.URL.Query()

	// Pagination parameters.
	q := ""
	getAll := false
	page := 1
	pageLimit := 50
	orderBy := "id"
	sortOrder := "asc"

	for key, value := range query {
		queryValue := value[len(value)-1]
		var err error

		switch key {
		case "q":
			if strings.TrimSpace(queryValue) != "" {
				q = queryValue
			}

		case "get_all":
			if queryValue == "true" {
				getAll = true
			}

		case "page":
			page, err = strconv.Atoi(queryValue)
			if err != nil {
				return models.Pagination{}, errors.New(
					"invalid type for key `page` (uint32 expected)",
				)
			}

			if page <= 0 {
				return models.Pagination{}, fmt.Errorf(
					"invalid page number: %d", page,
				)
			}

		case "page_limit":
			pageLimit, err = strconv.Atoi(queryValue)
			if err != nil {
				return models.Pagination{}, errors.New(
					"invalid type for key `page` (uint32 expected)",
				)
			}

		case "sort_order":
			sortOrder = queryValue

		case "order_by":
			orderBy = queryValue
		}
	}

	return models.Pagination{
		Query:     q,
		GetAll:    getAll,
		Page:      page,
		PageLimit: pageLimit,
		OrderBy:   orderBy,
		SortOrder: sortOrder,
	}, nil
}
