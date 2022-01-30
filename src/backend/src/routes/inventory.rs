use crate::auth::JWTTokenStr;
use crate::crud::inventory;
use crate::models::{DeleteInventory, Inventory, NewInventory, UpdateInventory};
use crate::types::{ApiResponse, CustomResponse, StatusType};
use crate::utils;
use crate::Database;

use rocket::http::Status;
use rocket::serde::json::Json;

// TODO: add examples.
/// Creates a new inventory record in the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the Authorization header).
/// * `db` - The database connection pool.
/// * `inventory` - The record to create.
#[post("/inventory", data = "<inventory>", format = "json")]
pub async fn create_inventory<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    inventory: Json<NewInventory>,
) -> CustomResponse<Inventory> {
    let inventory = Json::into_inner(inventory);
    let inventory = db.run(move |c| inventory.create(c)).await;

    match inventory {
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
/// Reads a list of inventory records from the database.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
#[get("/inventory")]
pub async fn read_inventory<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
) -> CustomResponse<Vec<Inventory>> {
    let inventory = db.run(|c| inventory::read(c)).await;

    match inventory {
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
/// Updates an inventory record based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `inventory` - The record to update (with the updated fields).
#[patch("/inventory", data = "<inventory>", format = "json")]
pub async fn update_inventory<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    inventory: Json<UpdateInventory>,
) -> CustomResponse<Inventory> {
    let inventory = Json::into_inner(inventory);
    let inventory = db.run(move |c| inventory.update(c)).await;

    match inventory {
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
/// Deletes an inventory record from the database based on its ID.
///
/// # Arguments
///
/// * `_token` - The JWT token (specified in the "Authorization" header).
/// * `db` - The database connection pool.
/// * `inventory` - The ID of the record to delete.
#[delete("/inventory", data = "<inventory>", format = "json")]
pub async fn delete_inventory<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    inventory: Json<DeleteInventory>,
) -> CustomResponse<()> {
    let inventory = Json::into_inner(inventory);
    let inventory_id = inventory.id;
    let res = db.run(move |c| inventory.delete(c)).await;

    match res {
        Ok(_) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: Some(format!(
                    "record with id '{inventory_id}' successfully deleted",
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
