import { addResolveFunctionsToSchema } from 'graphql-tools';
import { getGraphQLProjectConfig } from 'graphql-config';

import resolvers from '../resolvers';

// Load the configuration from the provided `.graphqlconfig` file.
const config = getGraphQLProjectConfig(__dirname, 'management');

// Get the GraphQLSchema from the configuration.
const schema = config.getSchema();

// Attach the resolvers to the schema.
addResolveFunctionsToSchema({ schema, resolvers });

export default schema;
