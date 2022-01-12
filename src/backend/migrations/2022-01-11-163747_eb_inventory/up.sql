CREATE TABLE eb_inventory (
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ,

	id SERIAL PRIMARY KEY,
	part_name VARCHAR (100),
	quantity INTEGER,
	date DATE,
	sold_out BOOLEAN DEFAULT 'f',
	purchase_id INTEGER,

	CONSTRAINT fk_purchase
		FOREIGN KEY (purchase_id)
		REFERENCES eb_purchases (id)
		ON DELETE SET NULL
);
