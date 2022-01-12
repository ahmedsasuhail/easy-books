table! {
    eb_inventory (id) {
        created_at -> Timestamptz,
        updated_at -> Nullable<Timestamptz>,
        id -> Int4,
        part_name -> Nullable<Varchar>,
        quantity -> Nullable<Int4>,
        date -> Nullable<Date>,
        sold_out -> Nullable<Bool>,
        purchase_id -> Nullable<Int4>,
    }
}

table! {
    eb_miscellaneous (id) {
        created_at -> Timestamptz,
        updated_at -> Nullable<Timestamptz>,
        id -> Int4,
        description -> Nullable<Varchar>,
        price -> Nullable<Numeric>,
        date -> Nullable<Date>,
    }
}

table! {
    eb_purchases (id) {
        created_at -> Timestamptz,
        updated_at -> Nullable<Timestamptz>,
        id -> Int4,
        company_name -> Nullable<Varchar>,
        vehicle_name -> Nullable<Varchar>,
        price -> Nullable<Numeric>,
        date -> Nullable<Date>,
        relationship_id -> Nullable<Int4>,
    }
}

table! {
    eb_relationships (id) {
        created_at -> Timestamptz,
        updated_at -> Nullable<Timestamptz>,
        id -> Int4,
        name -> Nullable<Varchar>,
        phone_number -> Nullable<Varchar>,
        address -> Nullable<Varchar>,
    }
}

table! {
    eb_sales (id) {
        created_at -> Timestamptz,
        updated_at -> Nullable<Timestamptz>,
        id -> Int4,
        price -> Nullable<Numeric>,
        date -> Nullable<Date>,
        quantity -> Nullable<Int4>,
        credit -> Nullable<Bool>,
        returned -> Nullable<Bool>,
        relationship_id -> Nullable<Int4>,
        purchase_id -> Nullable<Int4>,
        inventory_id -> Nullable<Int4>,
    }
}

table! {
    eb_users (email) {
        created_at -> Timestamptz,
        updated_at -> Nullable<Timestamptz>,
        name -> Nullable<Varchar>,
        email -> Varchar,
        password -> Text,
    }
}

joinable!(eb_sales -> eb_inventory (inventory_id));

allow_tables_to_appear_in_same_query!(
    eb_inventory,
    eb_miscellaneous,
    eb_purchases,
    eb_relationships,
    eb_sales,
    eb_users,
);
