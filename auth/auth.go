package auth

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

// Token represents a JWT token.
type Token struct {
	Token  string `json:"token"`
	Expiry string `json:"expiry"`
}

// TODO: Make expiry time configurable.
// TODO: Allow refreshing tokens.
// TODO: Handle logging out.
// GenerateToken generates and returns a JWT token.
func GenerateToken(email string) (*Token, error) {
	expiry := time.Now().Add(time.Hour * 24).Unix()
	claims := jwt.MapClaims{
		"authorized": true,
		"email":      email,
		"expiry":     expiry,
	}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS512"), claims)
	tokenString, err := token.SignedString([]byte(os.Getenv("EB_SECRET")))
	if err != nil {
		return nil, err
	}

	return &Token{
		Token:  tokenString,
		Expiry: time.Unix(expiry, 0).Format("02/01/2006 15:04:05"),
	}, nil
}

// ValidateToken validates a JWT token and returns an error if the token is not valid.
func ValidateToken(token string) error {
	parsedToken, err := jwt.Parse(
		token,
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return []byte(os.Getenv("EB_SECRET")), nil
		},
	)

	if !parsedToken.Valid {
		return errors.New("invalid auth token")
	}

	return err
}
