use crate::auth::JWTTokenStr;
use crate::crud::relationships;
use crate::models::{DeleteRelationship, NewRelationship, Relationship, UpdateRelationship};
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
/// * `relationship` - The record to create.
#[post("/relationships", data = "<relationship>", format = "json")]
pub async fn create_relationship<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    relationship: Json<NewRelationship>,
) -> CustomResponse<Relationship> {
    let relationship = Json::into_inner(relationship);
    let relationship = db.run(move |c| relationship.create(c)).await;

    match relationship {
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
#[get("/relationships")]
pub async fn read_relationships<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
) -> CustomResponse<Vec<Relationship>> {
    let relationship = db.run(|c| relationships::read(c)).await;

    match relationship {
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
/// * `relationship` - The record to update (with the updated fields).
#[patch("/relationships", data = "<relationship>", format = "json")]
pub async fn update_relationship<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    relationship: Json<UpdateRelationship>,
) -> CustomResponse<Relationship> {
    let relationship = Json::into_inner(relationship);
    let relationship = db.run(move |c| relationship.update(c)).await;

    match relationship {
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
/// * `relationship` - The ID of the record to delete.
#[delete("/relationships", data = "<relationship>", format = "json")]
pub async fn delete_relationship<'r>(
    _token: JWTTokenStr<'_>,
    db: Database,
    relationship: Json<DeleteRelationship>,
) -> CustomResponse<()> {
    let relationship = Json::into_inner(relationship);
    let relationship_id = relationship.id;
    let res = db.run(move |c| relationship.delete(c)).await;

    match res {
        Ok(_) => utils::custom_response(
            Status::Ok,
            ApiResponse {
                status_type: StatusType::Success,
                code: Status::Ok.code,
                message: Some(format!(
                    "record with id '{relationship_id}' successfully deleted",
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
