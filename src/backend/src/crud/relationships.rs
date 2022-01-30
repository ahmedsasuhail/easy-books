/// CRUD operations for the eb_relationships table.
// TODO: add meilisearch operations.
use diesel::prelude::*;
use diesel::{PgConnection, RunQueryDsl};

use crate::models::{DeleteRelationship, NewRelationship, Relationship, UpdateRelationship};
use crate::types::QueryResult;

impl NewRelationship {
    /// Creates a new relationship record in the database.
    /// It returns the created record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn create(&self, conn: &PgConnection) -> QueryResult<Relationship> {
        use crate::schema::eb_relationships::dsl::*;

        let relationship = diesel::insert_into(eb_relationships)
            .values(self)
            .get_result(conn)?;

        Ok(relationship)
    }
}

impl UpdateRelationship {
    /// Updates a relationship record in the database using its ID.
    /// It returns the updated record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn update(&self, conn: &PgConnection) -> QueryResult<Relationship> {
        use crate::schema::eb_relationships::dsl::*;

        let relationship = diesel::update(eb_relationships)
            .filter(id.eq(self.id))
            .set(self)
            .get_result(conn)?;

        Ok(relationship)
    }
}

impl DeleteRelationship {
    /// Deletes a relationship record from the database using its ID.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn delete(&self, conn: &PgConnection) -> QueryResult<()> {
        use crate::schema::eb_relationships::dsl::*;

        diesel::delete(eb_relationships)
            .filter(id.eq(self.id))
            .execute(conn)?;

        Ok(())
    }
}

// TODO: allow pagination.
/// Returns a list of records from the relationships table.
///
/// # Arguments
///
/// * `conn` - The database connection.
pub fn read(conn: &PgConnection) -> QueryResult<Vec<Relationship>> {
    use crate::schema::eb_relationships::dsl::*;

    let relationship = eb_relationships.load(conn)?;

    Ok(relationship)
}
