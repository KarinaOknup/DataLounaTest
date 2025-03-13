import db from '../db';
import { User } from '../types';

async function getBalance(id) {
    const users : Pick<User,'balance'>[] = await db.query(`
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