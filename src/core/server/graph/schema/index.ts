import {
    addMockFunctionsToSchema,
    addResolveFunctionsToSchema,
} from 'graphql-tools';
import resolvers from 'talk-server/graph/resolvers';
import { getGraphQLProjectConfig } from 'graphql-config';

// Load the configuration from the provided `.graphqlconfig` file.
const config = getGraphQLProjectConfig();

// Get the GraphQLSchema from the configuration.
const schema = config.getSchema();

// Attach the resolvers to the schema.
addResolveFunctionsToSchema({ schema, resolvers });

// // Attach resolvers to the schema.
// addMockFunctionsToSchema({
//     schema,
//     mocks: {
//         Cursor: () => new Date().toISOString(),
//     },
// }); // FIXME: remove mocks

export default schema;
