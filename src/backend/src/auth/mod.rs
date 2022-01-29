/// This module contains JWT authentication functionality.
use std::env;
use std::error::Error;

use rocket::http::Status;
use rocket::request::{FromRequest, Outcome, Request};

use chrono::{DateTime, Utc};

use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use serde::{Deserialize, Serialize};
use sha2::Sha256;

/// Custom JWT Claims object.
///
/// # Fields
///
/// * `authorized` - Whether or not the user is authorized.
/// * `email` - The user's email address.
/// * `expiry` - The token's expiry in UTC.
#[derive(Deserialize, Serialize, PartialEq, PartialOrd)]
pub struct JWTClaims {
    pub authorized: bool,
    pub email: String,
    pub expiry: DateTime<Utc>,
}

/// A JWT token string.
/// It can be used as a Rocket request guard.
pub struct JWTTokenStr<'r>(pub &'r str);

/// A JWT token object.
#[derive(Serialize)]
pub struct JWTToken {
    pub token: String,
    pub email: String,
    pub expiry: DateTime<Utc>,
}

/// JWT token errors used in the JWT token request guard.
#[derive(Debug)]
pub enum JWTTokenError {
    Missing,
    Invalid,
    SecretNotFoound,
}

/// Generates a JWT token using the specified claims.
///
/// # Arguments
///
/// * `claims` - The custom JWT claims.
/// * `secret` - The secret key to use.
pub fn gen_token(claims: JWTClaims, secret: &str) -> Result<JWTToken, Box<dyn Error>> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())?;
    let email = claims.email.clone();
    let expiry = claims.expiry;
    let token_str = claims.sign_with_key(&key)?;

    Ok(JWTToken {
        token: token_str,
        email,
        expiry,
    })
}

/// Extracts a JWT token's claims from the token string.
///
/// # Arguments
///
/// * `token_str` - The JWT token string.
/// * `secret` - The secret key that was used to generate the JWT token.
fn get_token_claims(token_str: &str, secret: &str) -> Result<JWTClaims, Box<dyn Error>> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())?;
    let token_claims: JWTClaims = token_str.verify_with_key(&key)?;

    Ok(token_claims)
}

/// Validates a provided JWT token string.
///
/// # Arguments
///
/// * `token_str` - The JWT token string.
/// * `secret` - The secret key that was used to generate the JWT token.
pub fn validate_token(token_str: &str, secret: &str) -> Result<(), Box<dyn Error>> {
    let token = get_token_claims(token_str, secret);

    match token {
        Ok(c) => {
            if Utc::now() > c.expiry {
                return Err("invalid token".into());
            }

            Ok(())
        }
        Err(_) => Err("invalid token".into()),
    }
}

/// Custom JWT request guard.
#[rocket::async_trait]
impl<'r> FromRequest<'r> for JWTTokenStr<'r> {
    type Error = JWTTokenError;

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let jwt_secret = env::var("JWT_SECRET");

        match jwt_secret {
            Ok(s) => match req.headers().get_one("Authorization") {
                None => Outcome::Failure((Status::BadRequest, JWTTokenError::Missing)),
                Some(key) => match validate_token(key, &s) {
                    Ok(_) => Outcome::Success(JWTTokenStr(key)),
                    Err(_) => Outcome::Failure((Status::BadRequest, JWTTokenError::Invalid)),
                },
            },
            Err(_) => {
                Outcome::Failure((Status::InternalServerError, JWTTokenError::SecretNotFoound))
            }
        }
    }
}
