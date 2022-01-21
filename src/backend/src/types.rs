/// This module contains custom types and type aliases.
use std::error::Error;

use rocket::serde::Serialize;

/// Type alias for a thread-safe boxed error.
/// It's compatible with diesel query errors.
pub type QueryError = Box<dyn Error + Send + Sync>;

/// JSend response status type.
#[derive(Serialize)]
pub enum Status {
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
    pub status: Status,
    pub code: u16,
    pub message: Option<String>,
    pub data: Option<S>,
}
