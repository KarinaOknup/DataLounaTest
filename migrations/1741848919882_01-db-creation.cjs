/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.sql(`
        DO $$
        BEGIN
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                number VARCHAR(20) UNIQUE NOT NULL,
                address TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(10) CHECK (status IN ('deleted', 'active', 'banned')) NOT NULL,
                balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
            );

            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                count INT NOT NULL CHECK (count >= 0),
                price DECIMAL(10, 2) NOT NULL CHECK (price >= 0.00),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(10) CHECK (status IN ('deleted', 'active')) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS purchases (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                product_count INT NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0.00),
                status VARCHAR(10) CHECK (status IN ('pending', 'deleted', 'cancelled', 'received')) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_purchases_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                CONSTRAINT fk_purchases_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
            );

            INSERT INTO users (name, number, address, status, balance) VALUES
            ('Карина Пунько', '891617211312151', 'г.Сеул, ул.Мёндон, д. 10', 'active',10000);

            INSERT INTO products (name, count, price, status) VALUES
            ('One Piece', 10, 99.99, 'active'),
            ('Naruto', 5, 149.50, 'active'),
            ('Attack on Titan', 7, 200.00, 'active'),
            ('Death Note', 3, 49.99, 'active'),
            ('Dragon Ball', 15, 75.75, 'active'),
            ('Demon Slayer', 20, 120.00, 'active'),
            ('Tokyo Ghoul', 8, 300.25, 'active'),
            ('Fullmetal Alchemist', 6, 199.99, 'active'),
            ('Hunter x Hunter', 9, 89.95, 'active'),
            ('My Hero Academia', 12, 50.00, 'active'),
            ('JoJos Bizarre Adventure', 4, 135.00, 'active'),
            ('Bleach', 14, 80.00, 'active'),
            ('Chainsaw Man', 2, 500.00, 'active'),
            ('Berserk', 11, 45.45, 'active'),
            ('Vinland Saga', 18, 95.00, 'active'),
            ('Re:Zero', 1, 999.99, 'active'),
            ('Sword Art Online', 13, 25.50, 'active'),
            ('Black Clover', 16, 155.75, 'active'),
            ('Fairy Tail', 10, 60.60, 'active'),
            ('The Promised Neverland', 5, 110.10, 'active');

        END;
        $$
        `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
   pgm.sql(`
    DO $$
    BEGIN
        DROP TABLE users;
        DROP TABLE products;
        DROP TABLE purchases;
    END;
    $$
    `)
};
