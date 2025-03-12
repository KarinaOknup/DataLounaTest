// create purchase
import express, { Request, Response } from 'express';
import purchaseService from '../services/purchase';
import userService from '../services/user';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const data = {
        userId: Number(req.body?.user_id),
        productId: Number(req.body?.product_id),
        count: Number(req.body?.count || 1),
    }

    try {
        // better to use zod/joi or some diff library to check info in middleware
        // also i send there userId, but it better to get from token
        if (!data.userId || !data.productId) {
            throw new Error('User id and product id is required.');
        }
         
        if (data.count<1) {
            throw new Error('Count should be 1 or bigger.');
        }

        const purchaseId = await purchaseService.create(data);

        const userBalance = await userService.getBalance(data.userId);

        res.status(200).send({balance: userBalance, purchaseId});

    } catch (err){
        console.log('ERROR:', err);
        res.status(400).send(err);
    }
});

export default router;