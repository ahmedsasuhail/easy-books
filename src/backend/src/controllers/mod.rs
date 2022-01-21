/// This module contains controller functions that can be used as route handlers.
use crate::models::{NewUser, User};
use crate::types::QueryError;

use diesel::prelude::*;
use diesel::{PgConnection, QueryDsl, RunQueryDsl};

/// Creates a new user in the database.
/// It returns a result containing the created user with the populated fields.
///
/// # Arguments
///
/// * `conn` - The database connection.
/// * `user` - The user to create.
pub fn create_user(conn: &PgConnection, user: NewUser) -> Result<User, QueryError> {
    use crate::schema::eb_users::dsl::*;

    diesel::insert_into(eb_users).values(&user).execute(conn)?;

    let user = eb_users.filter(email.eq(&user.email)).first::<User>(conn);

    match user {
        Ok(u) => Ok(u),
        Err(e) => Err(Box::from(e)),
    }
}
