import db from '../db';

type Product = {
    id: number;
    name: string;
    price: number;
    count: number;
}

async function list(){
    const products = await db.query(`
        SELECT name, count, price FROM products
        WHERE status = 'active'
    `);
    return products.rows
}

async function getById(id) {
    const  {rows: products} : {rows: Pick<Product,'price' | 'count'>[]} = await db.query(`
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