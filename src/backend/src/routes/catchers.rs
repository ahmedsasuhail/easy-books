/// Custom route error catchers.
use rocket::http::Status;

use crate::types::{ApiResponse, CustomResponse, StatusType};
use crate::utils;

#[catch(400)]
pub fn bad_request() -> CustomResponse<()> {
    utils::custom_response(
        Status::BadRequest,
        ApiResponse {
            status_type: StatusType::Fail,
            code: Status::BadRequest.code,
            message: Some(String::from("invalid json syntax")),
            data: None,
        },
    )
}

#[catch(422)]
pub fn unprocessable_entity() -> CustomResponse<()> {
    utils::custom_response(
        Status::UnprocessableEntity,
        ApiResponse {
            status_type: StatusType::Fail,
            code: Status::UnprocessableEntity.code,
            message: Some(String::from("invalid json data")),
            data: None,
        },
    )
}
