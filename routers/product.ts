import express, { Response } from 'express';
import { Request } from '../types';
import productService from '../services/product';

const router = express.Router();

//get available products
router.get('/', async (req: Request, res: Response) => {
    const result = await productService.list()
    res.status(200).send(result);
});

export default router;