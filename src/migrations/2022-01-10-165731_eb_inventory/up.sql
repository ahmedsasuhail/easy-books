CREATE TABLE IF NOT EXISTS eb_inventory (
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
