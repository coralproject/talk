import {createNetworkInterface} from 'apollo-client';
import * as Storage from '../helpers/storage';

export default function getNetworkInterface(apiUrl = '/api/v1/graph/ql', headers = {}) {
  return new createNetworkInterface({
    uri: apiUrl,
    opts: {
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${Storage.getItem('token')}`,
        ...headers
      },
    },
  });
}
