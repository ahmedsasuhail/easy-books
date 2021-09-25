package controllers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/ahmedsasuhail/easy-books/models"
	"github.com/gin-gonic/gin"
)

// errorResponse is a convenience function that allows for writing an error response.
func errorResponse(c *gin.Context, code uint, msg string) {
	c.JSON(int(code), models.Response{
		Status:  "error",
		Code:    code,
		Message: msg,
	})
}

// failResponse is a convenience function that allows for writing a failed response.
func failResponse(c *gin.Context, code uint, msg string) {
	c.JSON(int(code), models.Response{
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
func parseRequestBody(c *gin.Context, receiver interface{}) {
	requestBody, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())
	}

	err = json.Unmarshal(requestBody, &receiver)
	if err != nil {
		errorResponse(c, http.StatusInternalServerError, err.Error())
	}
}
