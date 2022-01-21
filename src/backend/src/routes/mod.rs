/// Routes configuration for backend.
use crate::controllers;
use crate::models::{NewUser, User};
use crate::types::{ApiResponse, Status};
use crate::Database;

use rocket::serde::json::Json;

#[get("/")]
pub fn index() -> &'static str {
    "Welcome to Easy Books!"
}

// TODO: add custom request guard for deserialization errors.
/// Registers a new user into the database.
///
/// # Arguments
///
/// * `db` - The database connection pool.
/// * `new_user` - The user to register.
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
pub async fn register(db: Database, user: Json<NewUser>) -> Json<ApiResponse<User>> {
    let new_user = Json::into_inner(user);

    let user = db.run(|c| controllers::create_user(c, new_user)).await;

    match user {
        Ok(u) => Json::from(ApiResponse {
            status: Status::Success,
            code: 200,
            message: None,
            data: Some(u),
        }),
        Err(e) => Json::from(ApiResponse {
            status: Status::Error,
            code: 500,
            message: Some(e.to_string()),
            data: None,
        }),
    }
}
