import db from '../db';

async function getBalance(userId) {
    const user = await db.user.findFirst({
        where: {
            id: userId,
            status: 'active'
        },
        select: {
            balance: true,
        },
    }
    );

    if (!user) {
        throw new Error('User don\'t exist.');
    }

    return user.balance;
}

export default {
    getBalance
}