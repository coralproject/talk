import { graphqlExpress } from 'apollo-server-express';
import schema from './schema';
import TenantContext from './context';
import { Db } from 'mongodb';
import { Tenant } from 'talk-server/models/tenant';

export default (db: Db) =>
    graphqlExpress(async req => {
        return {
            schema,
            context: new TenantContext({ db, tenant: { id: '1' } as Tenant }),
        };
    });
