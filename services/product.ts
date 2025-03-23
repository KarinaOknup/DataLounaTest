import db from '../db';

async function list(){
    const products = await db.product.findMany({
        where: {
            status: 'active'
        },
        select: {
            name: true,
            count: true,
            price: true,
        },
    }
    );

    return products
}

async function getById(productId) {
    const product = await db.product.findFirst({
        where: {
            id: productId,
            status: 'active'
        },
        select: {
            count: true,
            price: true,
        },
    }
    );

    if (!product) {
        throw new Error('Product don\'t exist.');
    }

    return product;
}

export default {
    list,
    getById,
}