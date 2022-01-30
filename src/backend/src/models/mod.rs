use bigdecimal::BigDecimal;
use chrono::{NaiveDate, NaiveDateTime};

use diesel::{Insertable, Queryable};

use serde::{Deserialize, Serialize};

use meilisearch_sdk::document::*;

use crate::schema::*;

// ----------------------------------------------------------------------------
// eb_inventory
// ----------------------------------------------------------------------------

#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct Inventory {
    #[serde(skip_serializing)]
    pub created_at: NaiveDateTime,

    #[serde(skip_serializing)]
    pub updated_at: Option<NaiveDateTime>,

    pub id: i32,
    pub part_name: Option<String>,
    pub quantity: Option<i32>,
    pub date: Option<NaiveDate>,
    pub sold_out: Option<bool>,
    pub purchase_id: Option<i32>,
}

impl Document for Inventory {
    type UIDType = i32;

    fn get_uid(&self) -> &Self::UIDType {
        &self.id
    }
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_inventory"]
pub struct NewInventory {
    pub updated_at: Option<NaiveDateTime>,
    pub part_name: Option<String>,
    pub quantity: Option<i32>,
    pub date: Option<NaiveDate>,
    pub sold_out: Option<bool>,
    pub purchase_id: Option<i32>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "eb_inventory"]
pub struct UpdateInventory {
    pub id: i32,
    pub updated_at: Option<NaiveDateTime>,
    pub part_name: Option<String>,
    pub quantity: Option<i32>,
    pub date: Option<NaiveDate>,
    pub sold_out: Option<bool>,
    pub purchase_id: Option<i32>,
}

#[derive(Deserialize)]
pub struct DeleteInventory {
    pub id: i32,
}

// ----------------------------------------------------------------------------
// eb_miscellaneous
// ----------------------------------------------------------------------------

#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct Miscellaneous {
    #[serde(skip_serializing)]
    pub created_at: NaiveDateTime,

    #[serde(skip_serializing)]
    pub updated_at: Option<NaiveDateTime>,

    pub id: i32,
    pub description: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
}

impl Document for Miscellaneous {
    type UIDType = i32;

    fn get_uid(&self) -> &Self::UIDType {
        &self.id
    }
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_miscellaneous"]
pub struct NewMiscellaneous {
    pub updated_at: Option<NaiveDateTime>,
    pub description: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "eb_miscellaneous"]
pub struct UpdateMiscellaneous {
    pub id: i32,
    pub updated_at: Option<NaiveDateTime>,
    pub description: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
}

#[derive(Deserialize)]
pub struct DeleteMiscellaneous {
    pub id: i32,
}

// ----------------------------------------------------------------------------
// eb_purchases
// ----------------------------------------------------------------------------

#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct Purchase {
    #[serde(skip_serializing)]
    pub created_at: NaiveDateTime,

    #[serde(skip_serializing)]
    pub updated_at: Option<NaiveDateTime>,

    pub id: i32,
    pub company_name: Option<String>,
    pub vehicle_name: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
    pub relationship_id: Option<i32>,
}

impl Document for Purchase {
    type UIDType = i32;

    fn get_uid(&self) -> &Self::UIDType {
        &self.id
    }
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_purchases"]
pub struct NewPurchase {
    pub updated_at: Option<NaiveDateTime>,
    pub company_name: Option<String>,
    pub vehicle_name: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
    pub relationship_id: Option<i32>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "eb_purchases"]
pub struct UpdatePurchase {
    pub id: i32,
    pub updated_at: Option<NaiveDateTime>,
    pub company_name: Option<String>,
    pub vehicle_name: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
    pub relationship_id: Option<i32>,
}

#[derive(Deserialize)]
pub struct DeletePurchase {
    pub id: i32,
}

// ----------------------------------------------------------------------------
// eb_relationships
// ----------------------------------------------------------------------------

#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct Relationship {
    #[serde(skip_serializing)]
    pub created_at: NaiveDateTime,
    #[serde(skip_serializing)]
    pub updated_at: Option<NaiveDateTime>,

    pub id: i32,
    pub name: Option<String>,
    pub phone_number: Option<String>,
    pub address: Option<String>,
}

impl Document for Relationship {
    type UIDType = i32;

    fn get_uid(&self) -> &Self::UIDType {
        &self.id
    }
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_relationships"]
pub struct NewRelationship {
    pub updated_at: Option<NaiveDateTime>,
    pub name: Option<String>,
    pub phone_number: Option<String>,
    pub address: Option<String>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "eb_relationships"]
pub struct UpdateRelationship {
    pub id: i32,
    pub updated_at: Option<NaiveDateTime>,
    pub name: Option<String>,
    pub phone_number: Option<String>,
    pub address: Option<String>,
}

#[derive(Deserialize)]
pub struct DeleteRelationship {
    pub id: i32,
}

// ----------------------------------------------------------------------------
// eb_sales
// ----------------------------------------------------------------------------

#[derive(Debug, Queryable, Serialize, Deserialize)]
pub struct Sale {
    #[serde(skip_serializing)]
    pub created_at: NaiveDateTime,

    #[serde(skip_serializing)]
    pub updated_at: Option<NaiveDateTime>,

    pub id: i32,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
    pub quantity: Option<i32>,
    pub credit: Option<bool>,
    pub returned: Option<bool>,
    pub relationship_id: Option<i32>,
    pub purchase_id: Option<i32>,
    pub inventory_id: Option<i32>,
}

impl Document for Sale {
    type UIDType = i32;

    fn get_uid(&self) -> &Self::UIDType {
        &self.id
    }
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_sales"]
pub struct NewSale {
    pub updated_at: Option<NaiveDateTime>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
    pub quantity: Option<i32>,
    pub credit: Option<bool>,
    pub returned: Option<bool>,
    pub relationship_id: Option<i32>,
    pub purchase_id: Option<i32>,
    pub inventory_id: Option<i32>,
}

#[derive(AsChangeset, Deserialize)]
#[table_name = "eb_sales"]
pub struct UpdateSale {
    pub id: i32,
    pub updated_at: Option<NaiveDateTime>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
    pub quantity: Option<i32>,
    pub credit: Option<bool>,
    pub returned: Option<bool>,
    pub relationship_id: Option<i32>,
    pub purchase_id: Option<i32>,
    pub inventory_id: Option<i32>,
}

#[derive(Deserialize)]
pub struct DeleteSale {
    pub id: i32,
}

// ----------------------------------------------------------------------------
// eb_users
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct User {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub name: Option<String>,
    pub email: String,

    #[serde(skip_serializing)]
    pub password: String,
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_users"]
pub struct NewUser {
    pub updated_at: Option<NaiveDateTime>,
    pub name: Option<String>,
    pub email: String,
    pub password: String,
}
