import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import product from './routers/product';
import price from './routers/price';
import purchase from './routers/purchase';

const app: Express = express();
const port = 8100;

app.use(bodyParser.json({ limit: '50mb' }));

app.use((req: Request & {user?: { id: number}}, res: Response , next: NextFunction) => {
    const token = req.header('Authorization')?.match(/^Bearer (.*)$/)?.[1];

    try{
        if (token !== 'secret_token') {
            throw new Error('User unauthenticated.');
        };
        // jwt token didnt implemented
        // that is why will think that it is always user with id=1
        req.user = {
            id: 1
        };

        next();
    } catch (err) {
        res.status(401).send({ error: 'User unauthenticated.'});
    }
})

// get list of available products
app.use('/api/v1/product', product);
app.use('/api/v1/purchase', purchase);
app.use('/api/v1/price', price);

app.listen(port, () => console.log(`Running on port ${port}`));
