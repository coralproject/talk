import {
    addMockFunctionsToSchema,
    addResolveFunctionsToSchema,
} from 'graphql-tools';
import resolvers from '../resolvers';
import { getGraphQLProjectConfig } from 'graphql-config';

// Load the configuration from the provided `.graphqlconfig` file.
const config = getGraphQLProjectConfig(__dirname, 'tenant');

// Get the GraphQLSchema from the configuration.
const schema = config.getSchema();

// Attach the resolvers to the schema.
addResolveFunctionsToSchema({ schema, resolvers });

export default schema;
