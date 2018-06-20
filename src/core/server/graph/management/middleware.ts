import { Db } from 'mongodb';
import { GraphQLSchema } from 'graphql';

import { graphqlMiddleware } from 'talk-server/graph/common/middleware';
import { Config } from 'talk-server/config';

import Context from './context';

export default (schema: GraphQLSchema, config: Config, db: Db) =>
    graphqlMiddleware(config, async () => ({
        schema,
        context: new Context({ db }),
    }));
