import {createNetworkInterface} from 'apollo-client';
import * as Storage from '../helpers/storage';

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
    req.options.headers['authorization'] = `Bearer ${Storage.getItem('token')}`;
    next();
  }
}]);

export {
  networkInterface
};
