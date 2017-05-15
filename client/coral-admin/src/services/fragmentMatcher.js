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
          name: 'UserError',
          possibleTypes: [
            {name: 'GenericUserError'},
            {name: 'ValidationUserError'}
          ]
        },
        {
          kind: 'INTERFACE',
          name: 'Response',
          possibleTypes: [
            {name: 'CreateCommentResponse'},
            {name: 'CreateFlagResponse'},
            {name: 'CreateDontAgreeResponse'},
            {name: 'DeleteActionResponse'},
            {name: 'SetUserStatusResponse'},
            {name: 'SuspendUserResponse'},
            {name: 'SetCommentStatusResponse'},
            {name: 'AddCommentTagResponse'},
            {name: 'RemoveCommentTagResponse'},
            {name: 'IgnoreUserResponse'},
            {name: 'StopIgnoringUserResponse'}
          ]
        },
        {
          kind: 'INTERFACE',
          name: 'Action',
          possibleTypes: [
            {name: 'DefaultAction'},
            {name: 'FlagAction'},
            {name: 'DontAgreeAction'}
          ]
        },
        {
          kind: 'INTERFACE',
          name: 'ActionSummary',
          possibleTypes: [
            {name: 'DefaultActionSummary'},
            {name: 'FlagActionSummary'},
            {name: 'DontAgreeActionSummary'}
          ]
        },
        {
          kind: 'INTERFACE',
          name: 'AssetActionSummary',
          possibleTypes: [
            {name: 'DefaultAssetActionSummary'},
            {name: 'FlagAssetActionSummary'}
          ]
        }
      ]
    }
  }
});

export default fm;
