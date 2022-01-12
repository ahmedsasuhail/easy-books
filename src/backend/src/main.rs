#[macro_use]
extern crate rocket;

#[macro_use]
extern crate diesel;

use rocket_sync_db_pools::database;

pub mod models;
pub mod routes;
pub mod schema;

// Primary backend database connection pool.
#[database("db")]
pub struct Database(diesel::PgConnection);

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Database::fairing())
        .mount("/", routes![routes::index])
}
