use crate::auth::JWTTokenStr;
use crate::crud::purchases;
use crate::models::{DeletePurchase, NewPurchase, Purchase, UpdatePurchase};
use crate::types::{ApiResponse, CustomResponse, StatusType};
use crate::utils;
use crate::Database;

use rocket::http::Status;
use rocket::serde::json::Json;

// TODO: add examples.
/// Creates a new purchase record in the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the Authorization header).
/// * `db` - The database connection pool.
/// * `purchase` - The record to create.
#[post("/purchases", data = "<purchase>", format = "json")]
pub async fn create_purchase<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    purchase: Json<NewPurchase>,
) -> CustomResponse<Purchase> {
    let purchase = Json::into_inner(purchase);
    let purchase = db.run(move |c| purchase.create(c)).await;

    match purchase {
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
/// Reads a list of purchase records from the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
#[get("/purchases")]
pub async fn read_purchases<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
) -> CustomResponse<Vec<Purchase>> {
    let purchases = db.run(|c| purchases::read(c)).await;

    match purchases {
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
/// Updates an purchase record based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `purchase` - The record to update (with the updated fields).
#[patch("/purchases", data = "<purchase>", format = "json")]
pub async fn update_purchase<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    purchase: Json<UpdatePurchase>,
) -> CustomResponse<Purchase> {
    let purchase = Json::into_inner(purchase);
    let purchase = db.run(move |c| purchase.update(c)).await;

    match purchase {
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
/// Deletes an purchases record from the database based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `purchase` - The ID of the record to delete.
#[delete("/purchases", data = "<purchase>", format = "json")]
pub async fn delete_purchase<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    purchase: Json<DeletePurchase>,
) -> CustomResponse<()> {
    let purchase = Json::into_inner(purchase);
    let purchase_id = purchase.id;
    let res = db.run(move |c| purchase.delete(c)).await;

    match res {
        Ok(_) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: Some(format!(
                    "record with id '{purchase_id}' successfully deleted",
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
