import ApolloClient, {addTypename} from 'apollo-client';
import getNetworkInterface from './transport';

export const client = new ApolloClient({
  queryTransformer: addTypename,
  networkInterface: getNetworkInterface()
});
