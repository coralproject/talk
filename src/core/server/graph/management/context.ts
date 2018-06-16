import { Db } from 'mongodb';

export interface ContextOptions {
    db: Db;
}

export default class TenantContext {
    public db: Db;

    constructor({ db }: ContextOptions) {
        this.db = db;
    }
}
