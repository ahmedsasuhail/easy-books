use bigdecimal::BigDecimal;
use chrono::{NaiveDate, NaiveDateTime};
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::*;

// ----------------------------------------------------------------------------
// eb_inventory
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct Inventory {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub id: usize,
    pub part_name: Option<String>,
    pub quantity: Option<usize>,
    pub date: Option<NaiveDate>,
    pub sold_out: Option<bool>,
    pub purchase_id: Option<usize>,
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

// ----------------------------------------------------------------------------
// eb_miscellaneous
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct Miscellaneous {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub id: usize,
    pub description: Option<String>,
    pub price: Option<f32>,
    pub date: Option<NaiveDate>,
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_miscellaneous"]
pub struct NewMiscellaneous {
    pub updated_at: Option<NaiveDateTime>,
    pub description: Option<String>,
    pub price: Option<BigDecimal>,
    pub date: Option<NaiveDate>,
}

// ----------------------------------------------------------------------------
// eb_purchases
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct Purchase {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub id: usize,
    pub company_name: Option<String>,
    pub vehicle_name: Option<String>,
    pub price: Option<f32>,
    pub date: Option<NaiveDate>,
    pub relationship_id: Option<usize>,
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

// ----------------------------------------------------------------------------
// eb_relationships
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct Relationship {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub id: usize,
    pub name: Option<String>,
    pub phone_number: Option<String>,
    pub address: Option<String>,
}

#[derive(Insertable, Deserialize)]
#[table_name = "eb_relationships"]
pub struct NewRelationship {
    pub updated_at: Option<NaiveDateTime>,
    pub name: Option<String>,
    pub phone_number: Option<String>,
    pub address: Option<String>,
}

// ----------------------------------------------------------------------------
// eb_sales
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct Sale {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub id: usize,
    pub price: Option<f32>,
    pub date: Option<NaiveDate>,
    pub quantity: Option<f32>,
    pub credit: Option<bool>,
    pub returned: Option<bool>,
    pub relationship_id: Option<usize>,
    pub purchase_id: Option<usize>,
    pub inventory_id: Option<usize>,
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

// ----------------------------------------------------------------------------
// eb_users
// ----------------------------------------------------------------------------

#[derive(Queryable, Serialize)]
pub struct User {
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
    pub name: Option<String>,
    pub email: String,
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
