/// CRUD operations for the eb_purchases table.
// TODO: add meilisearch operations.
use diesel::prelude::*;
use diesel::{PgConnection, RunQueryDsl};

use crate::models::{DeletePurchase, NewPurchase, Purchase, UpdatePurchase};
use crate::types::QueryResult;

impl NewPurchase {
    /// Creates a new purchase record in the database.
    /// It returns the created record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn create(&self, conn: &PgConnection) -> QueryResult<Purchase> {
        use crate::schema::eb_purchases::dsl::*;

        let purchases = diesel::insert_into(eb_purchases)
            .values(self)
            .get_result(conn)?;

        Ok(purchases)
    }
}

impl UpdatePurchase {
    /// Updates a purchase record in the database using its ID.
    /// It returns the updated record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn update(&self, conn: &PgConnection) -> QueryResult<Purchase> {
        use crate::schema::eb_purchases::dsl::*;

        let purchase = diesel::update(eb_purchases)
            .filter(id.eq(self.id))
            .set(self)
            .get_result(conn)?;

        Ok(purchase)
    }
}

impl DeletePurchase {
    /// Deletes a purchase record from the database using its ID.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn delete(&self, conn: &PgConnection) -> QueryResult<()> {
        use crate::schema::eb_purchases::dsl::*;

        diesel::delete(eb_purchases)
            .filter(id.eq(self.id))
            .execute(conn)?;

        Ok(())
    }
}

// TODO: allow pagination.
/// Returns a list of records from the purchases table.
///
/// # Arguments
///
/// * `conn` - The database connection.
pub fn read(conn: &PgConnection) -> QueryResult<Vec<Purchase>> {
    use crate::schema::eb_purchases::dsl::*;

    let purchases = eb_purchases.load(conn)?;

    Ok(purchases)
}
