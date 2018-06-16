import loaders from './loaders';
import { Db } from 'mongodb';
import { Tenant } from 'talk-server/models/tenant';

export interface ContextOptions {
    tenant?: Tenant;
    db: Db;
}

export default class TenantContext {
    public loaders: ReturnType<typeof loaders>;
    public db: Db;
    public tenant?: Tenant;

    constructor({ tenant, db }: ContextOptions) {
        this.tenant = tenant;
        this.loaders = loaders(this);
        this.db = db;
    }
}
