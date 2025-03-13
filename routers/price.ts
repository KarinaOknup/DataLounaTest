import express, { Response } from 'express';
import fetch from "node-fetch";

import { Request, SkinportResponse} from '../types';
import redisClient from '../redis';

const router = express.Router();


const TEN_MIN_IN_SEC = 10*60;

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

        const [tradableItems,  nonTradableItems] = <[SkinportResponse, SkinportResponse]> await Promise.all([
            fetch(`https://api.skinport.com/v1/items?tradable=true`, {
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'br'
                }
            }).then(res => res.json()),
            fetch(`https://api.skinport.com/v1/items`, {
                method: 'GET',
                headers: {
                    'Accept-Encoding': 'br'
                }
            }).then(res => res.json())
        ]);

        if (!tradableItems[0] && nonTradableItems[0]) { 
            await redisClient.set('items_list', JSON.stringify([]), {EX: TEN_MIN_IN_SEC})
           res.send([])
           return;
       }
        
       const mapByName = new Map();
    
        tradableItems.forEach(item => {
            const name = item.market_hash_name;
            if (!mapByName[name]) mapByName[name] = {};
            if(mapByName[name].tradable_min_price > item.min_price){
                mapByName[name].tradable_min_price = item.min_price;
            }
            if(!mapByName[name].tradable_min_price){
                mapByName[name].tradable_min_price = item.min_price;
            }
        });
    
        nonTradableItems.forEach(item => {
            const name = item.market_hash_name;
            if (!mapByName[name]) mapByName[name] = {};
            if(mapByName[name].non_tradable_min_price > item.min_price){
                mapByName[name].non_tradable_min_price = item.min_price;
            }
            if(!mapByName[name].non_tradable_min_price){
                mapByName[name].non_tradable_min_price = item.min_price;
            }

        });
    
        const constructedResult = Object.keys(mapByName).map(name => ({
            name,
            tradable: mapByName[name].tradable_min_price ?? null,
            min: mapByName[name].non_tradable_min_price ?? null
        }));

        await redisClient.set('items_list', JSON.stringify(constructedResult), {EX: TEN_MIN_IN_SEC})
        res.send(constructedResult)
    } catch (err) {
        res.status(400).send('Server error, please try one more time later.')
    }
})

export default router;