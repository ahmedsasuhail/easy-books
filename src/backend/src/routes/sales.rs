use crate::auth::JWTTokenStr;
use crate::crud::sales;
use crate::models::{DeleteSale, NewSale, Sale, UpdateSale};
use crate::types::{ApiResponse, CustomResponse, StatusType};
use crate::utils;
use crate::Database;

use rocket::http::Status;
use rocket::serde::json::Json;

// TODO: add examples.
/// Creates a new relationship record in the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the Authorization header).
/// * `db` - The database connection pool.
/// * `sale` - The record to create.
#[post("/sales", data = "<sale>", format = "json")]
pub async fn create_sale<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    sale: Json<NewSale>,
) -> CustomResponse<Sale> {
    let sale = Json::into_inner(sale);
    let sale = db.run(move |c| sale.create(c)).await;

    match sale {
        Ok(i) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(i),
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
/// Reads a list of relationship records from the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
#[get("/sales")]
pub async fn read_sales<'r>(_token: JWTTokenStr<'_>, db: Database) -> CustomResponse<Vec<Sale>> {
    let sale = db.run(|c| sales::read(c)).await;

    match sale {
        Ok(i) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(i),
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
/// Updates a relationship record based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `sale` - The record to update (with the updated fields).
#[patch("/sales", data = "<sale>", format = "json")]
pub async fn update_sale<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    sale: Json<UpdateSale>,
) -> CustomResponse<Sale> {
    let sale = Json::into_inner(sale);
    let sale = db.run(move |c| sale.update(c)).await;

    match sale {
        Ok(i) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: None,
                data: Some(i),
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
/// Deletes a relationship record from the database based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `sale` - The ID of the record to delete.
#[delete("/sales", data = "<sale>", format = "json")]
pub async fn delete_sale<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    sale: Json<DeleteSale>,
) -> CustomResponse<()> {
    let sale = Json::into_inner(sale);
    let sale_id = sale.id;
    let res = db.run(move |c| sale.delete(c)).await;

    match res {
        Ok(_) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: Some(format!("record with id '{sale_id}' successfully deleted",)),
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
