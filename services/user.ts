import db from '../db';

type User = {
    id: number;
    name: string;
    balance: number;
    status: string;
}

async function getBalance(id) {
    const {rows: users} : {rows: Pick<User,'balance'>[]} = await db.query(`
        SELECT balance FROM users
        WHERE id = ${id}
        AND status = 'active'
    `); 

    if (!users[0]) {
        throw new Error('User don\'t exist.');
    }

    return users[0].balance;
}

export default {
    getBalance
}