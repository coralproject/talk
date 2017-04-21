import {IntrospectionFragmentMatcher} from 'apollo-client';

// TODO this is a short-term fix
// we need to set up something to query the server for the schema before ApolloClient initialization
// https://github.com/apollographql/apollo-client/issues/1555#issuecomment-295834774
const fm = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: 'Action',
          possibleTypes: [
            {name: 'FlagAction'},
            {name: 'LikeAction'},
            {name: 'DontAgreeAction'}
          ],
        },
        {
          kind: 'INTERFACE',
          name: 'ActionSummary',
          possibleTypes: [
            {name: 'FlagActionSummary'},
            {name: 'LikeActionSummary'},
            {name: 'DontAgreeActionSummary'}
          ],
        }
      ],
    },
  }
});

export default fm;
