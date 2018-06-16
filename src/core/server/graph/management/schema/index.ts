import { addMockFunctionsToSchema } from 'graphql-tools';
import { getGraphQLProjectConfig } from 'graphql-config';

// Load the configuration from the provided `.graphqlconfig` file.
const config = getGraphQLProjectConfig(__dirname, 'management');

// Get the GraphQLSchema from the configuration.
const schema = config.getSchema();

// Attach resolvers to the schema.
addMockFunctionsToSchema({
    schema,
    mocks: {
        Cursor: () => new Date().toISOString(),
    },
}); // FIXME: remove mocks

export default schema;
