/// CRUD operations for the eb_relationships table.
// TODO: add meilisearch operations.
use diesel::prelude::*;
use diesel::{PgConnection, RunQueryDsl};

use crate::models::{DeleteSale, NewSale, Sale, UpdateSale};
use crate::types::QueryResult;

impl NewSale {
    /// Creates a new sale record in the database.
    /// It returns the created record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn create(&self, conn: &PgConnection) -> QueryResult<Sale> {
        use crate::schema::eb_sales::dsl::*;

        let sale = diesel::insert_into(eb_sales)
            .values(self)
            .get_result(conn)?;

        Ok(sale)
    }
}

impl UpdateSale {
    /// Updates a sale record in the database using its ID.
    /// It returns the updated record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn update(&self, conn: &PgConnection) -> QueryResult<Sale> {
        use crate::schema::eb_sales::dsl::*;

        let sale = diesel::update(eb_sales)
            .filter(id.eq(self.id))
            .set(self)
            .get_result(conn)?;

        Ok(sale)
    }
}

impl DeleteSale {
    /// Deletes a sale record from the database using its ID.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn delete(&self, conn: &PgConnection) -> QueryResult<()> {
        use crate::schema::eb_sales::dsl::*;

        diesel::delete(eb_sales)
            .filter(id.eq(self.id))
            .execute(conn)?;

        Ok(())
    }
}

// TODO: allow pagination.
/// Returns a list of records from the sales table.
///
/// # Arguments
///
/// * `conn` - The database connection.
pub fn read(conn: &PgConnection) -> QueryResult<Vec<Sale>> {
    use crate::schema::eb_sales::dsl::*;

    let sale = eb_sales.load(conn)?;

    Ok(sale)
}
