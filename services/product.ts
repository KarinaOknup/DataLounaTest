import db from '../db';
import { Product } from '../types';

async function list(){
    const products = await db.query(`
        SELECT name, count, price FROM products
        WHERE status = 'active'
    `);
    return products
}

async function getById(id) {
    const  products : Pick<Product,'price' | 'count'>[] = await db.query(`
        SELECT price, count FROM products
        WHERE id = ${id}
        AND status = 'active'
    `);

    if (!products[0]) {
        throw new Error('Product don\'t exist.');
    }

    return products[0];
}

export default {
    list,
    getById,
}