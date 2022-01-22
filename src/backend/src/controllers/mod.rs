/// This module contains controller functions that can be used as route handlers.
use crate::models::{NewUser, User};
use crate::types::QueryError;
use crate::utils;

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

    // Replace the password with its hashed version.
    let user = NewUser {
        password: utils::hash_sha3_512(&user.password),
        ..user
    };
    diesel::insert_into(eb_users).values(&user).execute(conn)?;

    let user = eb_users.filter(email.eq(&user.email)).first::<User>(conn)?;

    Ok(user)
}

/// Authenticates a specified user's credentials with the records in the database.
///
/// # Arguments
///
/// * `conn` - The database connection.
/// * `user` - The user to authenticate.
pub fn auth_user(conn: &PgConnection, user: NewUser) -> Result<User, QueryError> {
    use crate::schema::eb_users::dsl::*;

    let found_user = eb_users
        .filter(email.eq(&user.email))
        .filter(password.eq(utils::hash_sha3_512(&user.password)))
        .first::<User>(conn);

    found_user.map_err(|_| "invalid credentials".into())
}
