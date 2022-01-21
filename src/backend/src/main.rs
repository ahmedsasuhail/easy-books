#[macro_use]
extern crate rocket;

#[macro_use]
extern crate diesel;

use rocket_sync_db_pools::database;

// Modules.
pub mod controllers;
pub mod models;
pub mod routes;
pub mod schema;
pub mod types;

// Primary backend database connection pool.
#[database("db")]
pub struct Database(diesel::PgConnection);

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Database::fairing())
        .mount("/", routes![routes::index])
        .mount("/auth", routes![routes::register])
}
