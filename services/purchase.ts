import db from '../db';
import userService from './user';
import productService from './product';

import Decimal from 'decimal.js';

async function create(data: {userId: number; productId: number; count: number}){
    const userBalance = await userService.getBalance(data.userId);
    const product = await productService.getById(data.productId);

    if (product.count < data.count) {
        throw new Error('Not enough products.');
    }

    if (!new Decimal(product.count).mul(product.price).lessThan(userBalance)) {
        throw new Error('Not enough funds on balance.');
    }
    let purchaseId;

    await db.$transaction(async (tx) => {
        const product  = await tx.product.findFirst({
            where: {
                id: data.productId
            },
            select: {
                count: true,
                price: true,
            },
        }
        );
        if (!product || product.count < data.count) {
            throw new Error('Not enough products.');
        }

        const user = await tx.user.findFirst({
            where: {
                id: data.userId
            },
            select: {
                balance: true,
            },
        }
        );

        const total_price = new Decimal(product.price).mul(data.count);

        console.log('1', user.balance, total_price);

        if (!user || (!total_price.lessThan(user.balance))) {
            throw new Error('Not enough funds on balance.');
        }

        await tx.product.update({
            where: {
                id: data.productId,
            },
            data: {
              count: {
                decrement: data.count
              }
            },
          });

        await tx.user.update({
            where: {
                id: data.userId,
            },
            data: {
                balance: {
                    decrement: total_price
                }
            },
        })
        const purchase = await tx.purchase.create({
            data: {
                userId: data.userId,
                productId: data.productId,
                productCount: data.count,
                totalPrice: total_price,
                status: 'pending'
            },
        })

        purchaseId = purchase.id;
    })

    return purchaseId;
}

export default {
    create
}
