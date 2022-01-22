/// This module contains custom types and type aliases.
use std::error::Error;

use rocket::response::status::Custom;
use rocket::serde::{json::Json, Serialize};

/// Type alias for a thread-safe boxed error.
/// It's compatible with diesel query errors.
pub type QueryError = Box<dyn Error + Send + Sync>;

/// Type alias for a JSON response with a custom HTTP status code.
pub type CustomResponse<T> = Custom<Json<ApiResponse<T>>>;

/// JSend response status type.
#[derive(Serialize)]
pub enum StatusType {
    #[serde(rename = "success")]
    Success,
    #[serde(rename = "fail")]
    Fail,
    #[serde(rename = "error")]
    Error,
}

/// Custom JSend compliant API response structure.
///
/// Read more: https://github.com/omniti-labs/jsend
///
/// # Fields
///
/// * `status` - Can be "success", "fail" or "error".
/// * `code` - The HTTP status code.
/// * `message` - An optional message.
/// * `data` - Optional arbitrary data.
#[derive(Serialize)]
pub struct ApiResponse<S>
where
    S: Serialize,
{
    #[serde(rename = "status")]
    pub status_type: StatusType,
    pub code: u16,
    pub message: Option<String>,
    pub data: Option<S>,
}
