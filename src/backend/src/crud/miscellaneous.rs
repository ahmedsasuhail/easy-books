/// CRUD operations for the eb_miscellaneous table.
// TODO: add meilisearch operations.
use diesel::prelude::*;
use diesel::{PgConnection, RunQueryDsl};

use crate::models::{DeleteMiscellaneous, Miscellaneous, NewMiscellaneous, UpdateMiscellaneous};
use crate::types::QueryResult;

impl NewMiscellaneous {
    /// Creates a new miscellaneous record in the database.
    /// It returns the created record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn create(&self, conn: &PgConnection) -> QueryResult<Miscellaneous> {
        use crate::schema::eb_miscellaneous::dsl::*;

        let miscellaneous = diesel::insert_into(eb_miscellaneous)
            .values(self)
            .get_result(conn)?;

        Ok(miscellaneous)
    }
}

impl UpdateMiscellaneous {
    /// Updates a miscellaneous record in the database using its ID.
    /// It returns the updated record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn update(&self, conn: &PgConnection) -> QueryResult<Miscellaneous> {
        use crate::schema::eb_miscellaneous::dsl::*;

        let miscellaneous = diesel::update(eb_miscellaneous)
            .filter(id.eq(self.id))
            .set(self)
            .get_result(conn)?;

        Ok(miscellaneous)
    }
}

impl DeleteMiscellaneous {
    /// Deletes a miscellaneous record from the database using its ID.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn delete(&self, conn: &PgConnection) -> QueryResult<()> {
        use crate::schema::eb_miscellaneous::dsl::*;

        diesel::delete(eb_miscellaneous)
            .filter(id.eq(self.id))
            .execute(conn)?;

        Ok(())
    }
}

// TODO: allow pagination.
/// Returns a list of records from the miscellaneous table.
///
/// # Arguments
///
/// * `conn` - The database connection.
pub fn read(conn: &PgConnection) -> QueryResult<Vec<Miscellaneous>> {
    use crate::schema::eb_miscellaneous::dsl::*;

    let miscellaneous = eb_miscellaneous.load(conn)?;

    Ok(miscellaneous)
}
