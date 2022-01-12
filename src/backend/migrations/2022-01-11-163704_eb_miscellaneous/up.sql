CREATE TABLE eb_miscellaneous (
	created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMPTZ,

	id SERIAL PRIMARY KEY,
	description VARCHAR (250),
	price DECIMAL (8, 2),
	date DATE
);
