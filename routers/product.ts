import express, { Request, Response } from 'express';
import productService from '../services/product';
import purchaseService from '../services/purchase';
import userService from '../services/user';

const router = express.Router();

//get available products
router.get('/', async (req: Request, res: Response) => {
    const result = await productService.list()
    res.status(200).send(result);
});

export default router;