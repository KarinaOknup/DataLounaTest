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

export type SkinportResponseItem = {
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

export type SkinportResponse = SkinportResponseItem[];