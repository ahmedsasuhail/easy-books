/// Routes configuration for backend.
// TODO: add custom request guard for deserialization errors.
// TODO: read JWT_SECRET from environment instead of using constant.
use chrono::{Duration, Utc};

use crate::auth::{self, JWTToken};
use crate::consts::JWT_SECRET;
use crate::controllers;
use crate::models::{NewUser, User};
use crate::types::{ApiResponse, CustomResponse, StatusType};
use crate::utils;
use crate::Database;

use rocket::http::Status;
use rocket::serde::json::Json;

#[get("/")]
pub fn index() -> &'static str {
    "Welcome to Easy Books!"
}

/// Registers a new user into the database.
///
/// # Arguments
///
/// * `db` - The database connection pool.
/// * `user` - The user to register.
///
/// # Example Request
///
/// ```json
/// {
///     "name": "John Doe",
///     "email": "john.doe@example.com",
///     "password": "password123"
/// }
/// ```
///
/// # Example Response
///
/// ```json
/// {
///     "status": "success",
///     "code": 200,
///     "message": null,
///     "data": {
///         "created_at": "2022-01-19T17:36:27.445374",
///         "updated_at": null,
///         "name": "John Doe",
///         "email": "john.doe@example.com",
///         "password": "password123"
///     }
/// }
/// ```
#[post("/register", data = "<user>", format = "json")]
pub async fn register(db: Database, user: Json<NewUser>) -> CustomResponse<User> {
    let new_user = Json::into_inner(user);

    let user = db.run(|c| controllers::create_user(c, new_user)).await;

    match user {
        Ok(u) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(u),
            },
        ),
        Err(e) => utils::custom_response(
            Status::InternalServerError,
            ApiResponse {
                status_type: StatusType::Error,
                code: Status::InternalServerError.code,
                message: Some(e.to_string()),
                data: None,
            },
        ),
    }
}

/// Authenticates a user and generates a JWT token if successful.
///
/// # Arguments
///
/// * `db` - The database connection pool.
/// * `user` - The user to authenticate.
///
/// # Example Request
///
/// ```json
/// {
///     "email": "john.doe@example.com",
///     "password": "password123"
/// }
/// ```
///
/// # Example Response
///
/// ```json
/// {
///     "status": "success",
///     "code": 200,
///     "message": null,
///     "data": {
///         "token": "eyJhbGciOiJIUzI1NiJ9.eyJhdXRob3JpemVkIjp0cnVlLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiZXhwaXJ5IjoiMjAyMi0wMS0yM1QxMjoyNzo1Mi4wNjkyMzE1NDZaIn0.tdUgkBeKf4m_EyTM3A9Kh9hyPchrw02zI2AAw99J_6o",
///         "email": "john.doe@example.com",
///         "expiry": "2022-01-23T12:27:52.069231546Z"
///     }
/// }
/// ```
#[post("/login", data = "<user>", format = "json")]
pub async fn login(db: Database, user: Json<NewUser>) -> CustomResponse<JWTToken> {
    let user = user.into_inner();

    let user = db.run(|c| controllers::auth_user(c, user)).await;
    match user {
        Ok(u) => {
            // If login was successful, we generate and return a JWT token.
            let claims = auth::JWTClaims {
                authorized: true,
                email: u.email,
                expiry: Utc::now() + Duration::hours(24),
            };

            let token = auth::gen_token(claims, JWT_SECRET);

            match token {
                Ok(t) => utils::custom_response(
                    Status::Ok,
                    ApiResponse {
                        status_type: StatusType::Success,
                        code: Status::Ok.code,
                        message: None,
                        data: Some(t),
                    },
                ),
                Err(e) => utils::custom_response(
                    Status::InternalServerError,
                    ApiResponse {
                        status_type: StatusType::Error,
                        code: Status::InternalServerError.code,
                        message: Some(e.to_string()),
                        data: None,
                    },
                ),
            }
        }
        Err(e) => utils::custom_response(
            Status::Unauthorized,
            ApiResponse {
                status_type: StatusType::Fail,
                code: Status::Unauthorized.code,
                message: Some(e.to_string()),
                data: None,
            },
        ),
    }
}
