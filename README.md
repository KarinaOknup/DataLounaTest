## Intro
hi, my name is Karina Punko and i'm Software Developer.
this is test task to company DataLouna.

hope u spend some time to check my solution.

i spend more than i expected, but 
- didn't add enough validation 
- didn't get what means 2 min price

BUT PLEASE CHECK THINGS WHICH I'VE DONE
and if u have time explain about what exactly u mean with 2 min prices (i see only one)

## How to start it
u can see infra folder (it is to start faster)
steps
- prepare your docker daemon 
- in first terminal run `npm run infra`
- scheme i use for db
    <details open>
    <summary>SQL</summary>
    <pre>
        users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            number VARCHAR(20) UNIQUE NOT NULL,
            address TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(10) CHECK (status IN ('deleted', 'active', 'banned')) NOT NULL,
            balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
        );

        products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            count INT NOT NULL CHECK (count >= 0),
            price DECIMAL(10, 2) NOT NULL CHECK (price >= 0.00),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(10) CHECK (status IN ('deleted', 'active')) NOT NULL
        );

        purchases (
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
    </pre>
    </details>
- in second terminal run `npm run dev`
- dont forget to use in request Auth Bearer token "secret_token" and enjoy roasting my code

P.S. Feel free to criticize! Even if my code is so terrible that there's nothing to comment on, I'd still appreciate any feedback :sparkles:
