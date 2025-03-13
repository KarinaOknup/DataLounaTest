import db from '../db';
import userService from './user';
import productService from './product';
import { Product, User} from './types';


async function create(data: {userId: number; productId: number; count: number}){
    const userBalance = await userService.getBalance(data.userId);
    const product = await productService.getById(data.productId);

    if (product.count < data.count) {
        throw new Error('Not enough products.');
    }

    if ((product.count * product.price) > userBalance) {
        throw new Error('Not enough funds on balance.');
    }

    let purchaseId;

    await db.transaction(async (clientDb) => {
        const products : Pick<Product,'price' | 'count'>[] = await clientDb.query(
            `SELECT count, price FROM products
                WHERE id = $1 FOR UPDATE
            `, 
            [data.productId]
        );
        if (!products.length || products[0].count < data.count) {
            throw new Error('Not enough products.');
        }

        const users : Pick<User,'balance'>[] = await clientDb.query(
            `SELECT balance FROM users 
                WHERE id = $1 FOR UPDATE`, 
            [data.userId]
        );
        const total_price = products[0].price * data.count;

        if (!users.length || users[0].balance < total_price) {
            throw new Error('Not enough funds on balance.');
        }

        await clientDb.query(
            `UPDATE products SET count = count - $1
                WHERE id = $2`, 
            [data.count, data.productId]
        );

        await clientDb.query(
            `UPDATE users SET balance = balance - $1
                WHERE id = $2`, 
            [total_price, data.userId]
        );

        const purchases = await clientDb.query(
            `INSERT INTO purchases (user_id, product_id, product_count, total_price, status)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id`,
            [data.userId, data.productId, data.count, total_price, 'pending']
        );
        purchaseId = purchases[0].id;
    })

    return purchaseId;
}

export default {
    create
}
