/// CRUD operations for the eb_inventory table.
// TODO: add meilisearch operations.
use diesel::prelude::*;
use diesel::{PgConnection, RunQueryDsl};

use crate::models::{DeleteInventory, Inventory, NewInventory, UpdateInventory};
use crate::types::QueryResult;

impl NewInventory {
    /// Creates a new inventory record in the database.
    /// It returns the created record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn create(&self, conn: &PgConnection) -> QueryResult<Inventory> {
        use crate::schema::eb_inventory::dsl::*;

        let inventory = diesel::insert_into(eb_inventory)
            .values(self)
            .get_result(conn)?;

        Ok(inventory)
    }
}

impl UpdateInventory {
    /// Updates an inventory record in the database using its ID.
    /// It returns the updated record.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn update(&self, conn: &PgConnection) -> QueryResult<Inventory> {
        use crate::schema::eb_inventory::dsl::*;

        let inventory = diesel::update(eb_inventory)
            .filter(id.eq(self.id))
            .set(self)
            .get_result(conn)?;

        Ok(inventory)
    }
}

impl DeleteInventory {
    /// Deletes an inventory record from the database using its ID.
    ///
    /// # Arguments
    ///
    /// * `conn` - The database connection.
    pub fn delete(&self, conn: &PgConnection) -> QueryResult<()> {
        use crate::schema::eb_inventory::dsl::*;

        diesel::delete(eb_inventory)
            .filter(id.eq(self.id))
            .execute(conn)?;

        Ok(())
    }
}

// TODO: allow pagination.
/// Returns a list of records from the inventory table.
///
/// # Arguments
///
/// * `conn` - The database connection.
pub fn read(conn: &PgConnection) -> QueryResult<Vec<Inventory>> {
    use crate::schema::eb_inventory::dsl::*;

    let inventory = eb_inventory.load(conn)?;

    Ok(inventory)
}
