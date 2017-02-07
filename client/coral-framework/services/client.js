import ApolloClient, {addTypename} from 'apollo-client';
import getNetworkInterface from './transport';

export const client = new ApolloClient({
  connectToDevTools: true,
  queryTransformer: addTypename,
  dataIdFromObject: (result) => {
    if (result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
      return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
    }
    return null;
  },
  networkInterface: getNetworkInterface()
});
