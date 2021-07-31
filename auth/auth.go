package auth

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type JWTService interface {
	GenerateToken(uid uint, name, email string) (string, error)
	ValidateToken(token string) (*jwt.Token, error)
}

type authCustomClaims struct {
	UserID uint
	Name   string
	Email  string
	*jwt.StandardClaims
}

type jwtServices struct {
	secret string
	issuer string
}

// GenerateToken generates a JWT token using the specified parameters.
func (service *jwtServices) GenerateToken(uid uint, name, email string) (string, error) {
	claims := &authCustomClaims{
		uid,
		name,
		email,
		&jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 40).Unix(),
			Issuer:    service.issuer,
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	t, err := token.SignedString([]byte(service.secret))
	if err != nil {
		return "", err
	}

	return t, nil
}

// ValidateToken validates a provided JWT token.
func (service *jwtServices) ValidateToken(encToken string) (*jwt.Token, error) {
	return jwt.Parse(encToken, func(token *jwt.Token) (interface{}, error) {
		if _, valid := token.Method.(*jwt.SigningMethodHMAC); !valid {
			return nil, fmt.Errorf("invalid token %v", token.Header["alg"])
		}
		return []byte(service.secret), nil
	})
}

// JWTAuthService creates and returns a JWT service.
func JWTAuthService(secret, issuer string) JWTService {
	return &jwtServices{
		secret,
		issuer,
	}
}
