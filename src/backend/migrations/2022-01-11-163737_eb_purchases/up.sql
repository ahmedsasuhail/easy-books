CREATE TABLE eb_purchases (
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ,

	id SERIAL PRIMARY KEY,
	company_name VARCHAR (100),
	vehicle_name VARCHAR (100),
	price DECIMAL (8, 2),
	date DATE,
	relationship_id INTEGER,

	CONSTRAINT fk_relationship
		FOREIGN KEY (relationship_id)
		REFERENCES eb_relationships (id)
		ON DELETE SET NULL
);
