import { graphqlExpress } from 'apollo-server-express';
import schema from './schema';
import Context from './context';
import { Db } from 'mongodb';

export default (db: Db) =>
    graphqlExpress(async req => {
        return {
            schema,
            context: new Context({ db }),
        };
    });
