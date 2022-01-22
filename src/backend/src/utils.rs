/// This module contains utility and helper functions.
use std::str;

use sha3::{Digest, Sha3_512};

use rocket::http::Status;
use rocket::response::status::Custom;
use rocket::serde::{json::Json, Serialize};

use crate::types::{ApiResponse, CustomResponse};

/// Hashes and returns a string using the SHA3-512 algorithm.
///
/// # Arguments
///
/// * `s` - The string to hash.
pub fn hash_sha3_512(s: &str) -> String {
    let mut hasher = Sha3_512::new();
    hasher.update(s);
    let hashed_str = hasher.finalize();

    format!("{:x}", hashed_str)
}

/// Helper function that returns a custom response.
///
/// # Arguments
///
/// * `status` - The response status.
/// * `resp` - The response.
pub fn custom_response<T: Serialize>(status: Status, resp: ApiResponse<T>) -> CustomResponse<T> {
    Custom(status, Json::from(resp))
}
