import { graphqlExpress } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import Context from 'talk-server/graph/context';
import { Db } from 'mongodb';

export interface GraphQLOptions {
    schema: GraphQLSchema;
    db: Db;
}

export default (opts: GraphQLOptions) =>
    graphqlExpress(req => ({
        schema: opts.schema,
        context: new Context({ db: opts.db, req }),
    }));
