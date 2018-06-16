import loaders from './loaders';
import { Request } from 'express';
import { Db } from 'mongodb';

export interface ContextOptions {
    req: Request;
    db: Db;
}

export default class Context {
    public loaders: ReturnType<typeof loaders>;
    public db: Db;

    constructor({ req, db }: ContextOptions) {
        this.loaders = loaders(this);
        this.db = db;
    }
}
