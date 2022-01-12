CREATE TABLE IF NOT EXISTS eb_relationships (
	id SERIAL PRIMARY KEY,
	name VARCHAR (100),
	phone_number VARCHAR (10) UNIQUE,
	address VARCHAR (250)
);
