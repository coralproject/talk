import ApolloClient, {addTypename} from 'apollo-client';
import {networkInterface} from 'coral-framework/services/transport';
import fragmentMatcher from './fragmentMatcher';

export const client = new ApolloClient({
  fragmentMatcher,
  addTypename: true,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  networkInterface
});
