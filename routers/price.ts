import express, { Response } from 'express';
import { Request } from '../types';
import fetch from "node-fetch";
import Redis from "redis"

const router = express.Router();

const redisClient = Redis.createClient({url: 'redis://localhost:6379' });

redisClient.on('ready', () => {
    console.log('Connected to redis');
  });

redisClient.on('error', err => {
    console.log('Error occurred while connection to redis server', err);
  });

await redisClient.connect();

type SkinportResponseItem = {
    market_hash_name: string;
    currency: string;
    suggested_price: number;
    item_page: string;
    market_page: string;
    min_price: number;
    max_price:number;
    mean_price:number;
    median_price:number;
    quantity: number;
    created_at: number;
    updated_at: number;
}

type SkinportResponse = SkinportResponseItem[];

// get prices from https://docs.skinport.com/items
// /api/v1/prices?fresh to escape redis cache
router.get('/', async (req: Request, res: Response) => {
    try {
        const cachedInfo = await redisClient.get('items_list');
        if (cachedInfo && !req.query.fresh) {
            console.log('Take info from redis cache.')
            res.send(JSON.parse(cachedInfo));
            return;
        }

        const response = await fetch(`https://api.skinport.com/v1/items`, {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'br'
            }
        });

        const result = <SkinportResponse> await response.json();

        if (result[0]) { 
            const constructedResult = result.map((item) => {
                return{
                    name: item.market_hash_name,
                    min_price: item.min_price,

                }
            })
            const TEN_MIN_IN_SEC = 10*60;
            await redisClient.set('items_list', JSON.stringify(constructedResult), {EX: TEN_MIN_IN_SEC})
            res.send(constructedResult)
            return;
        }

        res.send([])
    } catch (err) {
        res.status(400).send('Server error, please try one more time later.')
    }
})

export default router;