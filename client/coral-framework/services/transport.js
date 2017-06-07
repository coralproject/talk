import {createNetworkInterface} from 'apollo-client';
import {getAuthToken} from '../helpers/request';

//==============================================================================
// NETWORK INTERFACE
//==============================================================================

const networkInterface = createNetworkInterface({
  uri: '/api/v1/graph/ql',
  opts: {
    credentials: 'same-origin'
  }
});

//==============================================================================
// MIDDLEWARES
//==============================================================================

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }

    let authToken = getAuthToken();
    if (authToken) {
      req.options.headers['authorization'] = `Bearer ${authToken}`;
    }

    next();
  }
}]);

export {
  networkInterface
};
