CREATE TABLE eb_sales (
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ,

	id SERIAL PRIMARY KEY,
	price DECIMAL (8, 2),
	date DATE,
	quantity INTEGER,
	credit BOOLEAN DEFAULT 'f',
	returned BOOLEAN DEFAULT 'f',
	relationship_id INTEGER,
	purchase_id INTEGER,
	inventory_id INTEGER,

	CONSTRAINT fk_relationship
		FOREIGN KEY (relationship_id)
		REFERENCES eb_relationships (id)
		ON DELETE SET NULL,

	CONSTRAINT fk_purchase
		FOREIGN KEY (purchase_id)
		REFERENCES eb_purchases (id)
		ON DELETE SET NULL,

	CONSTRAINT fk_inventory
		FOREIGN KEY (inventory_id)
		REFERENCES eb_inventory (id)
		ON DELETE SET NULL
);
