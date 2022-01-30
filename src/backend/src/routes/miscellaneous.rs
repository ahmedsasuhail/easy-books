use crate::auth::JWTTokenStr;
use crate::crud::miscellaneous;
use crate::models::{DeleteMiscellaneous, Miscellaneous, NewMiscellaneous, UpdateMiscellaneous};
use crate::types::{ApiResponse, CustomResponse, StatusType};
use crate::utils;
use crate::Database;

use rocket::http::Status;
use rocket::serde::json::Json;

// TODO: add examples.
/// Creates a new miscellaneous record in the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the Authorization header).
/// * `db` - The database connection pool.
/// * `miscellaneous` - The record to create.
#[post("/miscellaneous", data = "<miscellaneous>", format = "json")]
pub async fn create_miscellaneous<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    miscellaneous: Json<NewMiscellaneous>,
) -> CustomResponse<Miscellaneous> {
    let miscellaneous = Json::into_inner(miscellaneous);
    let miscellaneous = db.run(move |c| miscellaneous.create(c)).await;

    match miscellaneous {
        Ok(m) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(m),
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

// TODO: add examples.
/// Reads a list of miscellaneous records from the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
#[get("/miscellaneous")]
pub async fn read_miscellaneous<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
) -> CustomResponse<Vec<Miscellaneous>> {
    let miscellaneous = db.run(|c| miscellaneous::read(c)).await;

    match miscellaneous {
        Ok(m) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(m),
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

// TODO: add examples.
/// Updates a miscellaneous record based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `miscellaneous` - The record to update (with the updated fields).
#[patch("/miscellaneous", data = "<miscellaneous>", format = "json")]
pub async fn update_miscellaneous<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    miscellaneous: Json<UpdateMiscellaneous>,
) -> CustomResponse<Miscellaneous> {
    let miscellaneous = Json::into_inner(miscellaneous);
    let miscellaneous = db.run(move |c| miscellaneous.update(c)).await;

    match miscellaneous {
        Ok(m) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(m),
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

// TODO: add examples.
/// Deletes a miscellaneous record from the database based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `miscellaneous` - The ID of the record to delete.
#[delete("/miscellaneous", data = "<miscellaneous>", format = "json")]
pub async fn delete_miscellaneous<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    miscellaneous: Json<DeleteMiscellaneous>,
) -> CustomResponse<()> {
    let miscellaneous = Json::into_inner(miscellaneous);
    let miscellaneous_id = miscellaneous.id;
    let res = db.run(move |c| miscellaneous.delete(c)).await;

    match res {
        Ok(_) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: Some(format!(
                    "record with id '{miscellaneous_id}' successfully deleted",
                )),
                data: None,
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
