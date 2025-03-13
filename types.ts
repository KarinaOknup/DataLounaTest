import { Request as ExpressRequest } from 'express';

export type Request = ExpressRequest & {user?: { id: number}};

export type Product = {
    id: number;
    name: string;
    price: number;
    count: number;
}

export type User = {
    id: number;
    name: string;
    balance: number;
    status: string;
}