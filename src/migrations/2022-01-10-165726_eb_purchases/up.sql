CREATE TABLE IF NOT EXISTS eb_purchases (
	id SERIAL PRIMARY KEY,
	company_name VARCHAR (100),
	vehicle_name VARCHAR (100),
	price INTEGER,
	date DATE,
	relationship_id INTEGER,

	CONSTRAINT fk_relationship
		FOREIGN KEY (relationship_id)
		REFERENCES eb_relationships (id)
		ON DELETE SET NULL
);
